import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFHESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 days

export const signUp = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingUser = await User.findOne({
      or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          existingUser.email === email
            ? "Email already registered"
            : "Username already takem",
      });
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
    console.error("Error when calling signUp", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const signIn = async (req, res) => {
  try {
    //Get user input
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    //Get passworHash to compare with password - check both username and email
    const user = await User.findOne({
      $or: [
        { username: identifier.toLowerCase() },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Username/email or password is incorrect",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "username or password is incorrect",
      });
    }

    //If correct, create accessToken with JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //Create refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    //Create new session to store refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFHESH_TOKEN_TTL),
    });

    //return refresh token to cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFHESH_TOKEN_TTL,
    });

    //return access token to res
    return res
      .status(200)
      .json({ message: `User ${user.username} has logged in!`, accessToken });
  } catch (error) {
    console.error("Error when calling signIn", error);
    return res.status(500).json({ message: "System error" });
  }
};

export const signOut = async (req, res) => {
  try {
    //Get refresh token from cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      //Delete refresh token from session
      await Session.deleteOne({ refreshToken: token });

      //Delete refresh token from cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(204);
  } catch (error) {
    console.error("Error when calling signIn", error);
    return res.status(500).json({ message: "System error" });
  }
};

//Create access token using refresh token
export const refreshToken = async (req, res) => {
  try {
    //Get refresh token from cookie
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    //Compare with token in session
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    //Check if token is expired
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Refresh token has expired" });
    }
    //Create new access token
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    //Return access token
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Error when calling refreshToken", error);
    return res.status(500).json({ message: "System error" });
  }
};
