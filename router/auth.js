const express = require("express");
const router = new express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserProfile,
  submitMissingPersonReport,
  getMissingPerson,
  flagMissing,
} = require("../controller/authController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

//save location found of a user
router.post('/flag-missing', 
  upload.fields([
    {name:'photo'},
    {name:'video',maxCount:1},
  ]),
flagMissing);

// POST route to save a new missing report
router.post("/report-missing", 
  upload.fields([{name:"photo",maxCount:1}]), 
  submitMissingPersonReport);

// update user profile
router.post(
  "/update-profile",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
  updateUserProfile
);

//get missing person datas
router.get("/get-missing", getMissingPerson );

//signup
router.post("/register", registerUser);

//login
router.post("/login", loginUser);

// Define the route to get user profile
router.get("/profile/:email", getUserProfile);

module.exports = router;
