const express = require('express');
const admin = require('firebase-admin');
const bp = require('body-parser');
const app = express();

require('dotenv').config();

// Bodyparser middleware
app.use(bp.json());
app.use(express.json());

// Setting up Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

app.use('/subjects', require('./routes/subjects'));
app.use('/lessons', require('./routes/lessons'));
app.use('/tasks', require('./routes/tasks'));
app.use('/exams', require('./routes/exams'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}...`));

module.exports = app;
