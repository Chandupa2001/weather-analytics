export function notFoundMiddleware(req, res) {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
}
