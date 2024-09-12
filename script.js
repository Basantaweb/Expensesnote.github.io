let todos = [];
let expenses = [];
let total = 0;
let editingTodoId = null;
let editingExpenseId = null;

// Initialize date input with the current date
function initializeDateInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  document.getElementById('todo-date').value = dateStr;
}

initializeDateInput();

// Initialize expense date input with the current date
function initializeExpenseDateInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  document.getElementById('expense-date').value = dateStr;
}

initializeExpenseDateInput();

// Toggle date input enable/disable
function toggleDateInput() {
  const dateInput = document.getElementById('todo-date');
  const isChecked = document.getElementById('enable-date').checked;
  dateInput.disabled = !isChecked;
}

// Toggle expense date input enable/disable
function toggleExpenseDateInput() {
  const dateInput = document.getElementById('expense-date');
  const isChecked = document.getElementById('enable-expense-date').checked;
  dateInput.disabled = !isChecked;
}

// Populate category options dynamically
const categories = ['vegetables', 'sweets', 'grocery', 'travel', 'bus', 'petrol', 'train', 'other'];
const expenseCategorySelect = document.getElementById('expense-category');

categories.forEach(category => {
  const option = document.createElement('option');
  option.value = category;
  option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  expenseCategorySelect.appendChild(option);
});

// To-Do List functionality
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDateInput = document.getElementById('todo-date');
const todoSubmitBtn = document.getElementById('todo-submit-btn');
const todoList = document.getElementById('todo-list');

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const todoText = todoInput.value;
  const todoDate = todoDateInput.value;

  if (todoText) {
    if (editingTodoId === null) {
      createToDoItem(todoText, todoDate);
    } else {
      updateToDoItem(todoText, todoDate);
    }
    todoInput.value = ''; // Clear input field
    todoDateInput.value = initializeDateInput(); // Reset date input to current date
  }
});

function createToDoItem(todoText, todoDate) {
  const id = todos.length + 1;
  const todo = { id, task: todoText, date: todoDate, completed: false };
  todos.push(todo);
  renderToDoItem(todo);
}

function renderToDoItem(todo) {
  const tr = document.createElement('tr');
  tr.id = `todo-${todo.id}`;

  const tdTask = document.createElement('td');
  tdTask.textContent = todo.task;
  tdTask.setAttribute('data-label', 'Task');

  const tdDate = document.createElement('td');
  tdDate.textContent = todo.date;
  tdDate.setAttribute('data-label', 'Date');

  const tdActions = document.createElement('td');
  tdActions.setAttribute('data-label', 'Actions');

  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Update';
  updateBtn.onclick = () => {
    editingTodoId = todo.id;
    todoInput.value = todo.task;
    todoDateInput.value = todo.date;
    document.getElementById('enable-date').checked = true;
    toggleDateInput(); // Enable date input
    todoSubmitBtn.textContent = 'Update To-Do';
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteToDoItem(todo.id);

  tdActions.appendChild(updateBtn);
  tdActions.appendChild(deleteBtn);

  tr.appendChild(tdTask);
  tr.appendChild(tdDate);
  tr.appendChild(tdActions);
  todoList.appendChild(tr);
}

function updateToDoItem(newTask, newDate) {
  const todo = todos.find(t => t.id === editingTodoId);
  todo.task = newTask;
  todo.date = newDate;
  
  document.querySelector(`#todo-${editingTodoId} td[data-label="Task"]`).textContent = newTask;
  document.querySelector(`#todo-${editingTodoId} td[data-label="Date"]`).textContent = newDate;
  
  editingTodoId = null;
  document.getElementById('enable-date').checked = false; // Uncheck the checkbox
  toggleDateInput(); // Disable date input
  todoSubmitBtn.textContent = 'Add To-Do'; // Reset button text
}

function deleteToDoItem(id) {
  todos = todos.filter(t => t.id !== id);
  const tr = document.getElementById(`todo-${id}`);
  todoList.removeChild(tr);
}

// Expense functionality
const expenseForm = document.getElementById('expense-form');
const expenseItem = document.getElementById('expense-item');
const expenseAmount = document.getElementById('expense-amount');
const expenseCategory = document.getElementById('expense-category');
const expenseDateInput = document.getElementById('expense-date');
const expenseSubmitBtn = document.getElementById('expense-submit-btn');
const expenseList = document.getElementById('expense-list');
const totalExpense = document.getElementById('total-expense');

expenseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const item = expenseItem.value;
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDateInput.value;

  if (item && amount) {
    if (editingExpenseId === null) {
      createExpenseItem(item, amount, category, date);
    } else {
      updateExpenseItem(item, amount, category, date);
    }
    expenseItem.value = ''; // Clear input field
    expenseAmount.value = ''; // Clear input field
    expenseCategory.value = ''; // Clear select field
    expenseDateInput.value = initializeExpenseDateInput(); // Reset date input to current date
  }
});

