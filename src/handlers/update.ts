import prisma from "../db";

// ------------- Get a specific update -------------
export const getOneUpdate = async (req, res) => {
  const id = req.params.id; //params is the route parameter (after ":")
  const update = await prisma.product.findFirst({
    where: {
      id: req.params.id,
    },
  });
  res.json({ data: update });
};

// ------------- Get all updates associated to a specific product (added by the signedin user) -------------
export const getUpdates = async (req, res) => {
  //find all products associated to the signedin user and get all updates associated to all those products:
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []); // allUpdates - accumulator (starts as [] and accumulates the updates from each product)
  // (to do: adjust schema to avoid storing this in memory)
  res.json({ data: updates });
};

// ------------- Create an update -------------
export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });
  if (!product) {
    //product does not belong to this user:
    return res.json({ message: "not possible" });
  }
  const update = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      product: { connect: { id: product.id } },
    },
  });
  res.json({ data: update });
};

// ------------- Update an update -------------
export const updateUpdate = async (req, res) => {
  // get all updates of all products that belong to the signedin user:
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  // check if in the list of updates, there is the update (to update) (based on its id)
  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "not possible" });
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id,
    },
    data: req.body, // in the body: title, body, status and version (validation done in router.ts)
  });

  res.json({ data: updatedUpdate });
};

// ------------- Delete an update --------------:
export const deleteUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  // check if in the list of updates, there is the update (to update) (based on its id)
  const match = updates.find((update) => update.id === req.params.id);

  if (!match) {
    res.json({ message: "not possible" });
  }

  const deleted = await prisma.update.delete({
    where: {
      id: req.params.id,
    },
  });
  res.json({ data: deleted });
};
