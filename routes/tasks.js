const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
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

module.exports = router;
