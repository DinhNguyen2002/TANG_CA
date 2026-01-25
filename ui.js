/* =========================
   INIT
========================= */
document.getElementById("loadBtn").addEventListener("click", onFilter);

load(); // load lần đầu

const now = new Date();

/* =========================
   READ MONTH / YEAR
   - Local: ?m=12&y=2025
   - Prod: /12/2025
========================= */
function getMonthYearFromUrl() {
  const params = new URLSearchParams(location.search);
  const m = parseInt(params.get("m"), 10);
  const y = parseInt(params.get("y"), 10);

  if (m >= 1 && m <= 12 && y >= 2000) {
    return { month: m - 1, year: y };
  }

  const parts = location.pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const month = parseInt(parts.at(-2), 10);
    const year = parseInt(parts.at(-1), 10);
    if (month >= 1 && month <= 12 && year >= 2000) {
      return { month: month - 1, year };
    }
  }

  return {
    month: now.getMonth(),
    year: now.getFullYear()
  };
}

/* =========================
   LOAD DATA (ALWAYS FULL)
========================= */
async function load() {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = `<tr><td colspan="4">Loading...</td></tr>`;

  try {
    const data = await getData(null); // ⚠️ luôn lấy full data
    renderTable(data);
    syncSelectWithUrl();
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
  }
}

/* =========================
   FILTER BUTTON
========================= */
function onFilter() {
  const m = document.getElementById("monthSelect").value;
  const y = document.getElementById("yearSelect").value;

  if (!m || !y) {
    alert("Vui lòng chọn tháng và năm");
    return;
  }

  location.href = `${location.pathname}?m=${m}&y=${y}`;
}

/* =========================
   UTILS
========================= */
function formatDateWithDay(d) {
  const date = new Date(d);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  const dateStr = `${dd}/${mm}/${yyyy}`;

  const dayIndex = date.getDay(); // 0 = CN
  const hour = date.getHours();

  const dayConfig = {
    0: { label: "CN", bg: "#dc3545" },
    1: { label: "T2", bg: "#ffc107" },
    2: { label: "T3", bg: "#f8a5c2" },
    3: { label: "T4", bg: hour >= 6 && hour < 18 ? "#198754" : "#6c757d" },
    4: { label: "T5", bg: "#fd7e14" },
    5: { label: "T6", bg: "#0d6efd" },
    6: { label: "T7", bg: "#6f42c1" }
  };

  const day = dayConfig[dayIndex];

  return `${dateStr}<span style="display:inline-flex;align-items:center;justify-content:center;min-width:28px;margin-left:6px;padding:2px 6px;border-radius:6px;font-size:0.8em;font-weight:600;line-height:1;color:#fff;background:${day.bg};white-space:nowrap">${day.label}</span>`;
}




function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN");
}

/* =========================
   RENDER TABLE
========================= */
function formatHour(value) {
  const n = Number(value);
  if (isNaN(n) || n <= 0) return "";

  const hours = Math.floor(n);
  const minutes = Math.round((n - hours) * 60);

  // luôn hiển thị đủ phút
  return `${hours}h${String(minutes).padStart(2, "0")}`;
}


function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  const { month, year } = getMonthYearFromUrl();

  const isCurrentMonth =
    month === now.getMonth() &&
    year === now.getFullYear();

  const filteredData = data.filter(r => {
    const d = new Date(r.date);

    if (d.getMonth() !== month || d.getFullYear() !== year) return false;

    // tháng hiện tại → chỉ lấy tới hôm nay
    if (isCurrentMonth) {
      return d.getDate() <= now.getDate();
    }

    return true;
  });

  filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!filteredData.length) {
    tbody.innerHTML = `<tr><td colspan="4">No data</td></tr>`;
    document.getElementById("totalDays").innerText = 0;
    document.getElementById("totalTime").innerText = 0;
    document.getElementById("totalSum").innerText = 0;
    return;
  }

  /* ===== TABLE ===== */
  filteredData.forEach(r => {
    const row = document.createElement("tr");
    const out = Number(r.out);
    let bg = "";

    if (out === 0) bg = "#f8d7da";
    else if (out > 20) bg = "#d1e7dd";
    else if (out > 19) bg = "#cff4fc";
    else if (out > 18) bg = "#fff3cd";

    row.innerHTML = `
<td style="background-color:${bg}">${formatDateWithDay(r.date)}</td>
<td style="background-color:${bg}">
  ${Number(r.out) === 0 ? "Off" : (r.out != null ? formatHour(r.out) : "")}
</td>
<td style="background-color:${bg}">
  ${r.time != null && r.time !== "" ? `${r.time}h` : ""}
</td>
<td style="background-color:${bg}">
  ${r.sum != null && r.sum !== "" ? `${r.sum}h` : ""}
</td>
    `;
    tbody.appendChild(row);
  });

  /* ===== STATS ===== */
  document.getElementById("totalDays").innerText =
    filteredData.filter(r => Number(r.time) > 0).length;

  document.getElementById("totalTime").innerText =
    filteredData.reduce((s, r) => s + Number(r.time || 0), 0);

  const totalWorkingDays = filteredData.reduce((sum, r) => {
    const t = Number(r.out);
    if (isNaN(t)) return sum;
    if (t >= 16.5) return sum + 1;
    const d = t - 8;
    if (d <= 0) return sum;
    return sum + 8 / d;
  }, 0);

  document.getElementById("totalSum").innerText =
    totalWorkingDays.toFixed(2);
}

/* =========================
   SELECT UI
========================= */
function syncSelectWithUrl() {
  const { month, year } = getMonthYearFromUrl();
  document.getElementById("monthSelect").value = month + 1;
  document.getElementById("yearSelect").value = year;
}

/* =========================
   INIT YEAR SELECT
========================= */
(function initYearSelect() {
  const yearSelect = document.getElementById("yearSelect");
  const currentYear = now.getFullYear();

  for (let y = currentYear - 5; y <= currentYear + 1; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }
})();

/* =========================
   TITLE
========================= */
const { month, year } = getMonthYearFromUrl();
document.getElementById("pageTitle").innerText =
  `📊 LỊCH TĂNG CA ${String(month + 1).padStart(2, "0")}/${year}`;
