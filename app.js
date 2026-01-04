const API_URL = "https://script.google.com/macros/s/AKfycbzGTYRbnevAWHflZ6EzT6Z9c1uty34JeGvPZyV8IgUr6ioxK8Dw9a1LvZx9zf9Nc_W9/exec";

document.getElementById("loadBtn").addEventListener("click", loadData);

// load all khi mở trang
loadData();

async function loadData() {
  const date = document.getElementById("dateInput").value;
  let url = API_URL;

  if (date) {
    url += "?date=" + date;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error(err);
    alert("Cannot load data");
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No data</td></tr>`;
    return;
  }

  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.sheet}</td>
      <td>${r.stt}</td>
      <td>${formatDate(r.date)}</td>
      <td>${r.out}</td>
      <td>${r.time}</td>
      <td>${r.sum}</td>
    `;
    tbody.appendChild(tr);
  });
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN");
}
