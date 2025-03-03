const express = require('express');
const script = require("./prompt.js");
const app = express();
const PORT = 3000;

app.post('/prompt', (req, res) => {
   try {
      const message = req.body.message;
      const privateKey = req.body?.privateKey;
      res.send(script.prompt(message));
      res.send(script.prompt());
   } catch (error) {
      // res.send(error?.message);
      // console.error('Error:', error);

      // return error message code 500
      res.status(500).send(error?.message);
   }
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});