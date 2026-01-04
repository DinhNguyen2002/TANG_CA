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

function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = `<tr><td colspan="6">No data</td></tr>`;
    return;
  }

  data.forEach(r => {
    const row = document.createElement("tr");

    // mapping data → DOM (UI chịu trách nhiệm)     <td>${r.stt}</td>
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

function formatDate(d) {
  return new Date(d).toLocaleDateString("vi-VN");
}