function createExpenseItem(item, amount, category, date) {
  const id = expenses.length + 1;
  const expense = { id, item, amount, category, date };
  expenses.push(expense);
  renderExpenseItem(expense);
}

function renderExpenseItem(expense) {
  const tr = document.createElement('tr');
  tr.id = `expense-${expense.id}`;

  const tdItem = document.createElement('td');
  tdItem.textContent = expense.item;
  tdItem.setAttribute('data-label', 'Item');

  const tdAmount = document.createElement('td');
  tdAmount.textContent = `$${expense.amount.toFixed(2)}`;
  tdAmount.setAttribute('data-label', 'Amount');

  const tdCategory = document.createElement('td');
  tdCategory.textContent = expense.category;
  tdCategory.setAttribute('data-label', 'Category');

  const tdDate = document.createElement('td');
  tdDate.textContent = expense.date;
  tdDate.setAttribute('data-label', 'Date');

  const tdActions = document.createElement('td');
  tdActions.setAttribute('data-label', 'Actions');

  const updateBtn = document.createElement('button');
  updateBtn.textContent = 'Update';
  updateBtn.onclick = () => {
    editingExpenseId = expense.id;
    expenseItem.value = expense.item;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;
    expenseDateInput.value = expense.date;
    document.getElementById('enable-expense-date').checked = true;
    toggleExpenseDateInput(); // Enable date input
    expenseSubmitBtn.textContent = 'Update Expense';
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteExpenseItem(expense.id, expense.amount);

  tdActions.appendChild(updateBtn);
  tdActions.appendChild(deleteBtn);

  tr.appendChild(tdItem);
  tr.appendChild(tdAmount);
  tr.appendChild(tdCategory);
  tr.appendChild(tdDate);
  tr.appendChild(tdActions);
  expenseList.appendChild(tr);

  updateTotal(expense.amount);
}

function updateExpenseItem(newItem, newAmount, newCategory, newDate) {
  const expense = expenses.find(e => e.id === editingExpenseId);
  
  updateTotal(-expense.amount); // Subtract old amount
  expense.item = newItem;
  expense.amount = newAmount;
  expense.category = newCategory;
  expense.date = newDate;
  
  document.querySelector(`#expense-${editingExpenseId} td[data-label="Item"]`).textContent = newItem;
  document.querySelector(`#expense-${editingExpenseId} td[data-label="Amount"]`).textContent = `$${newAmount.toFixed(2)}`;
  document.querySelector(`#expense-${editingExpenseId} td[data-label="Category"]`).textContent = newCategory;
  document.querySelector(`#expense-${editingExpenseId} td[data-label="Date"]`).textContent = newDate;
  
  updateTotal(newAmount); // Add new amount
  
  editingExpenseId = null;
  document.getElementById('enable-expense-date').checked = false; // Uncheck the checkbox
  toggleExpenseDateInput(); // Disable date input
  expenseSubmitBtn.textContent = 'Add Expense'; // Reset button text
}

function deleteExpenseItem(id, amount) {
  expenses = expenses.filter(e => e.id !== id);
  const tr = document.getElementById(`expense-${id}`);
  expenseList.removeChild(tr);
  updateTotal(-amount);
}

function updateTotal(amount) {
  total += amount;
  totalExpense.textContent = total.toFixed(2);
}

// Export as JSON
document.getElementById('export-json').addEventListener('click', () => {
  const data = {
    todos: todos,
    expenses: expenses,
    totalExpense: total
  };

  const jsonString = JSON.stringify(data, null, 2);
  downloadJSON(jsonString, 'todo-expenses-data.json');
});

// Share JSON via WhatsApp
document.getElementById('share-json').addEventListener('click', () => {
  const data = {
    todos: todos,
    expenses: expenses,
    totalExpense: total
  };

  // Convert JSON to a text format with a limit of 1000 characters for practical sharing
  const jsonString = JSON.stringify(data, null, 2);
  const textMessage = jsonString.substring(0, 1000); // Limit the message length

  const encodedMessage = encodeURIComponent(textMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
});

// Send data to API
document.getElementById('send-api').addEventListener('click', () => {
  const data = {
    todos: todos,
    expenses: expenses,
    totalExpense: total
  };

  fetch('https://example.com/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    alert('Data sent successfully!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Failed to send data.');
  });
});

// Function to trigger download of JSON file
function downloadJSON(jsonString, filename) {
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
