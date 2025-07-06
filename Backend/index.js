const express = require("express");
const { connection } = require("./Database/db.js");
const{login ,register} = require("./controller/userController.js");

const app = express();

const PORT = 6000;

connection()
app.use(express.json());
app.post("/register", register);
app.post("/login", login);


app.listen(PORT, () => {
  console.log(`Server ruuning port ${PORT}`);
});
