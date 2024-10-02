// Get elements
const expenseForm = document.getElementById('expense-form');
const expenseNameInput = document.getElementById('expense-name');
const expenseAmountInput = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to update the total amount
function updateTotal() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    totalAmount.textContent = total.toFixed(2);
}

// Function to save expenses to local storage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to render the expense list
function renderExpenses() {
    expenseList.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name}: ₹${expense.amount}
            <button onclick="editExpense(${index})">Edit</button>
            <button onclick="deleteExpense(${index})">Delete</button>
        `;
        expenseList.appendChild(li);
    });
    updateTotal();
}

// Function to add a new expense
function addExpense(event) {
    event.preventDefault();
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    if (name && !isNaN(amount) && amount > 0) {
        expenses.push({ name, amount });
        saveExpenses();
        renderExpenses();
        expenseForm.reset();
    }
}

// Function to delete an expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    saveExpenses();
    renderExpenses();
}

// Function to edit an expense
function editExpense(index) {
    const expense = expenses[index];
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;

    deleteExpense(index);  // Remove the expense to edit and add it back after the form is resubmitted
}

// Add event listener for form submission
expenseForm.addEventListener('submit', addExpense);

// Initial render
renderExpenses();
