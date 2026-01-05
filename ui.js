document.getElementById("loadBtn").addEventListener("click", load);

// load lần đầu
load();

async function load() {
  const date = document.getElementById("dateInput").value;
  const tbody = document.getElementById("tableBody");

  tbody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  try {
    const data = await getData(date);
    renderTable(data);
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
  }
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN");
}

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  // ===== SET TODAY (TEST) =====
  const now = new Date(2025, 11, 31); // 31/12/2025
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const today = now.getDate();

  // ===== FILTER THIS MONTH =====
  const filteredData = data.filter(r => {
    const d = new Date(r.date);
    return (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear &&
      d.getDate() <= today
    );
  });

  // sort: mới → cũ
  filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!filteredData.length) {
    tbody.innerHTML = `<tr><td colspan="4">No data</td></tr>`;
    document.getElementById("totalDays").innerText = 0;
    document.getElementById("totalTime").innerText = 0;
    document.getElementById("totalSum").innerText = 0;
    return;
  }

  // ===== RENDER TABLE + COLOR =====
  filteredData.forEach(r => {
    const row = document.createElement("tr");

    const out = Number(r.out);
    let bg = "";

    if (out === 0) bg = "#f8d7da";       // red
    else if (out > 20) bg = "#d1e7dd";   // green
    else if (out > 19) bg = "#cff4fc";   // blue
    else if (out > 18) bg = "#fff3cd";   // yellow

    row.innerHTML = `
    <td style="background-color:${bg}">${formatDate(r.date)}</td>
    <td style="background-color:${bg}">${r.out ?? ""}</td>
    <td style="background-color:${bg}">${r.time ?? 0}</td>
    <td style="background-color:${bg}">${r.sum ?? ""}</td>
  `;

    tbody.appendChild(row);
  });

  // ===== STATS =====

  // số ngày tăng ca (time > 0)
  const totalDaysOT = filteredData.filter(r => Number(r.time) > 0).length;
  document.getElementById("totalDays").innerText = totalDaysOT;

  // tổng thời gian
  document.getElementById("totalTime").innerText =
    filteredData.reduce((sum, r) => sum + Number(r.time || 0), 0);

  // số ngày làm (logic đặc biệt)
  const totalWorkingDays = filteredData.reduce((sum, r) => {
    const timeOut = Number(r.out);
    if (isNaN(timeOut)) return sum;

    if (timeOut >= 16.5) return sum + 1;

    const denominator = timeOut - 8;
    if (denominator <= 0) return sum;

    return sum + 8 / denominator;
  }, 0);

  document.getElementById("totalSum").innerText =
    totalWorkingDays.toFixed(2);
}

// ===== TITLE =====
const now = new Date(2025, 11, 31);
const thisMonth = now.getMonth() + 1;
const thisYear = now.getFullYear();

document.getElementById("pageTitle").innerText =
  `📊 LỊCH TĂNG CA ${String(thisMonth).padStart(2, "0")}/${thisYear}`;
