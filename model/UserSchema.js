const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Define the user schema
const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  username: { type: String, trim: true, required: true, unique: true },
  email: { type: String, required: true, trim: true },
  mobile: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'legalman'], default: 'user' },
  
  // New Fields
  aadhar: { type: String, required: true, default: ''},
  occupation: { type: String },
  address: { type: String },
  profilePhoto: { type: String, default:'' }, // Store base64 string or URL
  coverPhoto: { type: String,default:'' },   // Store base64 string or URL

  tokens: [{ token: { type: String, required: true } }],
}, { timestamps: true });

// Middleware for hashing the password before saving the user
UserSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Method to generate JWT token
UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  // Create a token using the user's id and a secret key
  const token = jwt.sign({ _id: user._id.toString(), role: user.role }, process.env.SECRET_KEY, {
    expiresIn: '1h', // Optional: set token expiration time
  });

  // Save the token in the user's tokens array
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// login
UserSchema.statics.findByCredentials = async (username,password)=>{
    const user = await User.findOne({username});

    if (!user)
    {
        throw new Error("Unable to login, user not found")

    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)
    {
        throw new Error("Unable to login, wrong password.");
    }

    return user;
};

// Export the model
const User = mongoose.model('User', UserSchema);

module.exports = User;

