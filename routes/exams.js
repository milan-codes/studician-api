const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const express = require('express');
const validateSID = require('../middleware/validateSID');
const Exam = require('../models/Exam');
const router = express.Router();

// @route   GET exams/:userId
// @desc    Gets all subject's exams
// @access  Private
router.get('/:userId', auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/exams/${userId}`);

  ref.on(
    'value',
    (exams) => {
      if (!exams.exists()) {
        return res.json({ msg: 'Could not find requested exams.' });
      }
      return res.json(exams);
    },
    (e) => {
      return res.json({
        msg: 'Error while trying to fetch requested exams.',
        errorMsg: e,
      });
    }
  );
});

// @route   GET exams/:userId/:subjectId
// @desc    Gets a specific subject's exams
// @access  Private
router.get('/:userId/:subjectId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/exams/${userId}/${subjectId}`);

  ref.on(
    'value',
    (exams) => {
      if (!exams.exists()) {
        return res.json({ msg: "Could not find requested subject's exams." });
      }
      return res.json(exams);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subject's exams.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET exams/:userId/:subjectId/:examId
// @desc    Gets a specific exam
// @access  Private
router.get('/:userId/:subjectId/:examId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, examId } = req.params;
  const ref = db.ref(`/exams/${userId}/${subjectId}/${examId}`);

  ref.once(
    'value',
    (exam) => {
      if (!exam.exists()) {
        return res.json({ msg: 'Could not find requested exam.' });
      }
      return res.json(exam);
    },
    (e) => {
      return res.json({
        msg: 'Error while trying to fetch requsted exam.',
        errorMsg: e,
      });
    }
  );
});

// @route   POST exams/:userId
// @desc    Adds an exam to the database
// @access  Private
router.post('/:userId', auth, validateSID, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { name, description, subjectId, dueDate, reminder } = req.body;

  if (!name || !subjectId || !dueDate) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  const exam = new Exam(name, subjectId, dueDate);
  const key = db.ref(`exams/${userId}/${subjectId}`).push().key;
  exam.id = key;

  if (description) exam.description = description;
  if (reminder) exam.reminder = reminder;

  const ref = db.ref(`exams/${userId}/${subjectId}/${key}`);

  try {
    ref.set(exam);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

// @route   PUT exams/:userId/:subjectId/:examId
// @desc    Updates an existing exam
// @access  Private
router.put('/:userId/:subjectId/:examId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, examId } = req.params;
  const { name, description, dueDate, reminder } = req.body;

  if (!name || !dueDate) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  const exam = new Exam(name, subjectId, dueDate);
  exam.id = examId;

  if (description) exam.description = description;
  if (reminder) exam.reminder = reminder;

  const ref = db.ref(`exams/${userId}/${subjectId}/${examId}`);

  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      ref
        .update(exam)
        .then(res.status(204))
        .catch((e) => res.status(500).json({ success: false, errorMsg: e }));
    } else {
      return res.status(400).json({ msg: 'Exam does not exist.' });
    }
  });
});

// @route   DELETE exams/:userId/:subjectId/:examId
// @desc    Deletes an exam
// @access  Private
router.delete('/:userId/:subjectId/:examId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, examId } = req.params;

  const ref = db.ref(`exams/${userId}/${subjectId}/${examId}`);

  try {
    ref.set(null);
    return res.status(204);
  } catch (e) {
    return res.status(500).json({ msg: 'Error while processing your request', errorMsg: e });
  }
});

module.exports = router;
