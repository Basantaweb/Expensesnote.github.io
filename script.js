document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todoForm');
    const todoTableBody = document.querySelector('#todoTable tbody');
    const expenseForm = document.getElementById('expenseForm');
    const expenseTableBody = document.querySelector('#expenseTable tbody');
    const expenseTotalAmount = document.getElementById('expenseTotalAmount');

    const sendDataButton = document.getElementById('sendDataButton');
    const sendWhatsAppButton = document.getElementById('sendWhatsAppButton');

    const categories = ['vegetables', 'sweets', 'grocery', 'travel', 'bus', 'petrol', 'train', 'other'];
    const expenseCategorySelect = document.getElementById('expense-category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        expenseCategorySelect.appendChild(option);
    });

    let todos = [];
    let expenses = [];

    // Helper Functions
    function clearForm(form) {
        form.reset();
    }

    function generateDateInput() {
        const now = new Date();
        return now.toISOString().substring(0, 16);
    }

    window.onload = document.getElementById('todoDate').value = generateDateInput();
    window.onload = document.getElementById('expenseDate').value = generateDateInput();

    // Enable Date Editing Checkboxes
    document.getElementById('enableTodoDate').addEventListener('change', function () {
        document.getElementById('todoDate').disabled = !this.checked;
        if (!this.checked) {
            document.getElementById('todoDate').value = generateDateInput();
        }
    });

    document.getElementById('enableExpenseDate').addEventListener('change', function () {
        document.getElementById('expenseDate').disabled = !this.checked;
        if (!this.checked) {
            document.getElementById('expenseDate').value = generateDateInput();
        }
    });
    

    // Create and Read (Expense)
    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const expenseDescription = document.getElementById('expenseInput').value;
        const expenseAmount = parseFloat(document.getElementById('expenseAmount').value);
        const expenseCategory = document.getElementById('expense-category').value;
        const expenseDate = document.getElementById('expenseDate').value || generateDateInput();

        const newExpense = { id: Date.now(), description: expenseDescription, amount: expenseAmount, category: expenseCategory, date: expenseDate };
        expenses.push(newExpense);

        renderExpenses();
        clearForm(expenseForm);
    });

    function renderExpenses() {
        expenseTableBody.innerHTML = '';
        expenses.forEach((expense, index) => {
            const row = document.createElement('tr');
            row.setAttribute('draggable', true);
            row.innerHTML = `
                <td>${index + 1}</td> <!-- Serial Number -->
                <td>${expense.description}</td>
                <td>₹${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="btn-edit" data-id="${expense.id}">Edit</button>
                    <button class="btn-delete" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseTableBody.appendChild(row);

            addDragEventListeners(row);
        });

        // Update the total in the table footer
        updateTotalAmount();
    }

    // Calculate Total Expense Amount
    function calculateTotalAmount() {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    // Update the total amount in the footer
    function updateTotalAmount() {
        const totalAmount = calculateTotalAmount();
        expenseTotalAmount.textContent = `₹${totalAmount.toFixed(2)}`;
    }

    // Update and Delete (Expense)
    expenseTableBody.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-edit')) {
            const id = e.target.getAttribute('data-id');
            const expense = expenses.find(expense => expense.id === parseInt(id));

            document.getElementById('expenseInput').value = expense.description;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expense-category').value = expense.category;
            document.getElementById('expenseDate').value = expense.date;
            expenses = expenses.filter(expense => expense.id !== parseInt(id)); // Remove old entry
            renderExpenses(); // Re-render list
        }

        if (e.target.classList.contains('btn-delete')) {
            const id = e.target.getAttribute('data-id');
            expenses = expenses.filter(expense => expense.id !== parseInt(id)); // Remove selected expense
            renderExpenses(); // Re-render list
        }
    });

    // Drag-and-Drop Implementation
    let draggedRow = null;

    function addDragEventListeners(row) {
        row.addEventListener('dragstart', function (e) {
            draggedRow = row;
            e.dataTransfer.effectAllowed = 'move';
        });

        row.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        row.addEventListener('drop', function (e) {
            e.preventDefault();
            if (draggedRow !== this) {
                const allRows = [...expenseTableBody.querySelectorAll('tr')];
                const draggedIndex = allRows.indexOf(draggedRow);
                const targetIndex = allRows.indexOf(this);

                // Reorder expenses array
                const movedExpense = expenses.splice(draggedIndex, 1)[0];
                expenses.splice(targetIndex, 0, movedExpense);

                renderExpenses(); // Re-render the table
            }
        });

        row.addEventListener('dragend', function () {
            draggedRow = null;
        });
    }

    // Update the serial numbers in the first column
    function updateSerialNumbers() {
        const rows = expenseTableBody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('td:first-child').textContent = index + 1;
        });
    }

    // Send Data to API (CRUD)
    sendDataButton.addEventListener('click', async function () {
        try {
            // Example: Sending Todos and Expenses Data to API
            const totalAmount = calculateTotalAmount();
            const data = { todos, expenses, totalAmount };

            // Check if both todos and expenses arrays are empty
            if (todos.length === 0 && expenses.length === 0) {
                Swal.fire('Error', 'No data to send. Please add Todos or Expenses.', 'error');
                return;
            }

            console.log(data);
            const response = await fetch('https://example.com/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Swal.fire('Success', 'Data sent to API successfully!', 'success');
            } else {
                throw new Error('Failed to send data to API');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });

    // Send Data to WhatsApp
    sendWhatsAppButton.addEventListener('click', function () {
        const totalAmount = calculateTotalAmount();
        const message = `Todos:\n${todos.map(todo => `${todo.text}`).join('\n')}\n\nExpenses:\n${expenses.map(expense => `${expense.description}, ₹${expense.amount.toFixed(2)}, ${expense.category}`).join('\n')}\n\nTotal Amount: ₹${totalAmount.toFixed(2)}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    window.showTab = function (tabName) {
        const tabs = document.getElementsByClassName('tab-content');
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].style.display = 'none';
        }
        document.getElementById(tabName).style.display = 'block';
        sendDataButton.style.display = 'block';
        sendWhatsAppButton.style.display = 'block';
    };

    function showMainPage() {
        loginPage.style.display = 'none';
        mainPage.style.display = 'block';
    }

    function showLoginPage() {
        loginPage.style.display = 'block';
        mainPage.style.display = 'none';
    }

    // Handle Login Logic with SweetAlert
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://example.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('authToken', data.token);
                Swal.fire('Success', 'Login successful!', 'success').then(() => {
                    showMainPage();
                });
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    });

  const authToken = localStorage.getItem('authToken');
  //if (authToken) {
      showMainPage();
//   } else {
//       showLoginPage();
//   }
});
