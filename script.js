// ===== KAMUS TERJEMAHAN BARU + TAMBAHAN ADMIN =====
const translations = {
    'id': {
        title: 'Dashboard Real Time Monitoring',
        mainTitle: 'Dashboard Real Time Monitoring',
        subTitle: 'Monitoring Real-time Production',
        reloadButton: '⟳ Muat Ulang Data',
        refreshStatus: 'Auto Refresh (10 detik)', 
        statAvgCycle: 'CT RATA-RATA',
        statTotalCycles: 'TOTAL CYCLE',
        statLastCycle: 'CT TERAKHIR',
        statMinCycle: 'CT TERCEPAT',
        statTarget: 'Target',
        statToday: 'Hari ini:',
        statMaxCycle: 'Terlama:',
        statStatusPrefix: 'Status:',
        chartTitle1: 'GRAFIK CYCLE TIME',
        chartTitle2: 'STATUS',
        tableTitle: 'DATA CYCLE TIME',
        searchPlaceholder: 'Cari data (tanggal, cycle, status)...',
        rowsPerPage: ' / halaman',
        exportButton: '⬇ Export CSV',
        loadingMessage: 'Memuat data production...',
        lastUpdatedPrefix: 'Terakhir diperbarui:',
        cycleTimeLabel: 'Waktu (detik)',
        cycleLabel: 'Cycle',
        limitLower: 'Lower Limit',
        limitUpper: 'Upper Limit',
        statusLower: 'LOWER',
        statusNormal: 'NORMAL',
        statusOver: 'OVER',
        statusToday: 'Hari ini:',
        statusLongest: 'Terlama:',
        tableStatus: 'Status',
        totalLabel: 'Total',
        tableHeader0: 'Timestamp',
        tableHeader1: 'Cycle Count',
        tableHeader2: 'Cycle Time',
        tableHeader3: 'Status',
        filterLabel: 'Filter Data:',
        filterToday: 'Hari ini',
        filterYesterday: 'Kemarin',
        filterWeek: 'Minggu ini',
        filterMonth: 'Bulan ini',
        filterAll: 'Semua Data',
        filterCustom: 'Kustom (Range Tanggal)',
        filterApplyBtn: 'Terapkan',
        // --- TERJEMAHAN ADMIN BARU ---
        adminLoginTitle: 'Login Admin',
        adminSettingsTitle: 'Pengaturan Batas Cycle Time',
        adminResetTitle: 'Reset Data Produksi',
        saveSuccess: 'Batas berhasil disimpan!',
        resetSuccess: 'Limit berhasil direset ke default!',
        limitError: 'Batas tidak valid. Pastikan Upper > Lower.',
    },
    'en': {
        title: 'Real Time Monitoring Dashboard',
        mainTitle: 'Real Time Monitoring Dashboard',
        subTitle: 'Real-time Production Monitoring',
        reloadButton: '⟳ Reload Data',
        refreshStatus: 'Auto Refresh (10 seconds)', 
        statAvgCycle: 'AVERAGE CT',
        statTotalCycles: 'TOTAL CYCLES',
        statLastCycle: 'LAST CT',
        statMinCycle: 'FASTEST CT',
        statTarget: 'Target',
        statToday: 'Today:',
        statMaxCycle: 'Longest:',
        statStatusPrefix: 'Status:',
        chartTitle1: 'CYCLE TIME CHART',
        chartTitle2: 'PRODUCTION STATUS',
        tableTitle: 'CYCLE TIME DATA',
        searchPlaceholder: 'Search data (date, cycle, status)...',
        rowsPerPage: ' / page',
        exportButton: '⬇ Export CSV',
        loadingMessage: 'Loading production data...',
        lastUpdatedPrefix: 'Last updated:',
        cycleTimeLabel: 'Time (seconds)',
        cycleLabel: 'Cycle',
        limitLower: 'Lower Limit',
        limitUpper: 'Upper Limit',
        statusLower: 'LOWER',
        statusNormal: 'NORMAL',
        statusOver: 'OVER',
        statusToday: 'Today:',
        statusLongest: 'Longest:',
        tableStatus: 'Status',
        totalLabel: 'Total',
        tableHeader0: 'Timestamp',
        tableHeader1: 'Cycle Count',
        tableHeader2: 'Cycle Time',
        tableHeader3: 'Status',
        filterLabel: 'Filter Data:',
        filterToday: 'Today',
        filterYesterday: 'Yesterday',
        filterWeek: 'This Week',
        filterMonth: 'This Month',
        filterAll: 'All Data',
        filterCustom: 'Custom (Date Range)',
        filterApplyBtn: 'Apply',
        // --- TERJEMAHAN ADMIN BARU ---
        adminLoginTitle: 'Admin Login',
        adminSettingsTitle: 'Cycle Time Limit Settings',
        adminResetTitle: 'Production Data Reset',
        saveSuccess: 'Limits saved successfully!',
        resetSuccess: 'Limits reset to default!',
        limitError: 'Invalid limits. Ensure Upper > Lower.',
    }
};

