
let tableHeaders = ["Tanggal", "Cycle", "Cycle Time", "Status"];
let tableRowsAll = [];
let currentPage = 1;
let rowsPerPage = 10;

function renderTable() {
  const start = (currentPage - 1) * rowsPerPage;
  const pageRows = tableRowsAll.slice(start, start + rowsPerPage);
  let html = "<table class='data-table'><thead><tr>";
  tableHeaders.forEach(h => html += `<th>${h}</th>`);
  html += "</tr></thead><tbody>";

  pageRows.forEach(r => {
    html += `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`;
  });

  html += "</tbody></table>";
  document.getElementById("tableContainer").innerHTML = html;
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(tableRowsAll.length / rowsPerPage);
  let html = "";

  html += `<button onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>PREV</button>`;

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, start + 4);

  for (let i=start;i<=end;i++){
    html += `<button class='${i===currentPage?'active':''}' onclick='goPage(${i})'>${i}</button>`;
  }

  html += `<button onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}>NEXT</button>`;
  document.getElementById("pagination").innerHTML = html;
}

function goPage(p){
  const totalPages = Math.ceil(tableRowsAll.length / rowsPerPage);
  if(p<1||p>totalPages) return;
  currentPage = p;
  renderTable();
}

document.getElementById("rowsPerPage").addEventListener("change", e=>{
  rowsPerPage = parseInt(e.target.value);
  currentPage = 1;
  renderTable();
});

// Dummy data agar langsung tampil di hosting
for(let i=1;i<=120;i++){
  tableRowsAll.push([`2025-12-${i%30+1}`, i, (20+Math.random()*60).toFixed(2), "NORMAL"]);
}

renderTable();
