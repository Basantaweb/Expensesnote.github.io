document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Dummy API endpoint for login authentication
    fetch('https://example.com/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Save login state and redirect to main page
          localStorage.setItem('token', data.token); // Assuming a token is returned
          window.location.href = 'index.html';
        } else {
          document.getElementById('login-error').style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('login-error').textContent = 'Error during login. Try again.';
        document.getElementById('login-error').style.display = 'block';
      });
  });
  