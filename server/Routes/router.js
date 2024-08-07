const express = require("express");
const router = new express.Router();
const controllers = require("../Controllers/usersController");
const upload = require("../multerconfig/storageConfig");

// Routes
router.post(
  "/user/register",
  upload.single("user_profile"),
  controllers.userPost
);
// get all the users
router.get("/user/details", controllers.userGet);
// get a single user
router.get("/user/:id", controllers.getSingleUser);
// update a single user
router.put(
  "/user/edit/:id",
  upload.single("user_profile"),
  controllers.userEdit
);
// delete a single user
router.delete("/user/delete/:id", controllers.deleteUser);

router.put("/user/status/:id", controllers.userStatus);
// csv- for this first we need to install a package callled fast csv
router.get("/userexport", controllers.userExport);

module.exports = router;
