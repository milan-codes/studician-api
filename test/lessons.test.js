const server = require('../server');
const admin = require('firebase-admin');
const { getTestIdToken } = require('../utils');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);
chai.should();

describe('Lesson routes tests', () => {
  let authToken;
  let testSubject;
  let testLesson;

  // Emptying the database and creating a test subject
  before(() => {
    admin.database().ref('/').set(null);

    const dummySubject = {
      name: 'test subject',
      teacher: 'test teacher',
      colorCode: -1,
      id: 'testsubject',
    };
    admin.database().ref('subjects/testuser/testsubject').set(dummySubject);
    testSubject = dummySubject;

    // Getting token to bypass authentication
    return getTestIdToken('testuser').then((token) => (authToken = token));
  });

  describe('GET lessons/:userId', () => {
    it('should get all lessons of all subjects from the database assigned to the test user (0)', (done) => {
      chai
        .request(server)
        .get('/lessons/testuser')
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

  describe('GET lessons/:userId/:subjectId', () => {
    it('should get all lessons of the dummy subject assigned to the test user', (done) => {
      chai
        .request(server)
        .get(`/lessons/testuser/${testSubject.id}`)
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

  describe('POST lessons/:userId', () => {
    it('should add a lesson to the database under testuser/testsubject', (done) => {
      const lesson = {
        subjectId: 'testsubject',
        week: 'A',
        day: 1,
        starts: '7:45',
        ends: '7:45',
        location: 'test',
      };
      chai
        .request(server)
        .post('/lessons/testuser')
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          testLesson = res.body;
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('POST lessons/:userId', () => {
    it('should throw an error because required parameters are missing from the body', (done) => {
      const lesson = {
        week: 'error test',
      };
      chai
        .request(server)
        .post('/lessons/testuser')
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('POST lessons/:userId', () => {
    it('should throw an error because parameters have wrong types', (done) => {
      const lesson = {
        subjectId: 'testsubject',
        week: 'C',
        day: 8,
        starts: 745,
        ends: 745,
        location: 1,
      };
      chai
        .request(server)
        .post('/lessons/testuser')
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          res.body.msg.should.be.eql('Invalid parameter types.');
          done();
        });
    });
  });

  describe('GET lessons/:userId/:subjectId/:lessonId', () => {
    it('should get a specific lesson from the database', (done) => {
      chai
        .request(server)
        .get(`/lessons/testuser/${testSubject.id}/${testLesson.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.be.eql(testLesson);
          done();
        });
    });
  });

  describe('PUT lessons/:userId/:subjectId/:lessonId', () => {
    it('should update the previously added lesson', (done) => {
      const lesson = {
        subjectId: 'testsubject',
        week: 'B',
        day: 1,
        starts: 'PUT 7:45',
        ends: 'PUT 7:45',
        location: 'PUT test',
      };
      chai
        .request(server)
        .put(`/lessons/testuser/${testSubject.id}/${testLesson.id}`)
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('PUT lessons/:userId/:subjectId/:lessonId', () => {
    it('should throw an error, because the requested lesson does not exist', (done) => {
      const lesson = {
        subjectId: 'testsubject',
        week: 'A',
        day: 1,
        starts: 'PUT 7:45',
        ends: 'PUT 7:45',
        location: 'PUT test',
      };
      chai
        .request(server)
        .put(`/lessons/testuser/${testSubject.id}/non-existing-lesson`)
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('PUT lessons/:userId/:subjectId/:lessonId', () => {
    it('should throw an error, because parameters have wrong types', (done) => {
      const lesson = {
        subjectId: 'testsubject',
        week: 'C',
        day: 8,
        starts: 745,
        ends: 745,
        location: 1,
      };
      chai
        .request(server)
        .put(`/lessons/testuser/${testLesson.subjectId}/${testLesson.id}`)
        .set('x-auth-token', authToken)
        .send(lesson)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          res.body.msg.should.be.eql('Invalid parameter types.');
          done();
        });
    });
  });

  describe('DELETE lessons/:userId/:subjectId/:lessonId', () => {
    it('should delete the previously added lesson', (done) => {
      chai
        .request(server)
        .delete(`/lessons/testuser/${testSubject.id}/${testLesson.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  // Deleting test subject
  after(() => {
    admin.database().ref(`/subjects/testuser/${testSubject.id}`).set(null);
  });
});
