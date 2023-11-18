const router = require("express").Router();
const globalController = require("./_controllers/globalController");
const photoController = require("./_controllers/photoController");
const userController = require("./_controllers/userController");

router.use(globalController);
router.use("/photos", photoController);
router.use("/users", userController);

module.exports = router;
