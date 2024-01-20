const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message:
      "For all places try 'http://localhost:3000/api/bg-explorer/photos'",
  });
});

router.get("/404", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Invalid url!",
  });
});

module.exports = router;
