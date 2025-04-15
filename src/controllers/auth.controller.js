import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      if (!email || !password || !fullName) {
        return res.status(400).json({ message: 'Please fill all fields' });
      }
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
      
      const user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      
      // Create new user (this automatically saves to DB)
      const newUser = await User.create({
        email,
        password: hashedPassword,
        fullName
      })
      
      if (newUser) {
        generateToken(newUser._id, res)
        // Remove this second save which could be overwriting data
        // await newUser.save()  
        return res.status(201).json({ message: 'User created successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid User Data' });
      }
    } catch (error) {
      console.log('Error in signup controller', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
export const login=async(req, res) => {
    const {email, password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
        const user=await User.findOne({email})
        if (!user) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        const isMatch=await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({message: 'Invalid credentials'});
        }
        generateToken(user._id,res)
        return res.status(200).json({message: 'Login successful'});
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({message: 'Internal server error'});
    }
    try {
        
    } catch (error) {
        
    }
}
export const logout=(req, res) => { 
    try {
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message: 'Logout successful'});
    } catch (error) {
        console.log('Error in logout controller', error.message);
        res.status(500).json({message: 'Internal server error'});
    }
}

export const updateProfile=async (req, res) => {
    try {
        const {profilePic}=req.body
        const userId=req.user._id
        if (!profilePic) {
            return res.status(400).json({message: 'Please fill all fields'});
        }
       const uploadResponse= await cloudinary.uploader.upload(profilePic)
       const updatedUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
       res.status(200).json(updatedUser)
    } catch (error) {
        console.log(error)
    }
}

export const checkAuth=(req,res)=>{
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log('Error in checkAuth controller',error.message)
        res.status(500).json({message:'Internal Server Error'})
    }
}