// ===== FUNGSI TRANSLASI =====
let currentLanguage = localStorage.getItem('lang') || 'id';

function updateTextContent(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('[data-key-placeholder]').forEach(el => {
        const key = el.getAttribute('data-key-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
    
    // Handle select options for rowsPerPage
    const rowsPerPageEl = document.getElementById('rowsPerPage');
    if (rowsPerPageEl) {
        rowsPerPageEl.querySelectorAll('option').forEach(opt => {
            const val = opt.value;
            opt.textContent = val + translations[lang].rowsPerPage;
        });
    }

    // Handle select options for datePreset
    const datePresetEl = document.getElementById('datePreset');
    if (datePresetEl) {
        datePresetEl.querySelectorAll('option').forEach(opt => {
            const key = 'filter' + opt.value.charAt(0).toUpperCase() + opt.value.slice(1).replace('current', '');
            if (translations[lang][key]) {
                opt.textContent = translations[lang][key];
            }
        });
    }

    // Update Header Text Manually
    const h1 = document.querySelector('h1');
    if (h1) h1.textContent = translations[lang].mainTitle;
    const desc = document.querySelector('.description');
    if (desc) desc.textContent = translations[lang].subTitle;

    // Update Button Toggle
    const langToggle = document.getElementById('languageToggle');
    if (langToggle) langToggle.textContent = lang === 'id' ? '🌐 EN' : '🌐 ID';
    
    // Update Moment.js locale
    if (typeof moment !== 'undefined') moment.locale(lang);

    // Update Chart Labels 
    if (cycleTimeChart) {
        cycleTimeChart.options.scales.y.title.text = translations[lang].cycleTimeLabel;
        cycleTimeChart.options.scales.x.title.text = translations[lang].cycleLabel;
        cycleTimeChart.data.datasets[0].label = translations[lang].cycleTimeLabel;
        cycleTimeChart.data.datasets[1].label = translations[lang].limitLower + ` (${LOWER_LIMIT.toFixed(2)}s)`;
        cycleTimeChart.data.datasets[2].label = translations[lang].limitUpper + ` (${UPPER_LIMIT.toFixed(2)}s)`;
        cycleTimeChart.update();
    }

    // Update Table Headers 
    if (tableHeaders.length > 0) {
        tableHeaders = [
            translations[lang].tableHeader0,
            translations[lang].tableHeader1,
            translations[lang].tableHeader2,
            translations[lang].tableHeader3
        ];
        renderTable(false);
    }
}

// ===== KONFIGURASI + VARIABEL BARU ADMIN =====
const SHEET_ID = '1rCXUBCO_Yo_QbVseleXOVxcTxBu2stqHolCzVHt2V38';
const RANGE = 'Sheet1!A:D';
const API_KEY = 'AIzaSyBBQrCTUEtB_4SDudVzmmcFRXLP614FZZc';

// DIUBAH: Ambil dari localStorage jika ada, jika tidak gunakan default
let LOWER_LIMIT = parseFloat(localStorage.getItem('lowerLimit')) || 55;
let UPPER_LIMIT = parseFloat(localStorage.getItem('upperLimit')) || 65;

// Konfigurasi Admin
const ADMIN_USERNAME = 'admin'; 
const ADMIN_PASSWORD = '123';   
let isLoggedIn = false;

// ===== MACHINE & PART (NEW) =====
let MACHINE_NAME = localStorage.getItem("machineName") || "-";
let PART_NAME = localStorage.getItem("partName") || "-";
let PART_NUMBER = localStorage.getItem("partNumber") || "-";

let cycleTimeChart;
let statusChart;
let autoRefreshInterval;

let filteredTableRows = [];
let tableHeaders = [];
let tableRowsAll = [];

let currentPage = 1;
let rowsPerPage = 10;
let currentSortIndex = null;
let sortDirection = 'asc';

let filterStartDate = null; 
let filterEndDate = null; 

// ===== INISIALISASI & EVENT LISTENER =====
document.addEventListener('DOMContentLoaded', function() {
    updateTextContent(currentLanguage);
    
    // Event listener untuk tombol toggle bahasa
    const langToggleBtn = document.getElementById('languageToggle');
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'id' ? 'en' : 'id';
            localStorage.setItem('lang', currentLanguage);
            updateTextContent(currentLanguage);
            if (tableRowsAll.length > 0) {
                 const lowerCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) < LOWER_LIMIT).length;
                 const normalCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) >= LOWER_LIMIT && (parseFloat(r[2]) || 0) <= UPPER_LIMIT).length;
                 const overCount = tableRowsAll.filter(r => (parseFloat(r[2]) || 0) > UPPER_LIMIT).length;
                 updateCharts([], lowerCount, normalCount, overCount);
            }
        });
    }

    if (typeof moment !== 'undefined') moment.locale(currentLanguage);
    initCharts();
    
    setFilterRange('all');
    loadDataFromSheets(); 
    
    const loadDataBtn = document.getElementById('loadData');
    if (loadDataBtn) loadDataBtn.addEventListener('click', loadDataFromSheets);

    // === LISTENER KONTROL FILTER ===
    const datePresetEl = document.getElementById('datePreset');
    if (datePresetEl) {
        datePresetEl.addEventListener('change', function(e) {
            const preset = e.target.value;
            const customControls = document.getElementById('customRangeControls');
            
            if (preset === 'custom') {
                if (customControls) customControls.style.display = 'flex';
                filterStartDate = null;
                filterEndDate = null;
            } else {
                if (customControls) customControls.style.display = 'none';
                setFilterRange(preset);
                
                if (tableRowsAll.length > 0) {
                    processData(tableRowsAll); 
                } else {
                    loadDataFromSheets();
                }
            }
        });
    }

    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', () => {
            const start = (document.getElementById('startDate') || {}).value;
            const end = (document.getElementById('endDate') || {}).value;
            
            if (start && end) {
                setFilterRange('custom', start, end);
                
                if (tableRowsAll.length > 0) {
                    processData(tableRowsAll);
                } else {
                    loadDataFromSheets();
                }
            } else {
                alert(currentLanguage === 'id' ? "Mohon masukkan Tanggal Mulai dan Tanggal Akhir." : "Please enter both Start Date and End Date.");
            }
        });
    }

    // === LISTENER KONTROL TABEL ===
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });
    }
    const rowsPerPageEl = document.getElementById('rowsPerPage');
    if (rowsPerPageEl) {
        rowsPerPageEl.addEventListener('change', (e) => {
            rowsPerPage = parseInt(e.target.value, 10);
            currentPage = 1;
            renderTable();
        });
    }
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCurrentToCSV);
    
    // Timer auto refresh
    autoRefreshInterval = setInterval(loadDataFromSheets, 10000); // 10000ms = 10 detik

    // === LISTENER KONTROL ADMIN BARU ===
    const adminModal = document.getElementById('adminModal');
    const adminToggle = document.getElementById('adminLoginToggle');
    const closeBtn = adminModal ? adminModal.querySelector('.close-button') : null;
    const loginBtn = document.getElementById('loginAdminBtn');
    const resetBtn = document.getElementById('resetDataBtn');
    const saveLimitsBtn = document.getElementById('saveLimitsBtn');
    const resetLimitsBtn = document.getElementById('resetLimitsBtn');

    // Buka Modal Admin
    if (adminToggle && adminModal) {
        adminToggle.onclick = function() {
            // Perbarui nilai batas yang tampil (ambil dari localStorage atau variable)
            const savedLower = localStorage.getItem('lowerLimit') || LOWER_LIMIT;
            const savedUpper = localStorage.getItem('upperLimit') || UPPER_LIMIT;
            
            const currentLowerEl = document.getElementById('currentLower');
            const currentUpperEl = document.getElementById('currentUpper');
            const newLowerEl = document.getElementById('newLowerLimit');
            const newUpperEl = document.getElementById('newUpperLimit');

            if (currentLowerEl) currentLowerEl.textContent = parseFloat(savedLower).toFixed(2);
            if (currentUpperEl) currentUpperEl.textContent = parseFloat(savedUpper).toFixed(2);
            if (newLowerEl) newLowerEl.value = savedLower;
            if (newUpperEl) newUpperEl.value = savedUpper;

            // Tampilkan/Sembunyikan menu berdasarkan status login
            const adminControlsEl = document.getElementById('adminControls');
            if (adminControlsEl) adminControlsEl.style.display = isLoggedIn ? 'block' : 'none';
            if (loginBtn) loginBtn.style.display = isLoggedIn ? 'none' : 'block';
            adminModal.style.display = 'block';

            // === Sync machine/part fields into modal if present ===
            const adminMachine = document.getElementById('adminMachine');
            const adminPartName = document.getElementById('adminPartName');
            const adminPartNumber = document.getElementById('adminPartNumber');

            if (adminMachine) adminMachine.value = localStorage.getItem('machineName') || MACHINE_NAME || '-';
            if (adminPartName) adminPartName.value = localStorage.getItem('partName') || PART_NAME || '-';
            if (adminPartNumber) adminPartNumber.value = localStorage.getItem('partNumber') || PART_NUMBER || '-';
        };
    }

    // Tutup Modal
    if (closeBtn) {
        closeBtn.onclick = function() {
            adminModal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (adminModal && event.target == adminModal) {
            adminModal.style.display = 'none';
        }
    }
    
    // --- Otentikasi Login ---
    if (loginBtn) {
        loginBtn.onclick = function() {
            const user = (document.getElementById('adminUsername') || {}).value;
            const pass = (document.getElementById('adminPassword') || {}).value;
            const msg = document.getElementById('loginMessage');

            if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
                isLoggedIn = true;
                if (msg) {
                    msg.textContent = currentLanguage === 'id' ? "Login Berhasil!" : "Login Successful!";
                    msg.style.color = 'green';
                }
                
                const adminControlsEl = document.getElementById('adminControls');
                if (adminControlsEl) adminControlsEl.style.display = 'block';
                loginBtn.style.display = 'none';
            } else {
                if (msg) {
                    msg.textContent = currentLanguage === 'id' ? "Username atau password salah." : "Incorrect username or password.";
                    msg.style.color = 'red';
                }
                isLoggedIn = false;
            }
        };
    }

    // --- Simpan Batas Limit (DISIMPAN KE LOCALSTORAGE) ---
    if (saveLimitsBtn) {
        saveLimitsBtn.onclick = function() {
            if (!isLoggedIn) return;
            const newLower = parseFloat(document.getElementById('newLowerLimit').value);
            const newUpper = parseFloat(document.getElementById('newUpperLimit').value);
            const limitMsg = document.getElementById('limitMessage');

            if (isNaN(newLower) || isNaN(newUpper) || newLower <= 0 || newUpper <= newLower) {
                if (limitMsg) {
                    limitMsg.textContent = currentLanguage === 'id' ? "Batas tidak valid. Pastikan Upper > Lower." : "Invalid limits. Ensure Upper > Lower.";
                    limitMsg.style.color = 'red';
                }
                return;
            }

            // SIMPAN KE LOCALSTORAGE
            localStorage.setItem('lowerLimit', newLower);
            localStorage.setItem('upperLimit', newUpper);
            
            // Update variabel global
            LOWER_LIMIT = newLower;
            UPPER_LIMIT = newUpper;
            
            // Update UI
            const currentLowerEl = document.getElementById('currentLower');
            const currentUpperEl = document.getElementById('currentUpper');
            if (currentLowerEl) currentLowerEl.textContent = newLower.toFixed(2);
            if (currentUpperEl) currentUpperEl.textContent = newUpper.toFixed(2);
            
            if (limitMsg) {
                limitMsg.textContent = currentLanguage === 'id' ? translations[currentLanguage].saveSuccess : translations['en'].saveSuccess;
                limitMsg.style.color = 'green';
            }
            
            // Perbarui chart dengan limit baru
            if (cycleTimeChart) {
                updateTextContent(currentLanguage);
                // Refresh data untuk update status berdasarkan limit baru
                if (tableRowsAll.length > 0) {
                    processData(tableRowsAll);
                }
            }
            
            setTimeout(() => { if (limitMsg) limitMsg.textContent = ''; }, 3000);
        };
    }
    
    // --- Reset Limits ke Default ---
    if (resetLimitsBtn) {
        resetLimitsBtn.onclick = function() {
            if (!isLoggedIn) return;
            
            const confirmation = confirm(currentLanguage === 'id' 
                ? "Reset limits ke nilai default (55 dan 65)?" 
                : "Reset limits to default values (55 and 65)?");
            
            if (confirmation) {
                // Hapus dari localStorage untuk kembali ke default
                localStorage.removeItem('lowerLimit');
                localStorage.removeItem('upperLimit');
                
                // Reset ke nilai default
                const defaultLower = 55;
                const defaultUpper = 65;
                
                LOWER_LIMIT = defaultLower;
                UPPER_LIMIT = defaultUpper;
                
                // Update UI di modal
                const currentLowerEl = document.getElementById('currentLower');
                const currentUpperEl = document.getElementById('currentUpper');
                const newLowerEl = document.getElementById('newLowerLimit');
                const newUpperEl = document.getElementById('newUpperLimit');

                if (currentLowerEl) currentLowerEl.textContent = defaultLower.toFixed(2);
                if (currentUpperEl) currentUpperEl.textContent = defaultUpper.toFixed(2);
                if (newLowerEl) newLowerEl.value = defaultLower;
                if (newUpperEl) newUpperEl.value = defaultUpper;
                
                const limitMsg = document.getElementById('limitMessage');
                if (limitMsg) {
                    limitMsg.textContent = currentLanguage === 'id' ? translations[currentLanguage].resetSuccess : translations['en'].resetSuccess;
                    limitMsg.style.color = 'green';
                }
                
                // Update chart dengan limit default
                if (cycleTimeChart) {
                    updateTextContent(currentLanguage);
                    // Refresh data untuk update status berdasarkan limit baru
                    if (tableRowsAll.length > 0) {
                        processData(tableRowsAll);
                    }
                }
                
                setTimeout(() => { if (limitMsg) limitMsg.textContent = ''; }, 3000);
            }
        };
    }

    // --- Reset Data ---
    if (resetBtn) {
        resetBtn.onclick = function() {
            if (!isLoggedIn) return;

            const confirmation = confirm(currentLanguage === 'id' ? "ANDA YAKIN INGIN MERESET SEMUA DATA PRODUKSI? Aksi ini tidak dapat dibatalkan." : "ARE YOU SURE YOU WANT TO RESET ALL PRODUCTION DATA? This action cannot be undone.");
            
            if (confirmation) {
                resetAllData();
                const resetMsg = document.getElementById('resetMessage');
                if (resetMsg) {
                    resetMsg.textContent = currentLanguage === 'id' ? "Permintaan Reset Data berhasil dikirim (Simulasi: Perlu API tulis)." : "Data Reset request sent (Simulation: Write API needed).";
                    resetMsg.style.color = 'green';
                    setTimeout(() => { resetMsg.textContent = ''; }, 5000);
                }
            }
        };
    }

    // === MACHINE/PART ADMIN SAVE BUTTON BIND ===
    const saveMachinePartBtn = document.getElementById('saveMachinePartBtn');
    if (saveMachinePartBtn) {
        saveMachinePartBtn.addEventListener('click', function() {
            saveMachinePart();
        });
    }

    // === LOAD MACHINE/PART KE DASHBOARD ===
    loadMachinePart();

});

