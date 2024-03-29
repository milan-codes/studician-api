const admin = require('firebase-admin');

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check if token were sent
  if (!token) {
    return res.status(401).json({ msg: 'No token, access denied.' });
  }

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const { uid } = decodedToken;
      const { userId } = req.params;

      if (uid !== userId) {
        return res.status(401).json({ msg: "Tried to reach another user's data, access denied." });
      } else {
        next();
      }
    })
    .catch((e) => {
      return res.status(400).json({ msg: 'Invalid token.' });
    });
}

module.exports = auth;
