export const notFound = (req, _res, next) => { const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`); error.statusCode = 404; next(error); };
export const errorHandler = (err, _req, res, _next) => { console.error(err); res.status(err.statusCode || 500).json({ message: err.isOperational ? err.message : 'Internal server error' }); };
