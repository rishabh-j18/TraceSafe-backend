const User=require('../model/UserSchema');
const MissingPerson=require('../model/missingPersonSchema')
const Location = require('../model/locationSchema')
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

  const submitMissingPersonReport = async (req, res) => {
    try {
      const {
        fullName,
        nickname,
        dateOfBirth,
        aadhar,
        gender,
        photo,
        height,
        weight,
        eyeColor,
        hairColor,
        distinguishingFeatures,
        lastSeenDate,
        lastSeenLocation,
        clothingDescription,
        circumstances,
        reporterName,
        relationship,
        phoneNumber,
        email,
        reward,
        medicalConditions,
        languagesSpoken,
        otherInfo,
      } = req.body;
  
      // Prepare report data with the fields from the request body
      const reportData = {
        fullName,
        nickname,
        dateOfBirth,
        aadhar,
        gender,
        photo,
        height,
        weight,
        eyeColor,
        hairColor,
        distinguishingFeatures,
        lastSeenDate,
        lastSeenLocation,
        clothingDescription,
        circumstances,
        reporterName,
        relationship,
        phoneNumber,
        email,
        reward,
        medicalConditions,
        languagesSpoken,
        otherInfo,
      };
  
      // If photo is provided, upload to Cloudinary
      if (req.file?.photo?.[0]) {
        const photoResult = await uploadToCloudinary(
          req.file.buffer, 
          `missingReports/${fullName}-${Date.now()}`
        );
        reportData.photo = photoResult.secure_url;
      }
  
      // Create a new missing person report and save to the database
      const newReport = new MissingPerson(reportData);
      await newReport.save();
  
      // Respond with success
      res.status(200).json({ message: "Report submitted successfully!", newReport });
    } catch (error) {
      console.error("Error submitting report:", error.message);
      res.status(500).json({ message: "Error submitting report", error });
    }
  };
  
  const getMissingPerson = async(req,res) =>{
   try{
    const data= await MissingPerson.find();

    res.status(200).json(data);
    
   }
   catch(error)
   {
    console.error('Error fetching details', error);
    res.status(500).json({error:'Failed to fetch users'});
   }
  };

  const flagMissing = async (req, res) => {
    try {
      // Extract form data from request body
      const {
        location,
        coordinates,
        dateTime,
        description,
        reporterName,
        contactInfo,
        witnessName,
        witnessContact,
        additionalNotes,
      } = req.body;
      const parsedCoordinates = 
  typeof coordinates === 'string' ? JSON.parse(coordinates) : coordinates;
      const locationData = {
        location,
        coordinates: parsedCoordinates, // Ensure coordinates are parsed correctly
        dateTime,
        description,
        reporterName,
        contactInfo,
        witnessName,
        witnessContact,
        additionalNotes,
      };
  
      // Upload photos to Cloudinary (if any)
      if (req.files?.photos?.length > 0) {
        const photoUrls = await Promise.all(
          req.files.photos.map(async (file) => {
            const { secure_url } = await uploadToCloudinary(file.buffer, `photos/${location}-${Date.now()}`);
            return secure_url;
          })
        );
        locationData.photos = photoUrls;
      }
  
      // Upload video to Cloudinary (if any)
      if (req.files?.video?.[0]) {
        const { secure_url } = await uploadToCloudinary(
          req.files.video[0].buffer,
          `videos/${location}-${Date.now()}`
        );
        locationData.video = secure_url;
      }
     console.log(locationData);
      // Save the new location data to the database
      const newLocation = new Location(locationData);
      await newLocation.save();
  
      // Respond with success
      res.status(200).json({ message: "Submitted successfully!", newLocation });
    } catch (error) {
      console.error("Error submitting flag:", error);
      res.status(500).json({
        message: "Error submitting report",
        error: error.message || "Internal Server Error",
      });
    }
  };
  
  module.exports={registerUser, loginUser, updateUserProfile, getUserProfile, submitMissingPersonReport,getMissingPerson, flagMissing};