// ===== FUNGSI SET FILTER RANGE =====
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

    } 
    // ✅ SUPPORT KEDUA FORMAT VALUE
    else if (preset === 'week' || preset === 'currentWeek') {
        filterStartDate = moment(now).startOf('week');
        filterEndDate = moment(now).endOf('day');

    } 
    else if (preset === 'month' || preset === 'currentMonth') {
        filterStartDate = moment(now).startOf('month');
        filterEndDate = moment(now).endOf('day');

    } 
    else if (preset === 'custom' && start && end) {
        filterStartDate = moment(start).startOf('day');
        filterEndDate = moment(end).endOf('day');
    } 
    // ✅ PENTING UNTUK "SEMUA DATA"
    else if (preset === 'all') {
        filterStartDate = null;
        filterEndDate = null;
    }
}


// ===== FUNGSI INIT CHART =====
function initCharts() {
    const ctx = document.getElementById('cycleTimeChart').getContext('2d');
    const lang = currentLanguage;
    cycleTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: translations[lang].cycleTimeLabel,
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                },
                {
                    label: translations[lang].limitLower + ` (${LOWER_LIMIT.toFixed(2)}s)`,
                    data: [],
                    borderColor: 'red',
                    borderDash: [5, 5],
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: translations[lang].limitUpper + ` (${UPPER_LIMIT.toFixed(2)}s)`,
                    data: [],
                    borderColor: 'red',
                    borderDash: [5, 5],
                    borderWidth: 1,
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
                    title: {
                        display: true,
                        text: translations[lang].cycleTimeLabel,
                        color: '#a0d2eb'
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a0d2eb' }
                },
                x: {
                    title: {
                        display: true,
                        text: translations[lang].cycleLabel,
                        color: '#a0d2eb'
                    },
                    grid: { display: false },
                    ticks: { color: '#a0d2eb' }
                }
            },
            plugins: {
                legend: { labels: { color: '#a0d2eb' } }
            }
        }
    });
    
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: [translations[lang].statusLower, translations[lang].statusNormal, translations[lang].statusOver],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(255, 165, 0, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 165, 0, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)'
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
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
                            return context.label.split(':')[0] + ": " + value + " (" + percentage + ")"; 
                        }
                    }
                }
            }
        }
    });
}

