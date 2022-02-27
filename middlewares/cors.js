const allowedCors = [
  'http://localhost:3000',
  'https://api.filatov-movies.nomoredomains.work',
  'https://filatov-movies.nomoredomains.work',
  'http://filatov-movies.nomoredomains.work',
];

const corsHandler = (req, res, next) => {
  const { origin } = req.headers;

  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Credentials', true);
    res.end();
    return;
  }

  next();
};

module.exports = corsHandler;
