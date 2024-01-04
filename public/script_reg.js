document.addEventListener('DOMContentLoaded', function () {
const registerButton = document.getElementById('reg_id');

registerButton.addEventListener('click', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username_reg').value; // Assuming you want to use the same IDs for registration
    const email = document.getElementById('email_reg').value; // Assuming you want to use the same IDs for registration
    const password = document.getElementById('password_reg').value; // Assuming you want to use the same IDs for registration

    // Basic form validation
    if (!username || !email || !password) {
      console.error('Username, email, and password are required for registration');
      return;
    }

    try {
      // Perform AJAX request to the server register endpoint
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      console.log('Response from server:', result);

      // Handle success or error response from the server
      if (result.success) {
        console.log('Registration successful!');
        alert(result.message);

        // Automatically log in after successful registration
        // You can customize this behavior based on your requirements
        sessionStorage.setItem('loggedInUser', username);
        window.location.href = '/dashboard.html';
        window.location.reload(true);
         // Redirect to the dashboard
      } else {
        // Registration failed, display an error message or take appropriate action
        console.error('Registration failed:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle errors here
      alert('An unexpected error occurred. Please try again later.');
    }
    
  });



});