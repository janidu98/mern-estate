import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';

const signup = async(req, res, next) => {
    const { username, password, email } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    
    try {
        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
}

export default signup