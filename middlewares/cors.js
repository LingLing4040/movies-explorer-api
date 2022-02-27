const allowedCors = [
  // 'http://localhost:3000',
  // 'https://filatov.students.nomoredomains.work',
  // 'https://cool.domainname.students.nomoredomains.xyz',
  // 'http://cool.domainname.students.nomoredomains.xyz',
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
