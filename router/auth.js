const express = require("express");
const router = new express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  submitMissingPersonReport,
} = require("../controller/authController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route to save a new report
router.post("/report-missing", 
  upload.fields([{name:"photo",maxCount:1}]), 
  submitMissingPersonReport);

router.post(
  "/update-profile",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  updateUserProfile
);

router.post("/register", registerUser);

router.post("/login", loginUser);

// Define the route to get user profile
router.get("/profile/:email", getUserProfile);

module.exports = router;
