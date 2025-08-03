const express = require("express");
const { getUser } = require("../controllers/users");

const router = express.Router();

router.get("/:id", getUser);

module.exports = router;
