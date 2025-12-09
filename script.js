/* script.js - Refactor final dengan DUA TAHAPAN ADMIN */
(() => {
  "use strict";

  // -------------------
  // Config / State
  // -------------------
  const SHEET_ID = '1rCXUBCO_Yo_QbVseleXOVxcTxBu2stqHolCzVHt2V38';
  const RANGE = 'Sheet1!A:D';
  const API_KEY = 'AIzaSyBBQrCTUEtB_4SDudVzmmcFRXLP614FZZc';

  let LOWER_LIMIT = parseFloat(localStorage.getItem('lowerLimit')) || 55;
  let UPPER_LIMIT = parseFloat(localStorage.getItem('upperLimit')) || 65;

  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = '123';

  // State
  let currentLanguage = localStorage.getItem('lang') || 'id';
  let MACHINE_NAME = localStorage.getItem("machineName") || "-";
  let PART_NAME = localStorage.getItem("partName") || "-";
  let PART_NUMBER = localStorage.getItem("partNumber") || "-";
  
  // Variabel status login admin
  let isAdminLoggedIn = sessionStorage.getItem("isAdmin") === "true" || false;

  let cycleTimeChart = null;
  let statusChart = null;
  let autoRefreshInterval = null;

  let tableRowsAll = [];
  let filteredTableRows = [];
  let tableHeaders = [];
  let currentPage = 1;
  let rowsPerPage = 10;
  let currentSortIndex = null;
  let sortDirection = 'asc';

  let filterStartDate = null;
  let filterEndDate = null;

  // Utilities
  const $ = (id) => document.getElementById(id);

  // -------------------
  // TRANSLATIONS
  // -------------------
  if (typeof translations === 'undefined') {
    window.translations = {
      id: { 
        title: 'Dashboard', 
        mainTitle: 'Dashboard', 
        subTitle: '', 
        loadingMessage: 'Memuat...', 
        lastUpdatedPrefix: 'Terakhir diperbarui:', 
        cycleTimeLabel: 'Waktu (detik)', 
        cycleLabel: 'Cycle', 
        rowsPerPage: ' / halaman', 
        statusLower: 'LOWER', 
        statusNormal: 'NORMAL', 
        statusOver: 'OVER',
        limitError: 'Limit bawah harus lebih kecil dari limit atas dan keduanya positif.',
        saveSuccess: 'Limits berhasil disimpan!',
        resetSuccess: 'Limits berhasil direset ke default!',
        tableHeader0: 'Timestamp',
        tableHeader1: 'Cycle Count',
        tableHeader2: 'Cycle Time',
        tableHeader3: 'Status',
        statMaxCycle: 'Cycle Time Tercepat',
        statToday: 'Hari Ini',
        statStatusPrefix: 'Status:',
        loginTitle: 'Login Admin',
        usernamePlaceholder: 'Username',
        passwordPlaceholder: 'Password',
        loginButton: 'Login',
        loginSuccess: 'Login Berhasil!',
        loginError: 'Username atau password salah.',
        adminSettings: 'Pengaturan Admin',
        machineLabel: 'MESIN',
        partNameLabel: 'NAMA PART',
        partNumberLabel: 'NOMOR PART',
        currentLowerLabel: 'Lower Limit',
        currentUpperLabel: 'Upper Limit',
        newLowerLabel: 'Lower Limit Baru',
        newUpperLabel: 'Upper Limit Baru',
        saveButton: 'Simpan',
        resetButton: 'Reset',
        resetDataButton: 'Reset Data',
        saveMachinePartButton: 'Simpan',
        closeButton: 'Tutup'
      },
      en: { 
        title: 'Dashboard', 
        mainTitle: 'Dashboard', 
        subTitle: '', 
        loadingMessage: 'Loading...', 
        lastUpdatedPrefix: 'Last updated:', 
        cycleTimeLabel: 'Time (seconds)', 
        cycleLabel: 'Cycle', 
        rowsPerPage: ' / page', 
        statusLower: 'LOWER', 
        statusNormal: 'NORMAL', 
        statusOver: 'OVER',
        limitError: 'Lower limit must be less than upper limit and both positive.',
        saveSuccess: 'Limits saved successfully!',
        resetSuccess: 'Limits reset to default!',
        tableHeader0: 'Timestamp',
        tableHeader1: 'Cycle Count',
        tableHeader2: 'Cycle Time',
        tableHeader3: 'Status',
        statMaxCycle: 'Fastest Cycle Time',
        statToday: 'Today',
        statStatusPrefix: 'Status:',
        loginTitle: 'Admin Login',
        usernamePlaceholder: 'Username',
        passwordPlaceholder: 'Password',
        loginButton: 'Login',
        loginSuccess: 'Login Successful!',
        loginError: 'Incorrect username or password.',
        adminSettings: 'Admin Settings',
        machineLabel: 'MACHINE',
        partNameLabel: 'PART NAME',
        partNumberLabel: 'PART NUMBER',
        currentLowerLabel: 'Lower Limit',
        currentUpperLabel: 'Upper Limit',
        newLowerLabel: 'New Lower Limit',
        newUpperLabel: 'New Upper Limit',
        saveButton: 'Save',
        resetButton: 'Reset',
        resetDataButton: 'Reset Data',
        saveMachinePartButton: 'Save',
        closeButton: 'Close'
      }
    };
  }

  function tr(key) {
    return (translations && translations[currentLanguage] && translations[currentLanguage][key]) || key;
  }

  // -------------------
  // Fungsi untuk Modal Admin
  // -------------------
  function openAdminLogin() {
    const loginModal = $('adminLoginModal');
    if (loginModal) {
      loginModal.style.display = 'flex';
      
      // Reset form login
      const usernameInput = $('adminUsername');
      const passwordInput = $('adminPassword');
      const loginMessage = $('loginMessage');
      
      if (usernameInput) usernameInput.value = '';
      if (passwordInput) passwordInput.value = '';
      if (loginMessage) {
        loginMessage.textContent = '';
        loginMessage.style.color = '';
      }
    }
  }

  function closeAdminLogin() {
    const loginModal = $('adminLoginModal');
    if (loginModal) loginModal.style.display = 'none';
  }

  function openAdminSettings() {
    const settingsModal = $('adminSettingsModal');
    if (settingsModal) {
      // Load current limits
      const savedLower = localStorage.getItem('lowerLimit') || LOWER_LIMIT;
      const savedUpper = localStorage.getItem('upperLimit') || UPPER_LIMIT;

      const currentLowerEl = $('currentLower');
      const currentUpperEl = $('currentUpper');
      const newLowerEl = $('newLowerLimit');
      const newUpperEl = $('newUpperLimit');

      if (currentLowerEl) currentLowerEl.textContent = parseFloat(savedLower).toFixed(2);
      if (currentUpperEl) currentUpperEl.textContent = parseFloat(savedUpper).toFixed(2);
      if (newLowerEl) newLowerEl.value = savedLower;
      if (newUpperEl) newUpperEl.value = savedUpper;

      // Load machine/part info
      const adminMachine = $('adminMachine');
      const adminPartName = $('adminPartName');
      const adminPartNumber = $('adminPartNumber');
      
      if (adminMachine) adminMachine.value = localStorage.getItem('machineName') || MACHINE_NAME || '-';
      if (adminPartName) adminPartName.value = localStorage.getItem('partName') || PART_NAME || '-';
      if (adminPartNumber) adminPartNumber.value = localStorage.getItem('partNumber') || PART_NUMBER || '-';

      settingsModal.style.display = 'flex';
    }
  }

  function closeAdminSettings() {
    const settingsModal = $('adminSettingsModal');
    if (settingsModal) settingsModal.style.display = 'none';
  }

  function adminLogin() {
    const user = ($('adminUsername') || {}).value;
    const pass = ($('adminPassword') || {}).value;
    const msg = $('loginMessage');

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      isAdminLoggedIn = true;
      sessionStorage.setItem("isAdmin", "true");
      
      if (msg) { 
        msg.textContent = tr('loginSuccess'); 
        msg.style.color = 'green'; 
      }
      
      // Tutup modal login, buka modal settings setelah delay
      setTimeout(() => {
        closeAdminLogin();
        openAdminSettings();
      }, 1000);
      
    } else {
      if (msg) { 
        msg.textContent = tr('loginError'); 
        msg.style.color = 'red'; 
      }
      isAdminLoggedIn = false;
      sessionStorage.removeItem("isAdmin");
    }
  }

  // -------------------
  // Update UI translations
  // -------------------
  function updateTextContent(lang) {
    currentLanguage = lang;
    localStorage.setItem('lang', lang);

    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });

    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
      const key = el.getAttribute('data-key-placeholder');
      if (translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
    });

    // Update modal titles
    const loginModalTitle = $('adminLoginTitle');
    if (loginModalTitle) loginModalTitle.textContent = tr('loginTitle');
    
    const settingsModalTitle = $('adminSettingsTitle');
    if (settingsModalTitle) settingsModalTitle.textContent = tr('adminSettings');

    // Update button texts
    const loginBtn = $('loginAdminBtn');
    if (loginBtn) loginBtn.textContent = tr('loginButton');
    
    const saveLimitsBtn = $('saveLimitsBtn');
    if (saveLimitsBtn) saveLimitsBtn.textContent = tr('saveButton');
    
    const resetLimitsBtn = $('resetLimitsBtn');
    if (resetLimitsBtn) resetLimitsBtn.textContent = tr('resetButton');
    
    const resetDataBtn = $('resetDataBtn');
    if (resetDataBtn) resetDataBtn.textContent = tr('resetDataButton');
    
    const saveMachinePartBtn = $('saveMachinePartBtn');
    if (saveMachinePartBtn) saveMachinePartBtn.textContent = tr('saveMachinePartButton');

    // Update labels
    const machineLabel = $('machineLabel');
    if (machineLabel) machineLabel.textContent = tr('machineLabel');
    
    const partNameLabel = $('partNameLabel');
    if (partNameLabel) partNameLabel.textContent = tr('partNameLabel');
    
    const partNumberLabel = $('partNumberLabel');
    if (partNumberLabel) partNumberLabel.textContent = tr('partNumberLabel');
    
    const currentLowerLabel = $('currentLowerLabel');
    if (currentLowerLabel) currentLowerLabel.textContent = tr('currentLowerLabel');
    
    const currentUpperLabel = $('currentUpperLabel');
    if (currentUpperLabel) currentUpperLabel.textContent = tr('currentUpperLabel');
    
    const newLowerLabel = $('newLowerLabel');
    if (newLowerLabel) newLowerLabel.textContent = tr('newLowerLabel');
    
    const newUpperLabel = $('newUpperLabel');
    if (newUpperLabel) newUpperLabel.textContent = tr('newUpperLabel');

    // rowsPerPage select options
    const rowsPerPageEl = $('rowsPerPage');
    if (rowsPerPageEl) {
      rowsPerPageEl.querySelectorAll('option').forEach(opt => {
        const val = opt.value;
        opt.textContent = val + (translations[lang] && translations[lang].rowsPerPage ? translations[lang].rowsPerPage : '');
      });
    }

    // datePreset options
    const datePresetEl = $('datePreset');
    if (datePresetEl) {
      datePresetEl.querySelectorAll('option').forEach(opt => {
        const v = opt.value;
        let key = 'filter' + v.charAt(0).toUpperCase() + v.slice(1);
        key = key.replace('current', '');
        if (translations[lang] && translations[lang][key]) opt.textContent = translations[lang][key];
      });
    }

    // header H1 and description
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = translations[lang]?.mainTitle || h1.textContent;
    const desc = document.querySelector('.description');
    if (desc) desc.textContent = translations[lang]?.subTitle || desc.textContent;

    // language toggle text
    const langToggle = $('languageToggle');
    if (langToggle) langToggle.textContent = lang === 'id' ? '🌐 EN' : '🌐 ID';

    // moment locale
    if (typeof moment !== 'undefined') moment.locale(lang);

    // chart labels
    if (cycleTimeChart) {
      if (cycleTimeChart.options && cycleTimeChart.options.scales) {
        if (cycleTimeChart.options.scales.y && cycleTimeChart.options.scales.y.title) {
          cycleTimeChart.options.scales.y.title.text = tr('cycleTimeLabel');
        }
        if (cycleTimeChart.options.scales.x && cycleTimeChart.options.scales.x.title) {
          cycleTimeChart.options.scales.x.title.text = tr('cycleLabel');
        }
      }
      if (cycleTimeChart.data && cycleTimeChart.data.datasets) {
        if (cycleTimeChart.data.datasets[0]) cycleTimeChart.data.datasets[0].label = tr('cycleTimeLabel');
        if (cycleTimeChart.data.datasets[1]) cycleTimeChart.data.datasets[1].label = tr('statusLower') + ` (${LOWER_LIMIT.toFixed(2)}s)`;
        if (cycleTimeChart.data.datasets[2]) cycleTimeChart.data.datasets[2].label = tr('statusOver') + ` (${UPPER_LIMIT.toFixed(2)}s)`;
      }
      cycleTimeChart.update();
    }

    // table headers translation
    if (Array.isArray(tableHeaders) && tableHeaders.length > 0) {
      tableHeaders = [
        translations[lang]?.tableHeader0 || tableHeaders[0],
        translations[lang]?.tableHeader1 || tableHeaders[1],
        translations[lang]?.tableHeader2 || tableHeaders[2],
        translations[lang]?.tableHeader3 || tableHeaders[3]
      ];
      renderTable(false);
    }
  }

  // -------------------
  // Event bindings & init
  // -------------------
  document.addEventListener('DOMContentLoaded', function() {
    // initial translations
    updateTextContent(currentLanguage);

    // language toggle
    const langToggleBtn = $('languageToggle');
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        const next = currentLanguage === 'id' ? 'en' : 'id';
        updateTextContent(next);
        if (tableRowsAll.length > 0) {
          const lowerCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) < LOWER_LIMIT).length;
          const normalCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) >= LOWER_LIMIT && (parseFloat(r[2]) || 0) <= UPPER_LIMIT).length;
          const overCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) > UPPER_LIMIT).length;
          updateCharts([], lowerCount, normalCount, overCount);
        }
      });
    }

    // init charts
    if (typeof moment !== 'undefined') moment.locale(currentLanguage);
    initCharts();

    // default filter: all
    setFilterRange('all');

    // load data
    loadDataFromSheets();

    // load button
    const loadDataBtn = $('loadData');
    if (loadDataBtn) loadDataBtn.addEventListener('click', loadDataFromSheets);

    // date preset change
    const datePresetEl = $('datePreset');
    if (datePresetEl) {
      datePresetEl.addEventListener('change', function(e) {
        const preset = e.target.value;
        const customControls = $('customRangeControls');

        if (preset === 'custom') {
          if (customControls) customControls.style.display = 'flex';
          filterStartDate = null; filterEndDate = null;
        } else {
          if (customControls) customControls.style.display = 'none';
          setFilterRange(preset);
          if (tableRowsAll.length > 0) processData(tableRowsAll);
          else loadDataFromSheets();
        }
      });
    }

    // apply filter button
    const applyFilterBtn = $('applyFilterBtn');
    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => {
        const start = ($('startDate') || {}).value;
        const end = ($('endDate') || {}).value;
        if (start && end) {
          setFilterRange('custom', start, end);
          if (tableRowsAll.length > 0) processData(tableRowsAll);
          else loadDataFromSheets();
        } else {
          alert(currentLanguage === 'id' ? "Mohon masukkan Tanggal Mulai dan Tanggal Akhir." : "Please enter both Start Date and End Date.");
        }
      });
    }

    // search input
    const searchInput = $('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderTable();
      });
    }

    // rowsPerPage change
    const rowsPerPageEl = $('rowsPerPage');
    if (rowsPerPageEl) {
      rowsPerPageEl.addEventListener('change', (e) => {
        rowsPerPage = parseInt(e.target.value, 10);
        currentPage = 1;
        renderTable();
      });
    }

    // export CSV
    const exportCsvBtn = $('exportCsvBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCurrentToCSV);

    // auto refresh
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(loadDataFromSheets, 10000);

    // ADMIN LOGIN MODAL HANDLERS
    const adminToggle = $('adminLoginToggle');
    const adminLoginModal = $('adminLoginModal');
    const adminSettingsModal = $('adminSettingsModal');
    
    // Tombol Admin Toggle (di header) - Buka modal login
    if (adminToggle) {
      adminToggle.addEventListener('click', openAdminLogin);
    }

    // Close buttons untuk kedua modal
    const closeLoginBtn = adminLoginModal ? adminLoginModal.querySelector('.close-button') : null;
    const closeSettingsBtn = adminSettingsModal ? adminSettingsModal.querySelector('.close-button') : null;
    
    if (closeLoginBtn) {
      closeLoginBtn.addEventListener('click', closeAdminLogin);
    }
    
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', closeAdminSettings);
    }

    // Close modal ketika klik di luar
    window.addEventListener('click', function(event) {
      if (adminLoginModal && event.target === adminLoginModal) {
        closeAdminLogin();
      }
      if (adminSettingsModal && event.target === adminSettingsModal) {
        closeAdminSettings();
      }
    });

    // Login button
    const loginBtn = $('loginAdminBtn');
    if (loginBtn) {
      loginBtn.addEventListener('click', adminLogin);
    }

    // Tambahkan event listener untuk Enter di input password
    const passwordInput = $('adminPassword');
    if (passwordInput) {
      passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          adminLogin();
        }
      });
    }

    // Admin Settings Functions
    const saveLimitsBtn = $('saveLimitsBtn');
    const resetLimitsBtn = $('resetLimitsBtn');
    const resetBtn = $('resetDataBtn');
    const saveMachinePartBtn = $('saveMachinePartBtn');

    // save limits
    if (saveLimitsBtn) {
      saveLimitsBtn.addEventListener('click', function() {
        if (!isAdminLoggedIn) {
          alert(currentLanguage === 'id' ? "Silakan login terlebih dahulu!" : "Please login first!");
          return;
        }
        
        const newLower = parseFloat(($('newLowerLimit') || {}).value);
        const newUpper = parseFloat(($('newUpperLimit') || {}).value);
        const limitMsg = $('limitMessage');

        if (isNaN(newLower) || isNaN(newUpper) || newLower <= 0 || newUpper <= newLower) {
          if (limitMsg) { 
            limitMsg.textContent = currentLanguage === 'id' ? tr('limitError') : tr('limitError'); 
            limitMsg.style.color = 'red'; 
          }
          return;
        }

        localStorage.setItem('lowerLimit', newLower);
        localStorage.setItem('upperLimit', newUpper);
        LOWER_LIMIT = newLower;
        UPPER_LIMIT = newUpper;

        const currentLowerEl = $('currentLower');
        const currentUpperEl = $('currentUpper');
        if (currentLowerEl) currentLowerEl.textContent = newLower.toFixed(2);
        if (currentUpperEl) currentUpperEl.textContent = newUpper.toFixed(2);

        if (limitMsg) { 
          limitMsg.textContent = tr('saveSuccess'); 
          limitMsg.style.color = 'green'; 
        }

        if (cycleTimeChart) {
          updateTextContent(currentLanguage);
          if (tableRowsAll.length > 0) processData(tableRowsAll);
        }

        setTimeout(() => { if (limitMsg) limitMsg.textContent = ''; }, 3000);
      });
    }

    // reset limits
    if (resetLimitsBtn) {
      resetLimitsBtn.addEventListener('click', function() {
        if (!isAdminLoggedIn) {
          alert(currentLanguage === 'id' ? "Silakan login terlebih dahulu!" : "Please login first!");
          return;
        }
        
        const confirmation = confirm(currentLanguage === 'id' ? "Reset limits ke nilai default (55 dan 65)?" : "Reset limits to default values (55 and 65)?");
        if (!confirmation) return;

        localStorage.removeItem('lowerLimit');
        localStorage.removeItem('upperLimit');

        const defaultLower = 55, defaultUpper = 65;
        LOWER_LIMIT = defaultLower; 
        UPPER_LIMIT = defaultUpper;

        const currentLowerEl = $('currentLower');
        const currentUpperEl = $('currentUpper');
        const newLowerEl = $('newLowerLimit');
        const newUpperEl = $('newUpperLimit');
        if (currentLowerEl) currentLowerEl.textContent = defaultLower.toFixed(2);
        if (currentUpperEl) currentUpperEl.textContent = defaultUpper.toFixed(2);
        if (newLowerEl) newLowerEl.value = defaultLower;
        if (newUpperEl) newUpperEl.value = defaultUpper;

        const limitMsg = $('limitMessage');
        if (limitMsg) { 
          limitMsg.textContent = tr('resetSuccess'); 
          limitMsg.style.color = 'green'; 
        }

        if (cycleTimeChart) {
          updateTextContent(currentLanguage);
          if (tableRowsAll.length > 0) processData(tableRowsAll);
        }

        setTimeout(() => { if (limitMsg) limitMsg.textContent = ''; }, 3000);
      });
    }

    // reset data (simulation)
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (!isAdminLoggedIn) {
          alert(currentLanguage === 'id' ? "Silakan login terlebih dahulu!" : "Please login first!");
          return;
        }
        
        const confirmation = confirm(currentLanguage === 'id' ? "ANDA YAKIN INGIN MERESET SEMUA DATA PRODUKSI? Aksi ini tidak dapat dibatalkan." : "ARE YOU SURE YOU WANT TO RESET ALL PRODUCTION DATA? This action cannot be undone.");
        if (confirmation) {
          resetAllData();
          const resetMsg = $('resetMessage');
          if (resetMsg) {
            resetMsg.textContent = currentLanguage === 'id' ? "Permintaan Reset Data berhasil dikirim (Simulasi: Perlu API tulis)." : "Data Reset request sent (Simulation: Write API needed).";
            resetMsg.style.color = 'green';
            setTimeout(() => { resetMsg.textContent = ''; }, 5000);
          }
        }
      });
    }

    // save machine part button
    if (saveMachinePartBtn) {
      saveMachinePartBtn.addEventListener('click', saveMachinePart);
    }

    // initial machine/part load
    loadMachinePart();
    
    // Jika sudah login sebelumnya, bisa langsung buka settings
    if (isAdminLoggedIn) {
      // Tidak langsung buka modal, tapi siapkan untuk next click
      console.log("Admin sudah login sebelumnya");
    }
  });

  // -------------------
  // Sisanya tetap sama...
  // (Fungsi setFilterRange, initCharts, loadDataFromSheets, processData,
  // updateCharts, statusFromCycle, renderTable, handleSort, goToPage,
  // exportCurrentToCSV, updateLimits, resetAllData, loadMachinePart, saveMachinePart)
  // -------------------
  
  // Sisipkan fungsi-fungsi yang sama dari kode sebelumnya...
  // (Untuk menjaga agar jawaban tidak terlalu panjang, saya akan tuliskan bagian-bagian penting saja)
  
  function setFilterRange(preset, start = null, end = null) {
    const now = moment().startOf('day');
    filterStartDate = null;
    filterEndDate = null;

    if (preset === 'today') {
      filterStartDate = moment(now);
      filterEndDate = moment(now).endOf('day');
    } else if (preset === 'yesterday') {
      filterStartDate = moment(now).subtract(1, 'days').startOf('day');
      filterEndDate = moment(now).subtract(1, 'days').endOf('day');
    } else if (preset === 'week' || preset === 'currentWeek') {
      filterStartDate = moment(now).startOf('week');
      filterEndDate = moment(now).endOf('day');
    } else if (preset === 'month' || preset === 'currentMonth') {
      filterStartDate = moment(now).startOf('month');
      filterEndDate = moment(now).endOf('day');
    } else if (preset === 'custom' && start && end) {
      filterStartDate = moment(start).startOf('day');
      filterEndDate = moment(end).endOf('day');
    } else if (preset === 'all') {
      filterStartDate = null;
      filterEndDate = null;
    }
  }

  function initCharts() {
    // Sama seperti sebelumnya...
    try {
      const ctxEl = $('cycleTimeChart');
      if (ctxEl) {
        const ctx = ctxEl.getContext('2d');
        cycleTimeChart = new Chart(ctx, {
          type: 'line',
          data: { 
            labels: [], 
            datasets: [
              { 
                label: tr('cycleTimeLabel'), 
                data: [], 
                borderColor: 'rgba(75, 192, 192, 1)', 
                backgroundColor: 'rgba(75, 192, 192, 0.1)', 
                fill: true, 
                tension: 0.4, 
                pointBackgroundColor: 'rgba(75, 192, 192, 1)' 
              },
              { 
                label: tr('statusLower') + ` (${LOWER_LIMIT.toFixed(2)}s)`, 
                data: [], 
                borderColor: 'red', 
                borderDash: [5,5], 
                pointRadius: 0, 
                fill: false 
              },
              { 
                label: tr('statusOver') + ` (${UPPER_LIMIT.toFixed(2)}s)`, 
                data: [], 
                borderColor: 'red', 
                borderDash: [5,5], 
                pointRadius: 0, 
                fill: false 
              }
            ]
          },
          options: {
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: tr('cycleTimeLabel'), color: '#a0d2eb' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                ticks: { color: '#a0d2eb' }
              },
              x: {
                title: { display: true, text: tr('cycleLabel'), color: '#a0d2eb' },
                grid: { display: false },
                ticks: { color: '#a0d2eb' }
              }
            },
            plugins: { legend: { labels: { color: '#a0d2eb' } } }
          }
        });
      }

      const statusEl = $('statusChart');
      if (statusEl) {
        const sctx = statusEl.getContext('2d');
        statusChart = new Chart(sctx, {
          type: 'doughnut',
          data: {
            labels: [tr('statusLower'), tr('statusNormal'), tr('statusOver')],
            datasets: [{
              data: [0,0,0], 
              backgroundColor: [
                'rgba(255,165,0,0.8)', 
                'rgba(46,204,113,0.8)', 
                'rgba(231,76,60,0.8)'
              ], 
              borderColor: [
                'rgba(255,165,0,1)', 
                'rgba(46,204,113,1)', 
                'rgba(231,76,60,1)'
              ], 
              borderWidth: 1 
            }]
          },
          options: {
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                position: 'bottom', 
                labels: { color: '#a0d2eb', font: { size: 10 } } 
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const value = context.raw;
                    const percentage = total > 0 ? ((value/total)*100).toFixed(1) + "%" : "0%";
                    return context.label.split(':')[0] + ": " + value + " (" + percentage + ")"; 
                  }
                }
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Chart init error:", e);
    }
  }

  async function loadDataFromSheets() {
    // Sama seperti sebelumnya...
    try {
      const tableContainer = $('tableContainer');
      if (tableContainer) tableContainer.innerHTML = `<div class="loading">${tr('loadingMessage')}</div>`;

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch data from Google Sheets');

      const data = await res.json();
      if (!data || !Array.isArray(data.values) || data.values.length < 2) {
        tableRowsAll = [];
        if (tableContainer) tableContainer.innerHTML = `<div class="loading">${currentLanguage === 'id' ? 'Tidak ada data produksi ditemukan' : 'No production data found'}</div>`;
        return;
      }

      tableRowsAll = data.values.slice(1)
        .map(r => {
          while (r.length < 4) r.push('');
          return r;
        })
        .filter(r => (r[0] && r[2] && r[2] !== '-'));

      processData(tableRowsAll);

      const lastUpdatedEl = $('lastUpdated');
      if (lastUpdatedEl) lastUpdatedEl.textContent = `${tr('lastUpdatedPrefix')} ${moment().format('LLLL')}`;

    } catch (error) {
      console.error('Error:', error);
      const tableContainer = $('tableContainer');
      if (tableContainer) tableContainer.innerHTML = `<div class="loading">Error: ${error.message}. Please ensure a stable internet connection.</div>`;
    }
  }

  function processData(data) {
    // Sama seperti sebelumnya...
    if (!Array.isArray(data) || data.length < 1) {
      const tableContainer = $('tableContainer');
      if (tableContainer) tableContainer.innerHTML = `<div class="loading">${currentLanguage === 'id' ? 'Tidak ada data produksi ditemukan' : 'No production data found'}</div>`;
      return;
    }

    tableHeaders = [
      tr('tableHeader0') || 'Timestamp',
      tr('tableHeader1') || 'Cycle Count',
      tr('tableHeader2') || 'Cycle Time',
      tr('tableHeader3') || 'Status'
    ];

    const rawRows = tableRowsAll.slice();

    if (filterStartDate && filterEndDate) {
      filteredTableRows = rawRows.filter(row => {
        const rowMoment = moment(row[0], ["DD/MM/YYYY HH:mm:ss","MM/DD/YYYY HH:mm:ss","YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);
        return rowMoment.isValid() && rowMoment.isSameOrAfter(filterStartDate) && rowMoment.isSameOrBefore(filterEndDate);
      });
    } else {
      filteredTableRows = rawRows.slice();
    }

    currentPage = 1;
    renderTable();

    const chartData = [];
    let totalCycleTime = 0;
    let minCycleTime = Infinity;
    let maxCycleTime = 0;
    let totalCycles = 0;
    let todayCycles = 0;
    let lowerCount = 0, normalCount = 0, overCount = 0;
    let lastCycleTime = 0;
    let lastCycleStatus = '';

    filteredTableRows.forEach((row, idx) => {
      const cycleTime = parseFloat(row[2]) || 0;
      const timestamp = row[0] || '';

      const isToday = moment(timestamp, ["DD/MM/YYYY HH:mm:ss","MM/DD/YYYY HH:mm:ss","YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true).isSame(moment(), 'day');

      if (!isNaN(cycleTime)) {
        chartData.push({ label: timestamp, value: cycleTime });
        totalCycleTime += cycleTime;
        totalCycles++;
        if (cycleTime < minCycleTime) minCycleTime = cycleTime;
        if (cycleTime > maxCycleTime) maxCycleTime = cycleTime;

        if (cycleTime < LOWER_LIMIT) lowerCount++;
        else if (cycleTime > UPPER_LIMIT) overCount++;
        else normalCount++;

        if (isToday) todayCycles++;
        if (idx === filteredTableRows.length - 1) {
          lastCycleTime = cycleTime;
          lastCycleStatus = statusFromCycle(cycleTime);
        }
      }
    });

    const avgCycleTime = totalCycles > 0 ? totalCycleTime / totalCycles : 0;
    const avgEl = $('avgCycleTime'); 
    if (avgEl) avgEl.textContent = isNaN(avgCycleTime) ? '0.00s' : avgCycleTime.toFixed(2) + 's';
    
    const totalCyclesEl = $('totalCycles'); 
    if (totalCyclesEl) totalCyclesEl.textContent = totalCycles;
    
    const minEl = $('minCycleTime'); 
    if (minEl) minEl.textContent = isFinite(minCycleTime) ? minCycleTime.toFixed(2) + 's' : '0.00s';
    
    const statMaxEl = document.querySelector('[data-key="statMaxCycle"]'); 
    if (statMaxEl) statMaxEl.textContent = `${tr('statMaxCycle')} ${isFinite(maxCycleTime) ? maxCycleTime.toFixed(2) + 's' : '0.00s'}`;
    
    const statTodayEl = document.querySelector('[data-key="statToday"]'); 
    if (statTodayEl) statTodayEl.textContent = `${tr('statToday')} ${todayCycles}`;

    const lastCycleTimeEl = $('lastCycleTime'); 
    if (lastCycleTimeEl) lastCycleTimeEl.textContent = lastCycleTime.toFixed(2) + 's';

    const statusElement = $('lastCycleStatus');
    const displayStatus = translations[currentLanguage] && lastCycleStatus ? 
      translations[currentLanguage]['status' + lastCycleStatus.charAt(0).toUpperCase() + lastCycleStatus.slice(1).toLowerCase()] : 
      translations[currentLanguage]?.statusNormal;
    
    if (statusElement) {
      statusElement.textContent = `${tr('statStatusPrefix')} ${displayStatus || ''}`;
      if (lastCycleStatus === 'NORMAL') statusElement.style.color = '#2ecc71';
      else if (lastCycleStatus === 'LOWER') statusElement.style.color = '#ffa500';
      else statusElement.style.color = '#e74c3c';
    }

    updateCharts(chartData, lowerCount, normalCount, overCount);
  }

  function updateCharts(chartData, lowerCount, normalCount, overCount) {
    const recentChartData = (chartData && chartData.length) ? chartData.slice(-50) : [];

    if (cycleTimeChart) {
      cycleTimeChart.data.labels = recentChartData.map(item => {
        const m = moment(item.label, ["DD/MM/YYYY HH:mm:ss","MM/DD/YYYY HH:mm:ss","YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);
        return m.isValid() ? m.format('HH:mm:ss') : item.label;
      });
      cycleTimeChart.data.datasets[0].data = recentChartData.map(item => item.value);
      if (cycleTimeChart.data.datasets[1]) cycleTimeChart.data.datasets[1].label = tr('statusLower') + ` (${LOWER_LIMIT.toFixed(2)}s)`;
      if (cycleTimeChart.data.datasets[2]) cycleTimeChart.data.datasets[2].label = tr('statusOver') + ` (${UPPER_LIMIT.toFixed(2)}s)`;
      cycleTimeChart.data.datasets[1].data = Array(recentChartData.length).fill(LOWER_LIMIT);
      cycleTimeChart.data.datasets[2].data = Array(recentChartData.length).fill(UPPER_LIMIT);
      cycleTimeChart.update();
    }

    if (statusChart) {
      statusChart.data.datasets[0].data = [lowerCount, normalCount, overCount];
      const total = lowerCount + normalCount + overCount;
      const labels = [tr('statusLower'), tr('statusNormal'), tr('statusOver')];
      statusChart.data.labels = [
        `${labels[0]}: ${lowerCount} (${total>0?((lowerCount/total)*100).toFixed(1):0}%)`,
        `${labels[1]}: ${normalCount} (${total>0?((normalCount/total)*100).toFixed(1):0}%)`,
        `${labels[2]}: ${overCount} (${total>0?((overCount/total)*100).toFixed(1):0}%)`
      ];
      statusChart.update();
    }
  }

  function statusFromCycle(cycleTime) {
    if (cycleTime < LOWER_LIMIT) return 'LOWER';
    if (cycleTime > UPPER_LIMIT) return 'OVER';
    return 'NORMAL';
  }

  function renderTable(resetSort = true) {
    // Sama seperti sebelumnya...
    const rowsToRender = filteredTableRows.length ? filteredTableRows : tableRowsAll;

    if (!rowsToRender.length) {
      const tableContainer = $('tableContainer');
      if (tableContainer) tableContainer.innerHTML = `<div class="loading">${currentLanguage === 'id' ? 'Tidak ada data ditemukan dalam periode ini.' : 'No data found in this period.'}</div>`;
      const pagination = $('pagination');
      if (pagination) pagination.innerHTML = '';
      return;
    }

    const search = ($('searchInput') || {}).value?.toLowerCase() || '';

    let filtered = rowsToRender.filter(r => {
      const status = statusFromCycle(parseFloat(r[2]) || 0);
      const displayStatus = translations[currentLanguage] ? 
        translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] : status;
      const t0 = (r[0] || '').toString().toLowerCase();
      const t2 = (r[2] || '').toString().toLowerCase();
      const ds = (displayStatus || '').toString().toLowerCase();
      return t0.includes(search) || t2.includes(search) || ds.includes(search);
    });

    if (currentSortIndex !== null && filtered.length > 0) {
      const columnIndex = currentSortIndex;
      const direction = sortDirection === 'asc' ? 1 : -1;
      filtered.sort((a, b) => {
        let valA = a[columnIndex];
        let valB = b[columnIndex];
        if (columnIndex === 0) {
          return direction * (moment(valA).valueOf() - moment(valB).valueOf());
        } else if (columnIndex === 2) {
          return direction * ((parseFloat(valA) || 0) - (parseFloat(valB) || 0));
        } else {
          return direction * (String(valA).localeCompare(String(valB)));
        }
      });
    }

    rowsPerPage = parseInt(($('rowsPerPage') || {}).value || rowsPerPage, 10);
    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(start, start + rowsPerPage);

    const thead = `
      <thead>
        <tr>
          ${tableHeaders.map((h, i) => {
            const arrow = currentSortIndex === i ? (sortDirection === 'asc' ? '▲' : '▼') : '';
            return `<th onclick="handleSort(${i})">${h}<span class="sort-indicator">${arrow}</span></th>`;
          }).join('')}
        </tr>
      </thead>`;

    const tbody = `
      <tbody>
        ${pageRows.map(row => {
          const cycleTime = parseFloat(row[2]) || 0;
          const status = statusFromCycle(cycleTime);
          const displayStatus = translations[currentLanguage] ? 
            translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] : status;
          const t = moment(row[0], ["DD/MM/YYYY HH:mm:ss","MM/DD/YYYY HH:mm:ss","YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);
          const ts = t.isValid() ? t.format('DD/MM/YYYY HH:mm:ss') : (row[0] || '');
          return `
            <tr>
              <td>${ts}</td>
              <td>${row[1] || ''}</td>
              <td>${cycleTime.toFixed(2)}s</td>
              <td><span class="status-badge status-${status.toLowerCase()}">${displayStatus}</span></td>
            </tr>`;
        }).join('')}
      </tbody>`;

    const tableHTML = `<div class="table-wrapper"><table class="data-table">${thead}${tbody}</table></div>`;
    const tableContainer = $('tableContainer');
    if (tableContainer) tableContainer.innerHTML = tableHTML;

    const pagination = $('pagination');
    if (pagination) {
      const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
      let pagesHTML = '';

      pagesHTML += `<button ${currentPage===1?'disabled':''} onclick="goToPage(${Math.max(1,currentPage-1)})">Prev</button>`;

      const pageWindow = 5;
      let startPage = Math.max(1, currentPage - Math.floor(pageWindow/2));
      let endPage = Math.min(totalPages, startPage + pageWindow - 1);
      if (endPage - startPage < pageWindow - 1) startPage = Math.max(1, endPage - pageWindow + 1);

      for (let p = startPage; p <= endPage; p++) {
        pagesHTML += `<button class="${p===currentPage?'active':''}" onclick="goToPage(${p})">${p}</button>`;
      }

      pagesHTML += `<button ${currentPage===totalPages?'disabled':''} onclick="goToPage(${Math.min(totalPages,currentPage+1)})">Next</button>`;

      pagination.innerHTML = pagesHTML;
    }
  }

  function handleSort(columnIndex) {
    if (currentSortIndex === columnIndex) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortIndex = columnIndex;
      sortDirection = 'asc';
    }
    currentPage = 1;
    renderTable(false);
  }

  function goToPage(p) {
    currentPage = p;
    renderTable(false);
  }

  async function exportCurrentToCSV() {
    const rowsToExport = filteredTableRows.length ? filteredTableRows : tableRowsAll;
    if (rowsToExport.length === 0) {
      alert(currentLanguage === 'id' ? "Tidak ada data untuk di-export." : "No data to export.");
      return;
    }

    const search = ($('searchInput') || {}).value?.toLowerCase() || '';
    let filtered = rowsToExport.filter(r => {
      const status = statusFromCycle(parseFloat(r[2]) || 0);
      const displayStatus = translations[currentLanguage] ? 
        translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] : status;
      return (r[0] || '').toLowerCase().includes(search) || 
             (r[2] || '').toLowerCase().includes(search) || 
             (displayStatus || '').toLowerCase().includes(search);
    });

    if (currentSortIndex !== null) {
      const columnIndex = currentSortIndex;
      const direction = sortDirection === 'asc' ? 1 : -1;
      filtered.sort((a,b) => {
        let valA = a[columnIndex], valB = b[columnIndex];
        if (columnIndex === 0) return direction * (moment(valA).valueOf() - moment(valB).valueOf());
        if (columnIndex === 2) {
          valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0;
          return direction * (valA - valB);
        }
        if (valA < valB) return direction * -1;
        if (valA > valB) return direction * 1;
        return 0;
      });
    }

    const csvHeaders = [
      tr('tableHeader0'), tr('tableHeader1'), tr('tableHeader2'), tr('tableHeader3')
    ];
    let csv = csvHeaders.join(',') + '\n';
    filtered.forEach(r => {
      const cycleTime = parseFloat(r[2]) || 0;
      const status = statusFromCycle(cycleTime);
      const displayStatus = translations[currentLanguage] ? 
        translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()] : status;
      csv += `"${r[0]}", "${r[1]}", "${cycleTime.toFixed(2)}s", "${displayStatus}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `data_cycle_time_${moment().format('YYYYMMDD_HHmmss')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Expose global functions
  window.handleSort = handleSort;
  window.goToPage = goToPage;
  window.exportCurrentToCSV = exportCurrentToCSV;

  function updateLimits(newLower, newUpper) {
    LOWER_LIMIT = newLower;
    UPPER_LIMIT = newUpper;
    if (tableRowsAll.length > 0) processData(tableRowsAll);
  }

  function resetAllData() {
    alert(currentLanguage === 'id' ? "Fungsi reset hanya simulasi. Perlu API tulis ke Google Sheets untuk implementasi penuh." : "Reset function is a simulation. Full write API needed to Google Sheets.");
  }

  function loadMachinePart() {
    const machineEl = $('machineName') || document.querySelector('#machineDisplay') || document.querySelector('#machine');
    const partNameEl = $('partName') || document.querySelector('#partNameDisplay') || document.querySelector('#part');
    const partNumberEl = $('partNumber') || document.querySelector('#partNumberDisplay') || document.querySelector('#partNo');

    MACHINE_NAME = localStorage.getItem("machineName") || MACHINE_NAME || "-";
    PART_NAME = localStorage.getItem("partName") || PART_NAME || "-";
    PART_NUMBER = localStorage.getItem("partNumber") || PART_NUMBER || "-";

    if (machineEl) machineEl.textContent = MACHINE_NAME;
    if (partNameEl) partNameEl.textContent = PART_NAME;
    if (partNumberEl) partNumberEl.textContent = PART_NUMBER;

    const adminMachine = $('adminMachine');
    const adminPartName = $('adminPartName');
    const adminPartNumber = $('adminPartNumber');
    if (adminMachine) adminMachine.value = MACHINE_NAME === "-" ? "" : MACHINE_NAME;
    if (adminPartName) adminPartName.value = PART_NAME === "-" ? "" : PART_NAME;
    if (adminPartNumber) adminPartNumber.value = PART_NUMBER === "-" ? "" : PART_NUMBER;
  }

  function saveMachinePart() {
    if (!isAdminLoggedIn) {
      alert(currentLanguage === 'id' ? "Login admin terlebih dahulu!" : "Please login as admin first!");
      return;
    }
    const adminMachine = $('adminMachine');
    const adminPartName = $('adminPartName');
    const adminPartNumber = $('adminPartNumber');

    if (!adminMachine || !adminPartName || !adminPartNumber) {
      alert(currentLanguage === 'id' ? "Form MACHINE/PART tidak ditemukan di modal admin." : "Machine/Part form not found in admin modal.");
      return;
    }

    const machineVal = adminMachine.value.trim() || "-";
    const partNameVal = adminPartName.value.trim() || "-";
    const partNumberVal = adminPartNumber.value.trim() || "-";

    localStorage.setItem('machineName', machineVal);
    localStorage.setItem('partName', partNameVal);
    localStorage.setItem('partNumber', partNumberVal);

    MACHINE_NAME = machineVal; 
    PART_NAME = partNameVal; 
    PART_NUMBER = partNumberVal;
    
    loadMachinePart();
    alert(currentLanguage === 'id' ? "Data MACHINE & PART berhasil disimpan!" : "Machine & Part data saved!");
  }

  window.saveMachinePart = saveMachinePart;
})();
