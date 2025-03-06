const express = require('express');
const script = require("./prompt.js");
const app = express();
const PORT = 80;

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true })); // For form data

app.post('/prompt', async (req, res) => {
   try {
      console.log(req.body)
      const messages = req?.body?.messages || undefined;
      const privateKey = req?.body?.privateKey || undefined;
      const chainId = req?.body?.chainId || undefined;
      const params = {
         messages,
         privateKey,
         chainId,
      }
      const message = await script.prompt(params);
      res.send(message);
   } catch (error) {
      res.status(500).send(error?.message);
   }
});

app.get('/ping', async (req, res) => {
   res.status(200).send('online');
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});