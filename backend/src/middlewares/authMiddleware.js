import jwt from "jsonwebtoken";
import User from "../models/User.js";

//authorization
export const protectedRoute = (req, res, next) => {
  try {
    //Get token from header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token not found" });
    }

    //Confirm valid token
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);

          return res
            .status(403)
            .json({ message: "Access token expired or incorrect" });
        }

        //Find user
        const user = await User.findById(decodedUser.userId).select(
          "-passwordHash"
        );

        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        //Return user to req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Error when JWT authorize in authMiddleware", error);
    return res.status(500).json({ message: "System error" });
  }
};
