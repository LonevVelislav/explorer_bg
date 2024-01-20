const router = require("express").Router();
const globalController = require("./_controllers/globalController");
const photoController = require("./_controllers/photoController");
const userController = require("./_controllers/userController");
const commentController = require("./_controllers/commentController");

router.use(globalController);
router.use("/photos", photoController);
router.use("/users", userController);
router.use("/comments", commentController);

module.exports = router;
