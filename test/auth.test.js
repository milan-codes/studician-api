const chai = require('chai');
const auth = require('../middleware/auth');

chai.should();

describe('Middleware tests', () => {
  describe('auth middleware test', () => {
    it('should return a function', (done) => {
      auth.should.be.a('function');
      done();
    });
  });
});
