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

  const now = new Date();
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
    tbody.innerHTML = `<tr><td colspan="6">Không có dữ liệu</td></tr>`;
    return;
  }

  filteredData.forEach(r => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.sheet}</td>
      <td>${formatDate(r.date)}</td>
      <td>${r.out}</td>
      <td>${r.time}</td>
      <td>${r.sum}</td>
    `;
    tbody.appendChild(row);
  });
}

