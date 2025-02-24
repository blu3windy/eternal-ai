self.onmessage = function (event) {
  try {
    const { code } = event.data; // Get JavaScript code from message
    const executeFunction = new Function(code); // Convert string to function
    const result = executeFunction(); // Execute function
    self.postMessage({ result }); // Send result back
  } catch (error) {
    self.postMessage({ error: error.message }); // Send error back
  }
};
