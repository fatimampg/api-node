import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Helper function to check if the password (plane text) given by the user corresponds to the one stored in the db (hash)
export const comparePasswords = (password, hash) => {
  return bcrypt.compare(password, hash); // returns a promise - true or false, if those matches or not
};

export const hashPassword = (password) => {
  return bcrypt.hash(password, 5); //returns a promise [salt: 5 (can also be generated)]
};

export const createJWT = (user) => {
  // Convert an object (containing something unique about the user - id and username) into a string:
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET
  );
  return token;
};

// Middleware that will be sit in front of any route to check: if user is signed up, made an account,send a JWT and check it out:
export const protect = (req, res, next) => {
  const bearer = req.headers.authorization; //get the authorization header (includes the token) that will be used to determine who can access the api
  //1. Check if the user is sending a token:
  if (!bearer) {
    res.status(401);
    res.json({ message: "not authorized" });
    return; //otherwise it will keep going through the code
  }
  // 2. Check if the token is real:
  // 2.1. Check format: "Bearer ksdbfjkdsaf.." - token after Bearer
  const [, token] = bearer.split(" "); //destructuring - the 2nd part of the auth. header value (after the space) is the actual token.
  if (!token) {
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
  // 2.2. If format is correct, check if it's valid:
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // request object that we signed, which contains id and username
    next();
  } catch (e) {
    console.log(e);
    res.status(401);
    res.json({ message: "not valid token" });
    return;
  }
};
