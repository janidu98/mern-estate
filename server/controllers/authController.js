import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async(req, res, next) => {
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

export const signin = async(req, res, next) => {
    const { email, password } = req.body;

    try {
        //check user exists or not
        const validUser = await User.findOne({ email });
        //if not user, error
        if(!validUser) return next(errorHandler(404, 'User not found!'));

        //compare password
        const validPassword = await bcryptjs.compare(password, validUser.password);
        //if password not match, error
        if(!validPassword) return next(errorHandler(401, 'Wrong Credentials!'));

        //create token
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        const { password: pass, ...rest } = validUser._doc;
        //set the cookie using above token
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    
    } catch (error) {
        next(error);
    }
}
