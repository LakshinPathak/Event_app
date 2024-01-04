document.addEventListener("DOMContentLoaded", function () {
  // Get form element and attach a submit event listener
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit",async  function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the values from the input fields
    const username = document.getElementById("fusername").value;
    const email = document.getElementById("femail").value;
    const password = document.getElementById("fpass").value;
    console.log(username);
    console.log(email);
    console.log(password);
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
        console.log(sessionStorage.getItem("loggedInUser"));
      //  window.location.href = `dashboard.html`;

        window.location.href = `dashboard.html?script2=true&ffusername=${username}&femail=${email}&fpassword=${password}`;
        //window.location.reload(true);
        
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

    // Redirect to abc.html with query parameters
    
  // // `/dashboard.html?script1=true&eventName=${eventName}&eventDate=${eventDate}&eventDetails=${eventDetails}`;
  });
});
