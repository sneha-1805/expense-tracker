// DOM Elements
const salaryInput = document.getElementById("salaryInput");
const setSalaryBtn = document.getElementById("setSalaryBtn");

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const salaryDisplay = document.getElementById("salaryDisplay");
const expenseDisplay = document.getElementById("expenseDisplay");
const balanceDisplay = document.getElementById("balanceDisplay");

const expenseList = document.getElementById("expenseList");

const darkModeToggle = document.getElementById("darkModeToggle");

// Data
let salary = localStorage.getItem("salary")
  ? Number(localStorage.getItem("salary"))
  : 0;

let expenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

// Set Salary
setSalaryBtn.addEventListener("click", () => {

  const value = Number(salaryInput.value);

  if (value <= 0) {
    alert("Enter valid salary");
    return;
  }

  salary = value;

  localStorage.setItem("salary", salary);

  updateUI();
});

// Add Expense
addExpenseBtn.addEventListener("click", () => {

  const name = expenseName.value.trim();
  const amount = Number(expenseAmount.value);

  if (name === "" || amount <= 0) {
    alert("Please enter valid expense details");
    return;
  }

  const expense = {
    id: Date.now(),
    name,
    amount
  };

  expenses.push(expense);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  expenseName.value = "";
  expenseAmount.value = "";

  updateUI();
});

// Delete Expense
function deleteExpense(id) {

  expenses = expenses.filter(exp => exp.id !== id);

  localStorage.setItem("expenses", JSON.stringify(expenses));

  updateUI();
}

// Update UI
function updateUI() {

  // Totals
  const totalExpenses = expenses.reduce(
    (total, exp) => total + exp.amount,
    0
  );

  const balance = salary - totalExpenses;

  // Display
  salaryDisplay.textContent = `₹${salary}`;
  expenseDisplay.textContent = `₹${totalExpenses}`;
  balanceDisplay.textContent = `₹${balance}`;

  // Budget Alert
  if (balance < salary * 0.1) {
    balanceDisplay.style.color = "red";
  } else {
    balanceDisplay.style.color = "white";
  }

  // Expense List
  expenseList.innerHTML = "";

  expenses.forEach(exp => {

    const li = document.createElement("li");

    li.classList.add("expense-item");

    li.innerHTML = `
      <span>${exp.name} - ₹${exp.amount}</span>
      <button class="delete-btn" onclick="deleteExpense(${exp.id})">
        🗑️
      </button>
    `;

    expenseList.appendChild(li);
  });

  updateChart(totalExpenses, balance);
}

// Chart
let chart;

function updateChart(expensesTotal, balance) {

  const ctx = document.getElementById("expenseChart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Expenses", "Balance"],
      datasets: [{
        data: [expensesTotal, balance],
        backgroundColor: ["#ff6384", "#36a2eb"]
      }]
    }
  });
}

// Dark Mode
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  darkModeToggle.textContent = "☀️";
}

darkModeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    darkModeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    darkModeToggle.textContent = "🌙";
  }

});

// Initial Load
updateUI();