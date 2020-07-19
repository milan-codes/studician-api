const server = require('../server');
const admin = require('firebase-admin');
const testUtils = require('./testUtils');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);
chai.should();

describe('Subject routes tests', () => {
  let authToken;
  let addedSubject;

  before(() => {
    admin.database().ref('/').set(null);
    return testUtils.getTestIdToken('testuser').then((token) => (authToken = token));
  });

  describe('GET subjects/:userId', () => {
    it('should get all subjects from the database assigned to the test user (0)', (done) => {
      chai
        .request(server)
        .get('/subjects/testuser')
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.be.eql({});
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
        .set('x-auth-token', authToken)
        .send(subject)
        .end((err, res) => {
          if (err) throw Error(err);
          addedSubject = res.body;
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('POST subjects/:userId', () => {
    it('should throw an error because required parameters are missing from the body', (done) => {
      const subject = {
        name: 'POST API test',
      };
      chai
        .request(server)
        .post('/subjects/testuser')
        .set('x-auth-token', authToken)
        .send(subject)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('GET subjects/:userId/:subjectId', () => {
    it('should get a specific subject from the database', (done) => {
      chai
        .request(server)
        .get(`/subjects/testuser/${addedSubject.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.be.eql(addedSubject);
          done();
        });
    });
  });

  describe('PUT subjects/:userId/:subjectId', () => {
    it('should update the previously added subject', (done) => {
      const subject = {
        name: 'PUT API test',
        teacher: 'PUT API test',
        colorCode: '2131034271',
      };
      chai
        .request(server)
        .put(`/subjects/testuser/${addedSubject.id}`)
        .set('x-auth-token', authToken)
        .send(subject)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('PUT subjects/:userId/:subjectId', () => {
    it('should throw an error, because the requested subject does not exist', (done) => {
      const subject = {
        name: 'PUT API test',
        teacher: 'PUT API test',
        colorCode: '2131034271',
      };
      chai
        .request(server)
        .put('/subjects/testuser/non-existing-subject')
        .set('x-auth-token', authToken)
        .send(subject)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE subjects/:userId/:subjectId', () => {
    it('should delete the previously added subject', (done) => {
      chai
        .request(server)
        .delete(`/subjects/testuser/${addedSubject.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });
});
