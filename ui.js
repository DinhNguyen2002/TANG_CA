document.getElementById("loadBtn").addEventListener("click", load);

load(); // load all lần đầu

async function load() {
  const date = document.getElementById("dateInput").value;
  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const data = await getData(date);
    renderTable(data);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="6">Error loading data</td></tr>`;
  }
}

// function renderTable(data) {
//   const tbody = document.getElementById("tableBody");
//   tbody.innerHTML = "";

//   if (!data.length) {
//     tbody.innerHTML = `<tr><td colspan="6">No data</td></tr>`;
//     return;
//   }

//   data.forEach(r => {
//     const row = document.createElement("tr");

//     // mapping data → DOM (UI chịu trách nhiệm)     <td>${r.stt}</td>
//     row.innerHTML = `
//       <td>${r.sheet}</td>

//       <td>${formatDate(r.date)}</td>
//       <td>${r.out}</td>
//       <td>${r.time}</td>
//       <td>${r.sum}</td>
//     `;

//     tbody.appendChild(row);
//   });
// }

function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN");
}
function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  // const now = new Date();
  const now = new Date(2025, 11, 31);
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  // 1. Lọc: cùng tháng + cùng năm + ngày <= hôm nay
  const filteredData = data.filter(r => {
    const d = new Date(r.date);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear &&
      d.getDate() <= today
    );
  });

  // 2. Sắp xếp: hôm nay → ngày 1
  filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!filteredData.length) {
    tbody.innerHTML = `<tr><td colspan="5">No data</td></tr>`;

    // reset stats
    document.getElementById("totalDays").innerText = 0;
    document.getElementById("totalTime").innerText = 0;
    document.getElementById("totalSum").innerText = 0;
    return;
  }

  // 3. Render table
  filteredData.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDate(r.date)}</td>
      <td>${r.out ?? ""}</td>
      <td>${r.time ?? 0}</td>
      <td>${r.sum ?? ""}</td>
    `;
    tbody.appendChild(row);
  });

  // ===== UPDATE STATS =====

  // Số ngày tăng ca (out > 0)
  const totalDaysOT = filteredData.filter(r => {
    return r.time !== null && r.time !== undefined && Number(r.time) > 0;
  }).length;
  document.getElementById("totalDays").innerText = totalDaysOT;

  // Tổng thời gian 
  document.getElementById("totalTime").innerText =
    filteredData.reduce((sum, r) => sum + Number(r.time || 0), 0);

  // Số ngày làm (tất cả ngày có data)
 // document.getElementById("totalSum").innerText = filteredData.length;
const totalWorkingDays = filteredData.reduce((sum, r) => {
  const timeOut = Number(r.out);

  if (isNaN(timeOut)) return sum;

  if (timeOut >= 16.5) {
    return sum + 1;
  }

  // time_out < 16.5
  const denominator = timeOut - 8;
  if (denominator <= 0) return sum; // tránh chia 0 / âm

  return sum + 8 / denominator;
}, 0);

// làm tròn 2 chữ số
document.getElementById("totalSum").innerText = totalWorkingDays.toFixed(2);

}



// const now = new Date();
const now = new Date(2025, 11, 31);
const thisMonth = now.getMonth() + 1; // 1–12
const thisYear = now.getFullYear();

document.getElementById("pageTitle").innerText =
  `📊 LỊCH TĂNG CA ${String(thisMonth).padStart(2, "0")}/${thisYear}`;



