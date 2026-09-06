export function errorMiddleware(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized", detail: err.message });
  }

  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message,
  });
}
