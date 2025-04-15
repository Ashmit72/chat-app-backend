import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv()

const generateToken = (userId,res) => {
    const token=jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })
    res.cookie('jwt',token,{
        maxAge:7*24*60*60*1000, // 7 days
        httpOnly:true,
        sameSite:'strict',
        secure:process.env.NODE_ENV !== 'development', // Set to true in production
    })
}

export default generateToken