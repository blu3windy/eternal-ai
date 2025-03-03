const express = require('express');
const script = require("./prompt.js");
const app = express();
const PORT = 3000;

app.post('/prompt', (req, res) => {
    try {
        res.send(script.prompt());
    } catch (error) {
        res.send(error?.message);
        console.error('Error:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});