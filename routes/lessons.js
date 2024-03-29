const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const validateSID = require('../middleware/validateSID');
const express = require('express');
const Lesson = require('../models/Lesson');
const router = express.Router();

// @route   GET lessons/:userId
// @desc    Gets all subject's lessons
// @access  Private
router.get('/:userId', auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/lessons/${userId}`);

  ref.once(
    'value',
    (lessons) => {
      if (!lessons.exists()) {
        return res.status(200).json({});
      }
      return res.status(200).json(lessons);
    },
    (e) => {
      return res.status(500).json({
        msg: 'Error while trying to fetch requested lessons.',
        errorMsg: e,
      });
    },
  );
});

// @route   GET lessons/:userId/:subjectId
// @desc    Gets a specific subject's lessons
// @access  Private
router.get('/:userId/:subjectId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/lessons/${userId}/${subjectId}`);

  ref.once(
    'value',
    (lessons) => {
      if (!lessons.exists()) {
        return res.status(200).json({});
      }
      return res.status(200).json(lessons);
    },
    (e) => {
      return res.status(500).json({
        msg: "Error while trying to fetch requested subject's lessons.",
        errorMsg: e,
      });
    },
  );
});

// @route   GET lessons/:userId/:subjectId/:lessonId
// @desc    Gets a specific lesson
// @access  Private
router.get('/:userId/:subjectId/:lessonId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;
  const ref = db.ref(`/lessons/${userId}/${subjectId}/${lessonId}`);

  ref.once(
    'value',
    (lesson) => {
      if (!lesson.exists()) {
        return res.status(200).json({});
      }
      return res.status(200).json(lesson);
    },
    (e) => {
      return res.status(500).json({
        msg: 'Error while trying to fetch requsted lesson.',
        errorMsg: e,
      });
    },
  );
});

// @route   POST lessons/:userId
// @desc    Adds a lesson to the database
// @access  Private
router.post('/:userId', auth, validateSID, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { subjectId, week, day, starts, ends, location } = req.body;

  if (!subjectId || !week || !day || !starts || !ends || !location) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  if (hasInvalidParams(week, day, starts, ends, location)) {
    return res.status(400).json({ msg: 'Invalid parameter types.' });
  }

  const lesson = new Lesson(subjectId, week, day, starts, ends, location);
  const key = db.ref(`lessons/${userId}/${subjectId}`).push().key;
  lesson.id = key;

  const ref = db.ref(`lessons/${userId}/${subjectId}/${key}`);

  try {
    ref.set(lesson);
    res.status(201).json(lesson);
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

// @route   PUT lessons/:userId/:subjectId/:lessonId
// @desc    Updates an existing lesson
// @access  Private
router.put('/:userId/:subjectId/:lessonId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;
  const { week, day, starts, ends, location } = req.body;

  if (!week || !day || !starts || !ends || !location) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  if (hasInvalidParams(week, day, starts, ends, location)) {
    return res.status(400).json({ msg: 'Invalid parameter types.' });
  }

  const lesson = new Lesson(subjectId, week, day, starts, ends, location, lessonId);
  const ref = db.ref(`lessons/${userId}/${subjectId}/${lessonId}`);

  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      ref
        .update(lesson)
        .then(res.status(204).end())
        .catch((e) => res.status(500).json({ success: false, errorMsg: e }));
    } else {
      return res.status(404).json({ msg: 'Lesson does not exist.' });
    }
  });
});

// @route   DELETE lessons/:userId/:subjectId/:lessonId
// @desc    Deletes a lesson
// @access  Private
router.delete('/:userId/:subjectId/:lessonId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;

  const ref = db.ref(`lessons/${userId}/${subjectId}/${lessonId}`);

  try {
    ref.set(null);
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ msg: 'Error while processing your request.', errorMsg: e });
  }
});

/**
 * A simple function that checks whether a request
 * that contains a Lesson object has any invalid params.
 *
 * @param {string} week
 * @param {number} day
 * @param {string} starts
 * @param {string} ends
 * @param {string} location
 *
 * @returns {boolean} True if any of the given params is invalid, otherwise false.
 */
const hasInvalidParams = (week, day, starts, ends, location) => {
  const isInvalidWeek = typeof week !== 'string' || (week !== 'A' && week !== 'B');
  const isInvalidDay = typeof parseInt(day, 10) !== 'number' || parseInt(day, 10) < 1 || parseInt(day, 10) > 7;
  const isInvalidStarts = typeof starts !== 'string';
  const isInvalidEnds = typeof ends !== 'string';
  const isInvalidLocation = typeof location !== 'string';

  if (isInvalidWeek || isInvalidDay || isInvalidStarts || isInvalidEnds || isInvalidLocation) {
    return true;
  } else {
    return false;
  }
};

module.exports = router;
