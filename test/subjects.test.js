const server = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const should = chai.should();
const admin = require('firebase-admin');
const rp = require('request-promise');

const getTestIdToken = async (uid) => {
  const customToken = await admin.auth().createCustomToken(uid);
  const res = await rp({
    url: `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.FIREBASE_API_KEY}`,
    method: 'POST',
    body: {
      token: customToken,
      returnSecureToken: true,
    },
    json: true,
  });
  return res.idToken;
};

chai.use(chaiHttp);

describe('Subject routes tests', () => {
  let id;

  before(() => {
    return getTestIdToken('testuser').then((token) => (id = token));
  });

  describe('GET subjects/:userId', () => {
    it('should get all subjects from the database assigned to the test user', (done) => {
      console.log(id);
      chai
        .request(server)
        .get('/subjects/testuser')
        .set('x-auth-token', id)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          done();
        });
    });
  });

  describe('POST subjects/:userId', () => {
    it('should add a subject to the database under testuser', (done) => {
      const subject = {
        name: 'POST API test',
        teacher: 'POST API test',
        colorCode: 12324342,
      };
      chai
        .request(server)
        .post('/subjects/testuser')
        .set('x-auth-token', id)
        .send(subject)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(201);
          done();
        });
    });
  });
});
