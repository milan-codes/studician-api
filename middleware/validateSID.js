const admin = require('firebase-admin');

/**
 * Middleware that checks whether the SubjectID sent in a request exists.
 */
function validateSID(req, res, next) {
  const { userId } = req.params;
  const { subjectId } = req.body;

  if (!userId || !subjectId) {
    return res.status(400).json({ msg: 'Required tokens were not provided.' });
  }

  const isInvalidSubjectId = typeof subjectId !== 'string';

  if (isInvalidSubjectId) {
    return res.status(400).json({ msg: 'Invalid parameter types.' });
  }

  const db = admin.database();
  const ref = db.ref(`subjects/${userId}/${subjectId}`);

  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      next();
    } else {
      return res.status(404).json({ msg: 'Subject does not exist.' });
    }
  });
}

module.exports = validateSID;
