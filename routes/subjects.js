const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
const Subject = require("../models/Subject");
const { registerVersion } = require("firebase");
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

  if (!req.body.name || !req.body.teacher || !req.body.colorCode) {
    return res.status(400).json({ msg: "Missing parameters." });
  }

  const subject = new Subject(req.body.name, req.body.teacher, req.body.colorCode);
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

module.exports = router;
