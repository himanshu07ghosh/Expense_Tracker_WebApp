document.addEventListener("DOMContentLoaded", () => {

  const itemName = document.getElementById("itemName");
  const itemPrice = document.getElementById("itemPrice");
  const itemDate = document.getElementById("itemDate");
  const addBtn = document.getElementById("addBtn");
  const expenseList = document.getElementById("expenseList");
  const totalAmount = document.getElementById("totalAmount");
  const entryCount = document.getElementById("entryCount");
  const monthFilter = document.getElementById("monthFilter");
  const darkToggle = document.getElementById("darkToggle");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let darkMode = localStorage.getItem("dark") === "true";

  /* ================= DARK MODE ================= */
  document.body.classList.toggle("dark", darkMode);
  darkToggle.textContent = darkMode ? "☀️" : "🌙";

  darkToggle.addEventListener("click", () => {
    darkMode = !darkMode;
    localStorage.setItem("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
    darkToggle.textContent = darkMode ? "☀️" : "🌙";
  });

  /* ================= MONTH FILTER ================= */
  const months = ["All","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  months.forEach((m, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = m;
    monthFilter.appendChild(opt);
  });

  monthFilter.value = new Date().getMonth() + 1;
  itemDate.valueAsDate = new Date();

  /* ================= ADD EXPENSE ================= */
  addBtn.addEventListener("click", () => {

    /*  Proper validation */
    if (!itemName.value.trim() || !itemPrice.value || !itemDate.value) {
      alert("❌ Please enter all details properly");
      return;
    }

    /*  Prevent zero or negative price */
    if (Number(itemPrice.value) <= 0) {
      alert("❌ Price must be greater than zero");
      return;
    }

    const expense = {
      id: Date.now(),
      name: itemName.value.trim(),
      price: Number(itemPrice.value),
      date: itemDate.value
    };

    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    itemName.value = "";
    itemPrice.value = "";

    render();
  });

  /* ================= RENDER ================= */
  function render() {
    expenseList.innerHTML = "";
    let total = 0;
    let count = 0;
    const selectedMonth = Number(monthFilter.value);

    expenses.forEach(e => {
      const d = new Date(e.date);

      if (selectedMonth !== 0 && d.getMonth() + 1 !== selectedMonth) return;

      total += e.price;
      count++;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${d.toDateString()}</td>
        <td>${e.name}</td>
        <td class="amount">₹${formatINR(e.price)}</td>
        <td class="delete"><i class="fa-solid fa-trash-can"></i></td>
      `;

      row.querySelector(".delete").addEventListener("click", () => {
        expenses = expenses.filter(x => x.id !== e.id);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        render();
      });

      expenseList.appendChild(row);
    });

  
    totalAmount.textContent = `₹${formatINR(total)}`;
    entryCount.textContent = `${count} entries`;
  }

  monthFilter.addEventListener("change", render);
  render();
});

/* ================= INR FORMAT FUNCTION ================= */
function formatINR(amount) {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
