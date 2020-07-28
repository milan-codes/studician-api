const chai = require('chai');
const validateSID = require('../middleware/validateSID');

chai.should();

describe('Middleware tests', () => {
  describe('validateSID middleware test', () => {
    it('should return a function', (done) => {
      validateSID.should.be.a('function');
      done();
    });
  });
});
