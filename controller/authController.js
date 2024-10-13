const User=require('../model/UserSchema');
const bcrypt=require('bcryptjs');
const uploadToCloudinary=require('./cloudinaryFiles');


// register or signup
const registerUser=async(req,res)=> {
    try {
      const { name, username, email, mobile, password } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
      console.log(req.body);
  
      const newUser = new User({ name, username, email, mobile, password });
      await newUser.save();
  
      const token = await newUser.generateAuthToken();
      res.status(200).json({ newUser, token });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  // login
  const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid username' });
      }
  
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = await user.generateAuthToken();
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  //update userProfile
  const updateUserProfile = async (req, res) => {
    try {
      const { email, aadhar, occupation, address } = req.body;
      const userId = email; // Assuming email identifies the user
  
      const updatedData = { aadhar, occupation, address };
  
      // Handle profile photo upload
      if (req.files?.profilePhoto?.[0]) {
        const profilePhotoUrl = await uploadToCloudinary(
          req.files.profilePhoto[0].buffer,
          `profilePhotos/${userId}`
        );
        updatedData.profilePhoto = profilePhotoUrl.secure_url;
      }
  
      // Handle cover photo upload
      if (req.files?.coverPhoto?.[0]) {
        const coverPhotoUrl = await uploadToCloudinary(
          req.files.coverPhoto[0].buffer,
          `coverPhotos/${userId}`
        );
        updatedData.coverPhoto = coverPhotoUrl.secure_url;
      }
  
      // Update user in database
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { $set: updatedData },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
      console.error('Error updating user profile:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
 
  
//getUserProfile 
  const getUserProfile = async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        email: user.email,
        aadhar: user.aadhar,
        occupation: user.occupation,
        address: user.address,
        profilePhoto: user.profilePhoto,
        coverPhoto: user.coverPhoto,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  module.exports={registerUser, loginUser, updateUserProfile, getUserProfile};