document.addEventListener('DOMContentLoaded', function () {
  const todoForm = document.getElementById('todoForm');
  const todoTableBody = document.querySelector('#todoTable tbody');
  const expenseForm = document.getElementById('expenseForm');
  const expenseTableBody = document.querySelector('#expenseTable tbody');

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

  // Create and Read (Todo)
  todoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const todoText = document.getElementById('todoInput').value;
      const todoDate = document.getElementById('todoDate').value || generateDateInput();

      const newTodo = { id: Date.now(), text: todoText, date: todoDate };
      todos.push(newTodo);

      renderTodos();
      clearForm(todoForm);
  });

  function renderTodos() {
      todoTableBody.innerHTML = '';
      todos.forEach(todo => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${todo.text}</td>
              <td>${todo.date}</td>
              <td>
                  <button class="btn-edit" data-id="${todo.id}">Edit</button>
                  <button class="btn-delete" data-id="${todo.id}">Delete</button>
              </td>
          `;
          todoTableBody.appendChild(row);
      });
  }

  // Create and Read (Expense)
  expenseForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const expenseDescription = document.getElementById('expenseInput').value;
      const expenseAmount = document.getElementById('expenseAmount').value;
      const expenseCategory = document.getElementById('expense-category').value;
      const expenseDate = document.getElementById('expenseDate').value || generateDateInput();

      const newExpense = { id: Date.now(), description: expenseDescription, amount: expenseAmount, category: expenseCategory, date: expenseDate };
      expenses.push(newExpense);

      renderExpenses();
      clearForm(expenseForm);
  });

  function renderExpenses() {
      expenseTableBody.innerHTML = '';
      expenses.forEach(expense => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${expense.description}</td>
              <td>${expense.amount}</td>
              <td>${expense.category}</td>
              <td>${expense.date}</td>
              <td>
                  <button class="btn-edit" data-id="${expense.id}">Edit</button>
                  <button class="btn-delete" data-id="${expense.id}">Delete</button>
              </td>
          `;
          expenseTableBody.appendChild(row);
      });
  }

  // Update and Delete (Todo)
  todoTableBody.addEventListener('click', function (e) {
      if (e.target.classList.contains('btn-edit')) {
          const id = e.target.getAttribute('data-id');
          const todo = todos.find(todo => todo.id === parseInt(id));

          document.getElementById('todoInput').value = todo.text;
          document.getElementById('todoDate').value = todo.date;
          todos = todos.filter(todo => todo.id !== parseInt(id)); // Remove old entry
          renderTodos(); // Re-render list
      }

      if (e.target.classList.contains('btn-delete')) {
          const id = e.target.getAttribute('data-id');
          todos = todos.filter(todo => todo.id !== parseInt(id)); // Remove selected todo
          renderTodos(); // Re-render list
      }
  });

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

  // Send Data to API (CRUD)
  sendDataButton.addEventListener('click', async function () {
    try {
        // Example: Sending Todos and Expenses Data to API
        const data = { todos, expenses };

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
      const message = `Todos:\n${todos.map(todo => `${todo.text} - ${todo.date}`).join('\n')}\n\nExpenses:\n${expenses.map(expense => `${expense.description}, $${expense.amount}, ${expense.category} - ${expense.date}`).join('\n')}`;
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

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
          const response = await fetch('https://example.com/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });

          if (!response.ok) {
              throw new Error('Login failed');
          }

          const result = await response.json();
          if (result.token) {
              localStorage.setItem('authToken', result.token);
              Swal.fire('Success', 'Logged in successfully!', 'success').then(() => {
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
  // } else {
  //     showLoginPage();
  // }
});
