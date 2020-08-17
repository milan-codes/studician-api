const server = require('../server');
const admin = require('firebase-admin');
const { getTestIdToken } = require('../utils');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);
chai.should();

describe('Exam routes tests', () => {
  let authToken;
  let testSubject;
  let testExam;

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

  describe('GET exams/:userId', () => {
    it('should get all exams of all subjects from the database assigned to testuser', (done) => {
      chai
        .request(server)
        .get('/exams/testuser')
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

  describe('GET exams/:userId/:subjectId', () => {
    it('should get all exams of the dummy subject assigned to the test user', (done) => {
      chai
        .request(server)
        .get(`/exams/testuser/${testSubject.id}`)
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

  describe('POST exams/:userId', () => {
    it('should add an exam to the database under testuser/testsubject', (done) => {
      const exam = {
        name: 'POST api test',
        description: 'POST api test',
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .post('/exams/testuser')
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          testExam = res.body;
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('POST exams/:userId', () => {
    it('should throw an error because required parameters are missing from the body', (done) => {
      const exam = {
        name: 'error test',
      };
      chai
        .request(server)
        .post('/exams/testuser')
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('POST exams/:userId', () => {
    it('should throw an error because parameters have wrong types', (done) => {
      const exam = {
        name: 'POST api test',
        description: 'POST api test',
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: 'Date.now()',
      };
      chai
        .request(server)
        .post('/exams/testuser')
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          res.body.msg.should.be.eql('Invalid parameter types.');
          done();
        });
    });
  });

  describe('GET exams/:userId/:subjectId/:examId', () => {
    it('should get a specific exam from the database', (done) => {
      chai
        .request(server)
        .get(`/exams/testuser/${testSubject.id}/${testExam.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.be.eql(testExam);
          done();
        });
    });
  });

  describe('PUT exams/:userId/:subjectId/:examId', () => {
    it('should update the previously added exam', (done) => {
      const exam = {
        name: 'PUT api test',
        description: 'PUT api test',
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .put(`/exams/testuser/${testSubject.id}/${testExam.id}`)
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('PUT exams/:userId/:subjectId/:lessonId', () => {
    it('should throw an error, because the requested exam does not exist', (done) => {
      const exam = {
        name: 'PUT api test',
        description: 'PUT api test',
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .put(`/exams/testuser/${testSubject.id}/non-existing-exam`)
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('PUT exams/:userId/:subjectId/:lessonId', () => {
    it('should throw an error, because parameters have the wrong types', (done) => {
      const exam = {
        name: 'PUT api test',
        description: 1,
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .put(`/exams/testuser/${testExam.subjectId}/${testExam.id}`)
        .set('x-auth-token', authToken)
        .send(exam)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          res.body.msg.should.be.eql('Invalid parameter types.');
          done();
        });
    });
  });

  describe('DELETE exams/:userId/:subjectId/:examId', () => {
    it('should delete the previously added exam', (done) => {
      chai
        .request(server)
        .delete(`/exams/testuser/${testSubject.id}/${testExam.id}`)
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
