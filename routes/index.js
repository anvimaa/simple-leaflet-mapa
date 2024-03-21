const express = require("express");
const path = require("path");
const router = express.Router();

// Serve index.html on the root route
router.get("/", (req, res) => {
  res.render("map");
});

module.exports = router;
