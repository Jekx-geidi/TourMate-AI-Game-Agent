// Test handler - just return JSON to verify Vercel serverless works
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    ok: true,
    path: req.url,
    method: req.method,
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
    },
  });
};