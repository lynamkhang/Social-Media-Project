import bcrypt from 'bcrypt'
import User from '../models/User.js';

export const signUp = async (req, res) => {
    try {
        const {username, email, password, fullName} = req.body;

        if(!username || !email || !password || !fullName) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const existingUser = await User.findOne({
            or: [{email}, {username}]
        });

        if (existingUser) {
            return res.status(409).json({
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already takem'
            })
        }

        //Password hasing
        const passwordHash = await bcrypt.hash(password, 10);

        //Create new user
        await User.create({
            username,
            email,
            passwordHash,
            fullName,
        });

        //return
        return res.sendStatus(204);

    } catch (error) {
        console.error("Error when calling SignUp", error);
        return res.status.json({message: "System error"});
    }

};