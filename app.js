const express = require("express");
const app = express();

app.use(express.static(__dirname));

app.get("\ ", (req, res) => {
  res.sendFile(__dirname + '\index.html');
});

app.listen(3000, '127.0.0.1', () => {
  console.log("Server is running on port 3000");
});

