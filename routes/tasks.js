const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const express = require('express');
const Task = require('../models/Task');
const validateSID = require('../middleware/validateSID');
const { isValidDate } = require('../utils');
const router = express.Router();

// @route   GET tasks/:userId
// @desc    Gets all subject's tasks
// @access  Private
router.get('/:userId', auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/tasks/${userId}`);

  ref.once(
    'value',
    (tasks) => {
      if (!tasks.exists()) {
        return res.json({});
      }
      return res.json(tasks);
    },
    (e) => {
      return res.json({
        msg: 'Error while trying to fetch requested tasks.',
        errorMsg: e,
      });
    },
  );
});

// @route   GET tasks/:userId/:subjectId
// @desc    Gets a specific subject's tasks
// @access  Private
router.get('/:userId/:subjectId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/tasks/${userId}/${subjectId}`);

  ref.once(
    'value',
    (tasks) => {
      if (!tasks.exists()) {
        return res.json({});
      }
      return res.json(tasks);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subject's tasks.",
        errorMsg: e,
      });
    },
  );
});

// @route   GET tasks/:userId/:subjectId/:taskId
// @desc    Gets a specific task
// @access  Private
router.get('/:userId/:subjectId/:taskId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, taskId } = req.params;
  const ref = db.ref(`tasks/${userId}/${subjectId}/${taskId}`);

  ref.once(
    'value',
    (task) => {
      if (!task.exists()) {
        return res.json({ msg: 'Could not find requested task.' });
      }
      return res.json(task);
    },
    (e) => {
      return res.json({
        msg: 'Error while trying to fetch requsted task.',
        errorMsg: e,
      });
    },
  );
});

// @route   POST tasks/:userId
// @desc    Adds a task to the database
// @access  Private
router.post('/:userId', auth, validateSID, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { name, type, subjectId, dueDate, description, reminder } = req.body;

  if (!name || !type || !subjectId || !dueDate) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  if (hasInvalidParams(name, type, dueDate, description, reminder)) {
    return res.status(400).json({ msg: 'Invalid parameter types.' });
  }

  const task = new Task(name, type, subjectId, dueDate);
  const key = db.ref(`tasks/${userId}/${subjectId}`).push().key;
  task.id = key;

  if (description) task.description = description;
  if (reminder) task.reminder = reminder;

  const ref = db.ref(`tasks/${userId}/${subjectId}/${key}`);

  try {
    ref.set(task);
    res.status(201).json(task);
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

// @route   PUT tasks/:userId/:subjectId/:taskId
// @desc    Updates an existing task
// @access  Private
router.put('/:userId/:subjectId/:taskId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, taskId } = req.params;
  const { name, description, type, dueDate, reminder } = req.body;

  if (!name || !type || !dueDate) {
    return res.status(400).json({ msg: 'Missing parameters.' });
  }

  if (hasInvalidParams(name, type, dueDate, description, reminder)) {
    return res.status(400).json({ msg: 'Invalid parameter types.' });
  }

  const task = new Task(name, type, subjectId, dueDate);
  task.id = taskId;

  if (description) task.description = description;
  if (reminder) task.reminder = reminder;

  const ref = db.ref(`tasks/${userId}/${subjectId}/${taskId}`);

  ref.once('value', (snapshot) => {
    if (snapshot.exists()) {
      ref
        .update(task)
        .then(res.status(204).end())
        .catch((e) => res.status(500).json({ success: false, errorMsg: e }));
    } else {
      return res.status(404).json({ msg: 'Task does not exist.' });
    }
  });
});

// @route   DELETE tasks/:userId/:subjectId/:taskId
// @desc    Deletes a task
// @access  Private
router.delete('/:userId/:subjectId/:taskId', auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, taskId } = req.params;

  const ref = db.ref(`tasks/${userId}/${subjectId}/${taskId}`);

  try {
    ref.set(null);
    return res.status(204).end();
  } catch (e) {
    return res.status(500).json({ msg: 'Error while processing your request', errorMsg: e });
  }
});

/**
 * A simple function that checks whether a request
 * that contains a Task object has any invalid params.
 *
 * @param {string} name
 * @param {number} type
 * @param {string} dueDate
 * @param {string} description
 * @param {string} reminder
 *
 * @returns {boolean} True if any of the given params is invalid, otherwise false.
 */
const hasInvalidParams = (name, type, dueDate, description, reminder) => {
  const isInvalidName = typeof name !== 'string';
  const isInvalidType = typeof type !== 'number' || (type !== 1 && type !== 2);
  const isInvalidDueDate = !isValidDate(dueDate);
  // Optional params
  const isInvalidDesc = description ? typeof description !== 'string' : false;
  const isInvalidReminder = !isValidDate(reminder);

  if (isInvalidName || isInvalidDesc || isInvalidType || isInvalidDueDate || isInvalidReminder) {
    return true;
  } else {
    return false;
  }
};

module.exports = router;
