const express = require('express');
const script = require("./prompt.js");
const app = express();
const PORT = 80;

app.post('/prompt', async (req, res) => {
   try {
      const messages = req.body?.messages;
      const privateKey = req.body?.privateKey;
      const chainId = req.body?.chainId;
      const params = {
         messages,
         privateKey,
         chainId,
      }
      const responseMessage = await script.prompt();
      res.send(responseMessage);
   } catch (error) {
      // res.send(error?.message);
      // console.error('Error:', error);
      // return error message code 500
      res.status(500).send(error?.message);
   }
});

app.get('/', async (req, res) => {
   res.send('Hello World');
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});