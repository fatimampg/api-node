setTimeout(() => {
  throw new Error("oops");
}, 300);

process.on("uncaughtException", () => {});

// used to catch async errors hapenning in node
process.on("unhandledRejection", () => {});
