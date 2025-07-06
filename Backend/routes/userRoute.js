const express = require("express");
const { getAllEmployee
} = require("../controller/userController");

const router = express.Router();

router.post("/users", getAllEmployee);

module.exports = {router}