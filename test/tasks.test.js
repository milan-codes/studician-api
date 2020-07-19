const server = require('../server');
const admin = require('firebase-admin');
const testUtils = require('./testUtils');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);
chai.should();

describe('Task routes tests', () => {
  let authToken;
  let testSubject;
  let testTask;

  // Emptying database and creating a test subject
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

    // Getting a token to bypass authentication
    return testUtils.getTestIdToken('testuser').then((token) => (authToken = token));
  });

  describe('GET tasks/:userId', () => {
    it('should get all tasks of all subjects from the database assigned to testuser', (done) => {
      chai
        .request(server)
        .get('/tasks/testuser')
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

  describe('GET tasks/:userId/:subjectId', () => {
    it('should get all tasks of the dummy subject assigned to the test user', (done) => {
      chai
        .request(server)
        .get(`/tasks/testuser/${testSubject.id}`)
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

  describe('POST tasks/:userId', () => {
    it('should add a task to the database under testuser/testsubject', (done) => {
      const task = {
        name: 'POST api test',
        description: 'POST api test',
        type: 1,
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .post('/tasks/testuser')
        .set('x-auth-token', authToken)
        .send(task)
        .end((err, res) => {
          if (err) throw Error(err);
          testTask = res.body;
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('POST tasks/:userId', () => {
    it('should throw an error because required parameters are missing from the body', (done) => {
      const task = {
        name: 'error test',
      };
      chai
        .request(server)
        .post('/tasks/testuser')
        .set('x-auth-token', authToken)
        .send(task)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('GET tasks/:userId/:subjectId/:taskId', () => {
    it('should get a specific task from the database', (done) => {
      chai
        .request(server)
        .get(`/tasks/testuser/${testSubject.id}/${testTask.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.be.eql(testTask);
          done();
        });
    });
  });

  describe('PUT tasks/:userId/:subjectId/:taskId', () => {
    it('should update the previously added exam', (done) => {
      const task = {
        name: 'PUT api test',
        description: 'PUT api test',
        type: 2,
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .put(`/tasks/testuser/${testSubject.id}/${testTask.id}`)
        .set('x-auth-token', authToken)
        .send(task)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('PUT tasks/:userId/:subjectId/:lessonId', () => {
    it('should throw an error, because the requested task does not exist', (done) => {
      const task = {
        name: 'PUT api test',
        description: 'PUT api test',
        type: 2,
        subjectId: 'testsubject',
        dueDate: Date.now(),
        reminder: Date.now(),
      };
      chai
        .request(server)
        .put(`/tasks/testuser/${testSubject.id}/non-existing-task`)
        .set('x-auth-token', authToken)
        .send(task)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('DELETE tasks/:userId/:subjectId/:taskId', () => {
    it('should delete the previously added task', (done) => {
      chai
        .request(server)
        .delete(`/tasks/testuser/${testSubject.id}/${testTask.id}`)
        .set('x-auth-token', authToken)
        .end((err, res) => {
          if (err) throw Error(err);
          res.should.have.status(204);
          done();
        });
    });
  });

  after(() => {
    admin.database().ref(`/subjects/testuser/${testSubject.id}`).set(null);
  });
});
