const express = require('express');
const app = express();
const PORT = 3000;
const libs = require("./libs/prompt.js");

app.get('/prompt', (req, res) => {
   try {
      return "hihi";
      //
      // libs.prompt('').then((address) => {
      //    console.log('Address:', address);
      // });

      // const address = script.prompt('0x6b9251ca691f827e4c8cf3f4658c5493fa95fe256de3ee071c53f88cf41d7ea6');
      // console.log('Address:', address);

      // run command: node bundle.umd.mjs
      // Output: Address: 0x6b9251CA691f827E4C8cF3f4658C5493fa95fe25
   } catch (error) {
      console.error('Error:', error);
   }
   res.send('Hello, Express!');
});

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});