const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // Check if PRIVATE_KEY is set
    if (!process.env.PRIVATE_KEY) {
        res.status(500).send('Error: PRIVATE_KEY environment variable is required');
        return;
    }

    const privateKey = process.env.PRIVATE_KEY;
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Environment Variable Display</title>
        </head>
        <body>
            <h1>Environment Variable Display</h1>
            <p>PRIVATE_KEY: ${privateKey}</p>
        </body>
        </html>
    `);
});

const PORT = 8080;
app.listen(PORT, () => {
    if (!process.env.PRIVATE_KEY) {
        console.error('Warning: PRIVATE_KEY environment variable is not set');
    }
    console.log(`Server running on port ${PORT}`);
});