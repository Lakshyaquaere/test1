function validateUsername() {
    
    const usernameInput = document.getElementById("username");
    
    const username = usernameInput.value.trim();

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/; 

    // Check if the username matches the pattern
    if (!usernamePattern.test(username)) {
        // If the username is invalid, display an error message
        document.getElementById("username-error").textContent = "Invalid username format.";
        usernameInput.focus(); // Put the focus back on the username input
        return false;
    } else {
        // If the username is valid, clear any previous error message
        document.getElementById("username-error").textContent = "";
        return true;
    }
}