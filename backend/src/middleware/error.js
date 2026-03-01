function notFound(_req, res) {
  res.status(404).json({ success: false, message: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
}

module.exports = { notFound, errorHandler };

