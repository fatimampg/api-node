import { Router } from "express";
import { body, validationResult, oneOf } from "express-validator";
import { handleInputErrors } from "./modules/middleware";
import {
  createProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  updateProduct,
} from "./handlers/product";
import {
  createUpdate,
  deleteUpdate,
  getOneUpdate,
  getUpdates,
  updateUpdate,
} from "./handlers/update";

const router = Router();

/************ PRODUCTS ***************/

// Get all products:
router.get("/product", getProducts);

// Get a specific product based on its id:
router.get("/product/:id", getOneProduct); //:id because id is a variable (route parameter / dynamic)

// Update a specific product:
router.put(
  "/product/:id",
  body("name").isString(),
  handleInputErrors,
  // validation: body("name") --> req.body should have a field called "name". body("name") is attaching something to req that validationResult will then look at, to determine what validations it needs to check for...
  updateProduct
);

// Add a new product:
router.post(
  "/product",
  body("name").isString(),
  handleInputErrors,
  createProduct
);

// Delete a specific product:
router.delete("/product/:id", deleteProduct);

/************ UPDATE ***************/

// Get all updates:
router.get("/update", getUpdates);

// Get a specific update:
router.get("/update/:id", getOneUpdate);

// Update a specific update:
router.put(
  "/update/:id",
  body("title").optional(),
  body("body").optional(),
  body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]).optional(),
  body("version").optional(),
  updateUpdate
);

// Add a new update:
router.post(
  "/update",
  body("title").exists().isString(),
  body("body").exists().isString(),
  body("productId").exists().isString(),
  createUpdate
);

// Delete a specific update:
router.delete("/update/:id", deleteUpdate);

/************ UPDATE PRODUCTS ***************/

// Get all updatepoints:
router.get("/updatepoint", () => {});

// Get a specific updatepoint based on its id:
router.get("/updatepoint/:id", () => {});

// Update a specific updatepoint:
router.put(
  "/updatepoint/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  () => {}
);

// Add a new updatepoint:
router.post(
  "/updatepoint",
  body("name").exists().isString(),
  body("description").exists().isString(),
  body("updateId").exists().isString(),
  () => {}
);

// Delete a specific updatepoint:
router.delete("/updatepoint/:id", () => {});

// To ensure I get the errors associated to product or update:
router.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "in router handler" });
}); // (the default error handler is on server.js, which only includes handlers for user (not for products and updates)). 

export default router;
