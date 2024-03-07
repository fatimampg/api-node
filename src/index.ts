import * as dotenv from "dotenv";
dotenv.config(); // to be able to load all env variables in .env file and access them through process.env (added to the entry file into our server, which is index.ts)
import app from "./server";

app.listen(3001, () => {
  console.log("hello on http://localhost:3001");
});

// const http = require("http");
// const server = http.createServer(async (req, res) => {
//   // in case of a GET request, to wtv address the server is hosted on:
//   if (req.method === "GET" && req.url === "/") {
//     console.log("hello from server");
//     res.end(); // close the connection
//   }
// });
// server.listen(3001, () => {
//   console.log("server on http://localhost:3001");
// });
