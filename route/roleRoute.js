const roleController = require("../controller/roleController");
const {
  authMiddleware,
  checkPermission,
} = require("../middleware/authmiddleware");

// router
const router = require("express").Router();

// role route
router.get("/allpermission", authMiddleware, roleController.getAllpermission);
router.post(
  "/",
  authMiddleware,
  checkPermission(["501"]),
  roleController.addRole
);
router.get("/", authMiddleware, roleController.getRole);

// router.get("/", authMiddleware, roleController.getRole);
module.exports = router;
