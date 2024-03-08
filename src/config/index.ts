import merge from "lodash.merge";

// Set a default for NODE_ENV (make sure I dont overwrite the existing NODE_ENV. If NODE_ENV dont exists, then set it to development):
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "local"; // if stage wasn't set, then = to local
let envConfig;

// dynamically require each config depending on the stage we're in
if (stage === "production") {
  envConfig = require("./prod").default; // get the production config (import module) (.default to interact between ES6 modules and non ES6 modules - access the default export of a module).
} else if (stage === "testing") {
  envConfig = require("./staging").default;
} else {
  envConfig = require("./local").default;
}

const defaultConfig = {
  stage,
  env: process.env.NODE_ENV,
  port: 7001,
  secrets: {
    jwt: process.env.JWT_SECRET,
    dbUrl: process.env.DATABASE_URL,
  },
  logging: false,
};

// console.log("STAGE:", stage);
// console.log("Loaded Configuration:", envConfig);

export default merge(defaultConfig, envConfig); //default config will be merged underneath envConfig, so it will be overwritted depending on the environment chosen
