export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const notFound = (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
};
