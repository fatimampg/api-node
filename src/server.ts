import express from "express";
import router from "./router";
import { protect } from "./modules/auth";
import morgan from "morgan"; // http request logger for node.js
import { createNewUser, signin } from "./handlers/users";

//Make the api:
const app = express();

app.use(morgan("dev")); // middleware (logger) (dev formatting)
app.use(express.json()); // middleware that enables to parse JSON data sent by the client
app.use(express.urlencoded({ extended: true })); // middleware to parse incoming requests with urlencoded payloads (ex.: allows the client to add a query string and decoded it).

app.get("/", (req, res) => {
  console.log("hello from express");
  res.status(200); // info usefull for the client
  res.json({ message: "hello" });
});

// use (from express): apply a global config to the entire app or to a certain part of it (in this case: everything that has /api, use router)
app.use("/api", protect, router); // this only applies to this sub router (this is mounted before any routes in router.ts.) (ex. url: /api/product). (protect middleware (defined in auth.ts) for access control)

app.post("/user", createNewUser); //route to create new user (uses handle function createNewUser)
app.post("/signin", signin); 

export default app;
