const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

// @route   GET subjects/:userId
// @desc    Gets all subjects of a user
// @access  Private
router.get("/:userId", auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const ref = db.ref(`/subjects/${userId}`);

  ref.on(
    "value",
    (subjects) => {
      if (!subjects.exists()) {
        return res.json({ msg: "Could not find requested subjects." });
      }
      return res.json(subjects);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subjects.",
        errorMsg: e,
      });
    }
  );
});

// @route   GET subjects/:userId/subjectId
// @desc    Gets a specific subject of a user
// @access  Private
router.get("/:userId/:subjectId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const ref = db.ref(`/subjects/${userId}/${subjectId}`);

  ref.once(
    "value",
    (subject) => {
      if (!subject.exists()) {
        return res.json({ msg: "Could not find requested subject." });
      }
      return res.json(subject);
    },
    (e) => {
      return res.json({
        msg: "Error while trying to fetch requested subject.",
        errorMsg: e,
      });
    }
  );
});

// @route   POST subjects/:userId
// @desc    Adds a subject to the database
// @access  Private
router.post("/:userId", auth, (req, res) => {
  const db = admin.database();
  const { userId } = req.params;
  const { name, teacher, colorCode } = req.body;

  if (!name || !teacher || !colorCode) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const subject = new Subject(name, teacher, colorCode);
  const key = db.ref(`subjects/${userId}`).push().key;
  subject.id = key;

  const ref = db.ref(`subjects/${userId}/${key}`);

  try {
    ref.set(subject);
    res.status(201).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, errorMsg: e });
  }
});

// @route   PUT subjects/:userId/:subjectId
// @desc    Updates an existing subject
// @access  Private
router.put("/:userId/:subjectId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;
  const { name, teacher, colorCode } = req.body;

  if (!name || !teacher || !colorCode) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const subject = new Subject(name, teacher, colorCode, subjectId);
  const ref = db.ref(`subjects/${userId}/${subjectId}`);

  ref.once("value", (snapshot) => {
    if (snapshot.exists()) {
      ref
        .update(subject)
        .then(res.status(204))
        .catch((e) => res.status(500).json({ success: false, errorMsg: e }));
    } else {
      return res.status(400).json({ msg: "Subject does not exist." });
    }
  });
});

// @route   DELETE subjects/:userId/:subjectId
// @desc    Deletes a subject and all of its lessons, tasks & exams.
// @access  Private
router.delete("/:userId/:subjectId", auth, (req, res) => {
  const db = admin.database();
  const { userId, subjectId } = req.params;

  const subjects = db.ref(`subjects/${userId}/${subjectId}`);
  const lessons = db.ref(`lessons/${userId}/${subjectId}`);
  const tasks = db.ref(`tasks/${userId}/${subjectId}`);
  const exams = db.ref(`exams/${userId}/${subjectId}`);

  try {
    subjects.set(null);
    lessons.set(null);
    tasks.set(null);
    exams.set(null);

    return res.status(204);
  } catch (e) {
    return res.status(500).json({ msg: "Error while processing your request.", errorMsg: e });
  }
});

module.exports = router;
