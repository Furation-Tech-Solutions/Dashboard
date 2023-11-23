const userController = require("../controller/userController");
const {
  authMiddleware,
  checkPermission,
} = require("../middleware/authmiddleware");

// router
const router = require("express").Router();

// user router
router.post(
  "/",
  authMiddleware,
  checkPermission(["101"]),
  userController.addUser
);

router.post("/login", userController.login);
router.get(
  "/",
  authMiddleware,
  checkPermission(["401"]),
  userController.getUser
);

router.get("/getbyid", authMiddleware, userController.getUserById);

router.put(
  "/:id",
  authMiddleware,
  checkPermission(["301"]),
  userController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["201"]),
  userController.deleteUser
);

router.post("/forgetPassword", userController.forgetPassword);

router.post("/reset-password", userController.resetPassword);

module.exports = router;
