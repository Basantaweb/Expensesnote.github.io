// Check if the user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html'; // Redirect to login if not logged in
    }
  });
  
  // Dummy data for todos and expenses
  let todos = [];
  let expenses = [];
  
  // Save expenses to the server
  document.getElementById('save-expenses').addEventListener('click', () => {
    const token = localStorage.getItem('token');
  
    fetch('https://example.com/api/save-expenses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expenses)
    })
      .then(response => response.json())
      .then(data => {
        alert('Expenses saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save expenses.');
      });
  });
  
  // Get expenses from the server
  document.getElementById('get-expenses').addEventListener('click', () => {
    const token = localStorage.getItem('token');
  
    fetch('https://example.com/api/get-expenses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        expenses = data;
        alert('Expenses loaded successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to load expenses.');
      });
  });
  
  // Save todos to the server
  document.getElementById('save-todos').addEventListener('click', () => {
    const token = localStorage.getItem('token');
  
    fetch('https://example.com/api/save-todos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todos)
    })
      .then(response => response.json())
      .then(data => {
        alert('Todos saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save todos.');
      });
  });
  
  // Get todos from the server
  document.getElementById('get-todos').addEventListener('click', () => {
    const token = localStorage.getItem('token');
  
    fetch('https://example.com/api/get-todos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        todos = data;
        alert('Todos loaded successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to load todos.');
      });
  });
  
  // Handle Logout
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  });
  