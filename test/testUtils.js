const admin = require('firebase-admin');
const rp = require('request-promise');

module.exports = {
  getTestIdToken: async (uid) => {
    const customToken = await admin.auth().createCustomToken(uid);
    const apiKey = process.env.FIREBASE_API_KEY;
    const res = await rp({
      url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${apiKey}`,
      method: 'POST',
      body: {
        token: customToken,
        returnSecureToken: true,
      },
      json: true,
    });
    return res.idToken;
  },
};
