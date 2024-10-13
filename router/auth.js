const express = require("express");
const router = new express.Router();
const { registerUser, loginUser,updateUserProfile, getUserProfile } = require("../controller/authController");
const multer=require('multer');


const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post(
  '/update-profile', upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 },
  ]), updateUserProfile);

router.post("/register", registerUser);

router.post("/login", loginUser);

// Define the route to get user profile
router.get('/profile/:email', getUserProfile);

module.exports = router;
