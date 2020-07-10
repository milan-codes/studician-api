const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const validateSID = require("../middleware/validateSID");
const express = require("express");
const Lesson = require("../models/Lesson");
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
  const ref = db.ref(`/lessons/${userId}/${subjectId}/${lessonId}`);

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

// @route   POST lessons/:userId
// @desc    Adds a lesson to the database
// @access  Private
router.post("/:userId", auth, validateSID, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { subjectId, week, day, starts, ends, location } = req.body;

  if (!subjectId || !week || !day || !starts || !ends || !location) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const lesson = new Lesson(subjectId, week, day, starts, ends, location);
  const key = db.ref(`lessons/${userId}/${subjectId}`).push().key;
  lesson.id = key;

  const ref = db.ref(`lessons/${userId}/${subjectId}/${key}`);

  try {
    ref.set(lesson);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

// @route   PUT lessons/:userId/:subjectId/:lessonId
// @desc    Updates an existing lesson
// @access  Private
router.put("/:userId/:subjectId/:lessonId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;
  const { week, day, starts, ends, location } = req.body;

  if (!week || !day || !starts || !ends || !location) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const lesson = new Lesson(subjectId, week, day, starts, ends, location, lessonId);
  const ref = db.ref(`lessons/${userId}/${subjectId}/${lessonId}`);

  ref.once("value", (snapshot) => {
    if (snapshot.exists()) {
      ref
        .update(lesson)
        .then(res.status(204))
        .catch((e) => res.status(500).json({ success: false, errorMsg: e }));
    } else {
      return res.status(400).json({ msg: "Lesson does not exist." });
    }
  });
});

// @route   DELETE lessons/:userId/:subjectId/:lessonId
// @desc    Deletes a lesson
// @access  Private
router.delete("/:userId/:subjectId/:lessonId", (req, res) => {
  const db = admin.database();
  const { userId, subjectId, lessonId } = req.params;

  const ref = db.ref(`lessons/${userId}/${subjectId}/${lessonId}`);

  try {
    ref.set(null);
    return res.status(204);
  } catch (e) {
    return res.status(500).json({ msg: "Error while processing your request.", errorMsg: e });
  }
});

module.exports = router;
