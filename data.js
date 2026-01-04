const API_URL = "https://script.google.com/macros/s/AKfycbzGTYRbnevAWHflZ6EzT6Z9c1uty34JeGvPZyV8IgUr6ioxK8Dw9a1LvZx9zf9Nc_W9/exec";

/**
 * Get data from API
 * @param {string|null} date yyyy-mm-dd
 * @returns {Promise<Array>}
 */
async function getData(date = null) {
  let url = API_URL;
  if (date) url += "?date=" + date;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");

  return await res.json();
}
