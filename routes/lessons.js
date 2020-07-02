const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// @route   GET lessons/:userId
// @desc    Gets all subject's lessons
// @access  Private
router.get("/:userId", auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/lessons/${userId}`);

  ref.on(
    "value",
    (lessons) => {
      if (!lessons.exists()) {
        return res.json({ msg: "Could not find requested lessons." });
      }
      return res.json(lessons);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested lessons.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET lessons/:userId/:subjectId
// @desc    Gets a specific subject's lessons
// @access  Private
router.get("/:userId/:subjectId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/lessons/${userId}/${subjectId}`);

  ref.on(
    "value",
    (lessons) => {
      if (!lessons.exists()) {
        return res.json({ msg: "Could not find requested subject's lesson." });
      }
      return res.json(lessons);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subject's lessons.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET lessons/:userId/:subjectId/:lessonId
// @desc    Gets a specific lesson
// @access  Private
router.get("/:userId/:subjectId/:lessonId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;
  const ref = db.ref(`lessons/${userId}/${subjectId}/${lessonId}`);

  ref.once(
    "value",
    (lesson) => {
      if (!lesson.exists()) {
        return res.json({ msg: "Could not find requested lesson." });
      }
      return res.json(lesson);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requsted lesson.",
        errorMsg: e,
      });
    }
  );
});

module.exports = router;
