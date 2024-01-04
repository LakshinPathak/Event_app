document.addEventListener('DOMContentLoaded', function () {
  // Assuming the form has an ID of 'sub_id'
  const loginForm = document.getElementById('sub_id');

  loginForm.addEventListener('click', async function (event) {
    event.preventDefault();

    // Assuming the input fields have IDs of 'login__username' and 'login__password'
    const username = document.getElementById('login__username').value;
    const password = document.getElementById('login__password').value;

    // Basic form validation
    if (!username || !password) {
      console.error('Username and password are required');
      return;
    }

    try {
      // Perform AJAX request to the server login endpoint
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Response from server:', result);

      // Handle success or error response from the server
      if (result.success) {
        console.log('Login successful!');

        // Assuming there is an input with the ID 'username'
        const loggedInUser = document.getElementById('login__username').value;

        // Store the logged-in user in sessionStorage
        sessionStorage.setItem("loggedInUser", loggedInUser);

        // Redirect to the dashboard page
        window.location.href = "/dashboard.html";
      } else {
        // Login failed, display an error message or take appropriate action
        console.error('Login failed:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
      alert('An unexpected error occurred. Please try again later.');
    }
  });
});
