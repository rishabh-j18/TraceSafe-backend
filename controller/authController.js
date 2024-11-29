const User = require("../model/UserSchema");
const MissingPerson = require("../model/missingPersonSchema");
const Location = require("../model/locationSchema");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const uploadToCloudinary = require("./cloudinaryFiles");
const ethers = require("ethers");

// register or signup
const registerUser = async (req, res) => {
  try {
    const { name, username, email, mobile, account, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    console.log(req.body);

    const newUser = new User({
      name,
      username,
      email,
      mobile,
      account,
      password,
    });
    await newUser.save();

    const token = await newUser.generateAuthToken();
    res.status(200).json({ newUser, token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const loginUserMeta = async (req, res) => {
  try {
    const { account } = req.body;

    const user = await User.findOne({ account });
    if (!user) {
      return res.status(400).json({ message: "Wallet Mismatch" });
    }

    const token = await user.generateAuthToken();
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getUserProfile
const getUserProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

async function storeReportOnBlockchain(blockchainData) {
  const provider = new ethers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/079a8f73494a4ef3b0df149d40815323"
  );

  // Private key for using wallet to submit gas price while writing on gas
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Private key not found. Please add it to your .env file.");
  } 

  // Create a wallet and connect it to the provider
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Wallet address:", wallet.address);
  // Smart contract configuration
  const contractAddress = "0x186a075e3639d0826430bc730774cb725b863d5e";
  console.log("Contract address:", contractAddress);

  const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "reportId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "reporter",
          type: "address",
        },
      ],
      name: "NewReport",
      type: "event",
    },
    {
      inputs: [],
      name: "getTotalReports",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_reportId",
          type: "uint256",
        },
      ],
      name: "getReport",
      outputs: [
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          internalType: "address",
          name: "reporter",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "_lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "_photoUrl",
          type: "string",
        },
      ],
      name: "submitReport",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "reports",
      outputs: [
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          internalType: "address",
          name: "reporter",
          type: "address",
        },
        {
          internalType: "bool",
          name: "exists",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "reportCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const contract = new ethers.Contract(contractAddress, contractABI, wallet);

  console.log("Blockchain data:", blockchainData);
  try {
    // Call the submitReport function
    const txResponse = await contract.submitReport(
      blockchainData.fullName,
      blockchainData.lastSeenDate,
      blockchainData.lastSeenLocation,
      blockchainData.photo || "No Image Provided"
    );

    // Wait for transaction to be mined
    const receipt = await txResponse.wait();

    // Extract reportCount from the function's return value
    const reportCount = receipt.events[0].args[0].toNumber(); // Assuming NewReport emits the reportCount as the first argument

    console.log("Report Count :", reportCount);
    console.log("Receipt :",receipt);
    console.log("Receipt event :",receipt.events[0]);
    console.log("Event args",receipt.events[0].args[0]);

    return { transactionHash: receipt.transactionHash, reportCount };
  } catch (error) {
    console.error("Error submitting report to blockchain:", error.message);
    throw new Error("Blockchain transaction failed");
  }
}

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
    if (req.files?.photo?.[0]) {
      const photoResult = await uploadToCloudinary(
        req.files.photo[0].buffer,
        `missingReports/${fullName}-${Date.now()}`
      );
      reportData.photo = photoResult.secure_url;
    }

    // Prepare minimal blockchain data
    const blockchainData = {
      fullName,
      lastSeenDate,
      lastSeenLocation,
      photo: reportData.photo,
    };
    console.log("blockchain data in main :", blockchainData);

    // Store all details in MongoDB
    const detailedReportData = {
      ...req.body,
      photo: photo,
    };
    // Create a new missing person report and save to the database
    const newReport = new MissingPerson(detailedReportData);
    await newReport.save();

    // Call function to store minimal data on blockchain
    const blockchainId = await storeReportOnBlockchain(blockchainData);

    // Save the blockchain ID to the MongoDB entry
    newReport.blockchainRecord.transactionId = blockchainId;
    newReport.blockchainRecord.timestamp = new Date.now();

    await newReport.save();

    // Respond with success
    res
      .status(200)
      .json({ message: "Report submitted successfully!", newReport });
  } catch (error) {
    console.error("Error submitting report:", error.message);
    res.status(500).json({ message: "Error submitting report", error });
  }
};

const getMissingPerson = async (req, res) => {
  try {
    const data = await MissingPerson.find();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching details", error);
    res.status(500).json({ error: "Failed to fetch users" });
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
      typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
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
          const { secure_url } = await uploadToCloudinary(
            file.buffer,
            `photos/${location}-${Date.now()}`
          );
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

module.exports = {
  registerUser,
  loginUser,
  loginUserMeta,
  updateUserProfile,
  getUserProfile,
  submitMissingPersonReport,
  getMissingPerson,
  flagMissing,
};
