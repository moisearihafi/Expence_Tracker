// DOM Elements
const expenseForm = document.getElementById('expense-form');
const transactionsList = document.getElementById('transactions-list');
const balanceElement = document.getElementById('balance');

// State
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize the app
function init() {
    updateBalance();
    renderTransactions();
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    if (!description || isNaN(amount) || !date) {
        alert('Please fill in all fields correctly');
        return;
    }

    const transaction = {
        id: Date.now(),
        description,
        amount,
        date
    };

    transactions.push(transaction);
    saveTransactions();
    updateBalance();
    renderTransactions();
    expenseForm.reset();
}

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        transactions = transactions.filter(transaction => transaction.id !== id);
        saveTransactions();
        updateBalance();
        renderTransactions();
    }
}

// Edit transaction
function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const newDescription = prompt('Enter new description:', transaction.description);
    const newAmount = prompt('Enter new amount:', transaction.amount);
    const newDate = prompt('Enter new date (YYYY-MM-DD):', transaction.date);

    if (newDescription && !isNaN(newAmount) && newDate) {
        transaction.description = newDescription;
        transaction.amount = parseFloat(newAmount);
        transaction.date = newDate;

        saveTransactions();
        updateBalance();
        renderTransactions();
    }
}

// Update balance
function updateBalance() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
    balanceElement.textContent = `$${balance.toFixed(2)}`;
    balanceElement.style.color = balance >= 0 ? '#2ecc71' : '#e74c3c';
}

// Render transactions
function renderTransactions() {
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-transactions">No transactions yet</p>';
        return;
    }

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';
        
        const formattedDate = new Date(transaction.date).toLocaleDateString();
        const formattedAmount = transaction.amount.toFixed(2);
        const amountClass = transaction.amount >= 0 ? 'amount-positive' : 'amount-negative';

        transactionElement.innerHTML = `
            <div class="transaction-info">
                <strong>${transaction.description}</strong>
                <div>${formattedDate}</div>
            </div>
            <span class="transaction-amount ${amountClass}">
                ${transaction.amount >= 0 ? '+' : ''}$${formattedAmount}
            </span>
            <div class="transaction-actions">
                <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </div>
        `;

        transactionsList.appendChild(transactionElement);
    });
}

// Save transactions to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event Listeners
expenseForm.addEventListener('submit', addTransaction);

// Initialize the app
init(); 