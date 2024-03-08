import prisma from "../db";

// ------------- Get all Products from the signed in user -------------
export const getProducts = async (req, res) => {
  // get full user info (user attached to req.user only has user id and username) and extract products associated to that user:
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      products: true,
    },
  });
  res.json({ data: user.products });
};

// ------------- Get a specific product (id available in route) from the signed in user -------------
export const getOneProduct = async (req, res) => {
  const id = req.params.id; //params is the route parameter, after ":" (possible through express.urlencoded)
  const product = await prisma.product.findFirst({
    // findFirst returns the 1st record in a list that matches the specified criteria
    where: {
      id,
      belongsToId: req.user.id,
    },
  });
  res.json({ data: product });
};

// ------------- Create a product -------------
export const createProduct = async (req, res, next) => {
  try {
    // Prisma schema --> model is named Product. The corresponding Prisma client methods will be named using the lowercase "product"
    const product = await prisma.product.create({
      data: {
        name: req.body.name, // name available in the JSON data in the request body (POST request - route handler)
        belongsToId: req.user.id,
      },
    });
    res.json({ data: product });
  } catch (e) {
    next(e);
  }
};

// ------------- Update a product -------------
export const updateProduct = async (req, res) => {
  const updated = await prisma.product.update({
    //.update: gives the product updated (id, createdAt, name and belongsToId). .updateMany: gives an object describing all the operations done.
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      }, //joint index (created a composite id (@@unique...) to ensure a unique combination of id and belongsToId) (Problem of using id only: not only the user that added that product would be able to update it.)
    },
    data: {
      name: req.body.name, // in products, we can only update the name
    },
  });
  res.json({ data: updated });
};

// ------------- Delete a product -------------
export const deleteProduct = async (req, res) => {
  const deleted = await prisma.product.delete({
    where: {
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    },
  });

  res.json({ data: deleted });
};
