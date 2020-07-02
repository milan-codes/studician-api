const admin = require("firebase-admin");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

// @route   GET subjects/:id
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

// @route   GET subjects/:id/subjectId
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
        error: e,
      });
    }
  );
});

module.exports = router;