// ===== FUNGSI LOAD DATA =====
async function loadDataFromSheets() {
    try {
        document.getElementById('tableContainer').innerHTML = `<div class="loading">${translations[currentLanguage].loadingMessage}</div>`;
        
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch data from the server');
        
        const data = await response.json();
        
        tableRowsAll = data.values.slice(1).filter(row => row[1] !== "-" && row[2] !== "-");
        
        processData(data.values);
        
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) lastUpdatedEl.textContent = `${translations[currentLanguage].lastUpdatedPrefix} ${moment().format('LLLL')}`;
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('tableContainer').innerHTML = `<div class="loading">Error: ${error.message}. Please ensure a stable internet connection.</div>`;
    }
}

// ===== FUNGSI PROCESS DATA =====
function processData(data) {
    if (!data || data.length < 2) {
        document.getElementById('tableContainer').innerHTML = `<div class="loading">${currentLanguage === 'id' ? 'Tidak ada data produksi ditemukan' : 'No production data found'}</div>`;
        return;
    }
    
    tableHeaders = [
        translations[currentLanguage].tableHeader0,
        translations[currentLanguage].tableHeader1,
        translations[currentLanguage].tableHeader2,
        translations[currentLanguage].tableHeader3
    ];
    
    const rawRows = tableRowsAll; 

    // 1. TAHAP FILTER BERDASARKAN RANGE TANGGAL
   if (filterStartDate && filterEndDate) {
    filteredTableRows = rawRows.filter(row => {
        const rowMoment = moment(row[0]);
        return rowMoment.isValid() &&
               rowMoment.isSameOrAfter(filterStartDate) &&
               rowMoment.isSameOrBefore(filterEndDate);
    });
} else {
    filteredTableRows = [...rawRows];
}

    const rows = filteredTableRows;
    
    currentPage = 1;
    renderTable();

    // 2. PERHITUNGAN STATISTIK
    const chartData = [];
    let totalCycleTime = 0;
    let minCycleTime = Infinity;
    let maxCycleTime = 0;
    let totalCycles = 0;
    let todayCycles = 0;
    let lowerCount = 0, normalCount = 0, overCount = 0;
    let lastCycleTime = 0;
    let lastCycleStatus = '';
    
    rows.forEach((row, idx) => {
        const cycleTime = parseFloat(row[2]) || 0;
        const timestamp = row[0] || '';
        
        const isToday = moment(timestamp).isSame(moment(), 'day');
        
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
            if (idx === rows.length - 1) {
                lastCycleTime = cycleTime;
                lastCycleStatus = statusFromCycle(cycleTime);
            }
        }
    });

    const avgCycleTime = totalCycles > 0 ? totalCycleTime / totalCycles : 0;
    const avgEl = document.getElementById('avgCycleTime');
    if (avgEl) avgEl.textContent = isNaN(avgCycleTime) ? '0.00s' : avgCycleTime.toFixed(2) + 's';
    const totalCyclesEl = document.getElementById('totalCycles');
    if (totalCyclesEl) totalCyclesEl.textContent = totalCycles;
    const minEl = document.getElementById('minCycleTime');
    if (minEl) minEl.textContent = isFinite(minCycleTime) ? minCycleTime.toFixed(2) + 's' : '0.00s';
    const statMaxEl = document.querySelector('[data-key="statMaxCycle"]');
    if (statMaxEl) statMaxEl.textContent = `${translations[currentLanguage].statMaxCycle} ${isFinite(maxCycleTime) ? maxCycleTime.toFixed(2) + 's' : '0.00s'}`;
    const statTodayEl = document.querySelector('[data-key="statToday"]');
    if (statTodayEl) statTodayEl.textContent = `${translations[currentLanguage].statToday} ${todayCycles}`;

    const lastCycleTimeEl = document.getElementById('lastCycleTime');
    if (lastCycleTimeEl) lastCycleTimeEl.textContent = lastCycleTime.toFixed(2) + 's';
    
    const statusElement = document.getElementById('lastCycleStatus');
    const displayStatus = translations[currentLanguage]['status' + (lastCycleStatus ? lastCycleStatus.charAt(0).toUpperCase() + lastCycleStatus.slice(1).toLowerCase() : 'Normal')];

    if (statusElement) {
        statusElement.textContent = `${translations[currentLanguage].statStatusPrefix} ${displayStatus}`;
        if (lastCycleStatus === 'NORMAL') statusElement.style.color = '#2ecc71';
        else if (lastCycleStatus === 'LOWER') statusElement.style.color = '#ffa500';
        else statusElement.style.color = '#e74c3c';
    }
    
    updateCharts(chartData, lowerCount, normalCount, overCount);
}

