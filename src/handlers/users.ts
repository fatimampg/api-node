import prisma from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

// handler function to create  a user:
export const createNewUser = async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username, // client will send the username attached to the body
      password: await hashPassword(req.body.password),
    },
  });

  const token = createJWT(user); // create a token:
  res.json({ token: token }); // send back the token
};

// handler function to sign in (signin also issues a token)
export const signin = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  const isValid = await comparePasswords(req.body.password, user.password); //bcrypt function used in compaterPasswrods is the async version

  if (!isValid) {
    res.status(401);
    res.json({ message: "nope" });
    return;
  }
  const token = createJWT(user); // create the token
  res.json({ token: token }); // send back the token so the user can access the rest of the api
};
