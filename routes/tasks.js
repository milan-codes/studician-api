const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
const Task = require("../models/Task");
const validateSID = require("../middleware/validateSID");
const router = express.Router();

// @route   GET tasks/:userId
// @desc    Gets all subject's tasks
// @access  Private
router.get("/:userId", auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/tasks/${userId}`);

  ref.on(
    "value",
    (tasks) => {
      if (!tasks.exists()) {
        return res.json({ msg: "Could not find requested tasks." });
      }
      return res.json(tasks);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested tasks.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET tasks/:userId/:subjectId
// @desc    Gets a specific subject's tasks
// @access  Private
router.get("/:userId/:subjectId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/tasks/${userId}/${subjectId}`);

  ref.on(
    "value",
    (tasks) => {
      if (!tasks.exists()) {
        return res.json({ msg: "Could not find requested subject's tasks." });
      }
      return res.json(tasks);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subject's tasks.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET tasks/:userId/:subjectId/:taskId
// @desc    Gets a specific task
// @access  Private
router.get("/:userId/:subjectId/:taskId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, taskId } = req.params;
  const ref = db.ref(`tasks/${userId}/${subjectId}/${taskId}`);

  ref.once(
    "value",
    (task) => {
      if (!task.exists()) {
        return res.json({ msg: "Could not find requested task." });
      }
      return res.json(task);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requsted task.",
        errorMsg: e,
      });
    }
  );
});

// @route   POST tasks/:userId
// @desc    Adds a task to the database
// @access  Private
router.post("/:userId", auth, validateSID, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { name, description, type, subjectId, dueDate, reminder, id } = req.body;

  if (!name || !type || !subjectId || !dueDate) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const task = new Task(name, null, type, subjectId, dueDate, null);
  const key = db.ref(`tasks/${userId}/${subjectId}`).push().key;
  task.id = key;

  if (description) task.description = description;
  if (reminder) task.reminder = reminder;

  const ref = db.ref(`tasks/${userId}/${subjectId}/${key}`);

  try {
    ref.set(task);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

module.exports = router;