// ===== FUNGSI UPDATE CHART =====
function updateCharts(chartData, lowerCount, normalCount, overCount) {
    const lang = currentLanguage;
    const total = lowerCount + normalCount + overCount;

    const recentChartData = chartData.slice(-50);
    if (cycleTimeChart) {
        cycleTimeChart.data.labels = recentChartData.map((_, index) => `${translations[lang].cycleLabel} ${index + 1}`);
        cycleTimeChart.data.datasets[0].data = recentChartData.map(item => item.value);
        
        // Memastikan label limit di update sesuai nilai baru
        if (cycleTimeChart.data.datasets[1]) cycleTimeChart.data.datasets[1].label = translations[lang].limitLower + ` (${LOWER_LIMIT.toFixed(2)}s)`;
        if (cycleTimeChart.data.datasets[2]) cycleTimeChart.data.datasets[2].label = translations[lang].limitUpper + ` (${UPPER_LIMIT.toFixed(2)}s)`;

        cycleTimeChart.data.datasets[1].data = Array(recentChartData.length).fill(LOWER_LIMIT);
        cycleTimeChart.data.datasets[2].data = Array(recentChartData.length).fill(UPPER_LIMIT);
        cycleTimeChart.update();
    }
    
    if (statusChart) {
        statusChart.data.datasets[0].data = [lowerCount, normalCount, overCount];
        
        const labels = [
            translations[lang].statusLower,
            translations[lang].statusNormal,
            translations[lang].statusOver
        ];

        statusChart.data.labels = [
            `${labels[0]}: ${lowerCount} (${total > 0 ? ((lowerCount / total) * 100).toFixed(1) : 0}%)`,
            `${labels[1]}: ${normalCount} (${total > 0 ? ((normalCount / total) * 100).toFixed(1) : 0}%)`,
            `${labels[2]}: ${overCount} (${total > 0 ? ((overCount / total) * 100).toFixed(1) : 0}%)`
        ];
        
        statusChart.update();
    }
}

// ===== FUNGSI STATUS DARI CYCLE =====
function statusFromCycle(cycleTime) {
    if (cycleTime < LOWER_LIMIT) return 'LOWER';
    if (cycleTime > UPPER_LIMIT) return 'OVER';
    return 'NORMAL';
}

// ===== FUNGSI RENDER TABLE =====
function renderTable(resetSort = true) {

    const rowsToRender = filteredTableRows.length 
        ? filteredTableRows 
        : tableRowsAll;

    if (!rowsToRender.length) {
        const tableContainer = document.getElementById('tableContainer');
        if (tableContainer) tableContainer.innerHTML = `<div class="loading">${currentLanguage === 'id' ? 'Tidak ada data ditemukan dalam periode ini.' : 'No data found in this period.'}</div>`;
        const pagination = document.getElementById('pagination');
        if (pagination) pagination.innerHTML = '';
        return;
    }

    const search = (document.getElementById('searchInput') || {}).value?.toLowerCase() || '';

    let filtered = rowsToRender.filter(r => {
        const status = statusFromCycle(parseFloat(r[2]) || 0);
        const displayStatus = translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];

        return (r[0] || '').toLowerCase().includes(search) || 
               (r[2] || '').toLowerCase().includes(search) ||
               (displayStatus || '').toLowerCase().includes(search);
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

    rowsPerPage = parseInt((document.getElementById('rowsPerPage') || {}).value || rowsPerPage, 10);
    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(start, start + rowsPerPage);

    let tableHTML = `
        <div class="table-wrapper">
            <table class="data-table">
                <thead>
                    <tr>
                        ${tableHeaders.map((h, i) => {
                            const arrow = currentSortIndex === i ? (sortDirection === 'asc' ? '▲' : '▼') : '';
                            return `<th onclick="handleSort(${i})">${h}<span class="sort-indicator">${arrow}</span></th>`;
                        }).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${pageRows.map(row => {
                        const cycleTime = parseFloat(row[2]) || 0;
                        const status = statusFromCycle(cycleTime);
                        const displayStatus = translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];
                        return `
                            <tr>
                                <td>${moment(row[0]).format('DD/MM/YYYY HH:mm:ss')}</td>
                                <td>${row[1]}</td>
                                <td>${cycleTime.toFixed(2)}s</td>
                                <td><span class="status-badge status-${status.toLowerCase()}">${displayStatus}</span></td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
    const tableContainer = document.getElementById('tableContainer');
    if (tableContainer) tableContainer.innerHTML = tableHTML;
}



// ===== FUNGSI SORTING/PAGINATION/EXPORT =====
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

function exportCurrentToCSV() {
    const rowsToExport = filteredTableRows.length 
    ? filteredTableRows 
    : tableRowsAll;

    
    if (rowsToExport.length === 0) {
        alert(currentLanguage === 'id' ? "Tidak ada data untuk di-export." : "No data to export.");
        return;
    }

    const search = (document.getElementById('searchInput') || {}).value?.toLowerCase() || '';
    let filtered = rowsToExport.filter(r => {
        const status = statusFromCycle(parseFloat(r[2]) || 0);
        const displayStatus = translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];
        return (r[0] || '').toLowerCase().includes(search) || 
               (r[2] || '').toLowerCase().includes(search) ||
               (displayStatus || '').toLowerCase().includes(search);
    });

    if (currentSortIndex !== null) {
         const columnIndex = currentSortIndex;
         const direction = sortDirection === 'asc' ? 1 : -1;
        
         filtered.sort((a, b) => {
             let valA = a[columnIndex];
             let valB = b[columnIndex];

             if (columnIndex === 0) { 
                 return direction * (moment(valA).valueOf() - moment(valB).valueOf());
             } else if (columnIndex === 2) { 
                 valA = parseFloat(valA) || 0;
                 valB = parseFloat(valB) || 0;
                 return direction * (valA - valB);
             } else { 
                 if (valA < valB) return direction * -1;
                 if (valA > valB) return direction * 1;
                 return 0;
             }
         });
    }
    
    const csvHeaders = [
        translations[currentLanguage].tableHeader0,
        translations[currentLanguage].tableHeader1,
        translations[currentLanguage].tableHeader2,
        translations[currentLanguage].tableHeader3
    ];
    let csv = csvHeaders.join(',') + '\n';

    filtered.forEach(r => { 
        const cycleTime = parseFloat(r[2]) || 0;
        const status = statusFromCycle(cycleTime);
        const displayStatus = translations[currentLanguage]['status' + status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()];
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

// ===== FUNGSI ADMIN =====
function updateLimits(newLower, newUpper) {
    // Fungsi ini sekarang tidak perlu digunakan karena sudah langsung di handle di event listener
    LOWER_LIMIT = newLower;
    UPPER_LIMIT = newUpper;
    
    // Setelah batas berubah, proses ulang data untuk update tampilan chart/statistik
    if (tableRowsAll.length > 0) {
        processData(tableRowsAll); 
    }
}

function resetAllData() {
    // PERINGATAN: Di lingkungan nyata, ini HARUS memanggil API server / Google Apps Script
    // yang memiliki izin tulis untuk menghapus data di Google Sheet Anda.

    alert(currentLanguage === 'id' ? "Fungsi reset hanya simulasi. Perlu API tulis ke Google Sheets untuk implementasi penuh." : "Reset function is a simulation. Full write API needed to Google Sheets.");
    
    // Pilihan: Anda bisa memuat ulang data di sini jika API Reset dipanggil
    // loadDataFromSheets(); 
}

/* =========================
   MACHINE & PART FUNCTIONS
   ========================= */
function loadMachinePart() {
    const machineEl = document.getElementById("machineName") || document.getElementById("machineDisplay") || document.getElementById("machine");
    const partNameEl = document.getElementById("partName") || document.getElementById("partNameDisplay") || document.getElementById("part");
    const partNumberEl = document.getElementById("partNumber") || document.getElementById("partNumberDisplay") || document.getElementById("partNo");

    MACHINE_NAME = localStorage.getItem("machineName") || MACHINE_NAME || "-";
    PART_NAME = localStorage.getItem("partName") || PART_NAME || "-";
    PART_NUMBER = localStorage.getItem("partNumber") || PART_NUMBER || "-";

    if (machineEl) machineEl.textContent = MACHINE_NAME;
    if (partNameEl) partNameEl.textContent = PART_NAME;
    if (partNumberEl) partNumberEl.textContent = PART_NUMBER;

    // Sync to admin inputs if present
    const adminMachine = document.getElementById('adminMachine');
    const adminPartName = document.getElementById('adminPartName');
    const adminPartNumber = document.getElementById('adminPartNumber');

    if (adminMachine) adminMachine.value = MACHINE_NAME === "-" ? "" : MACHINE_NAME;
    if (adminPartName) adminPartName.value = PART_NAME === "-" ? "" : PART_NAME;
    if (adminPartNumber) adminPartNumber.value = PART_NUMBER === "-" ? "" : PART_NUMBER;
}

function saveMachinePart() {
    if (!isLoggedIn) {
        alert(currentLanguage === 'id' ? "Login admin terlebih dahulu!" : "Please login as admin first!");
        return;
    }

    const adminMachine = document.getElementById('adminMachine');
    const adminPartName = document.getElementById('adminPartName');
    const adminPartNumber = document.getElementById('adminPartNumber');

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
