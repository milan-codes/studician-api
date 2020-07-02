const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("./secrets/serviceAccount.json");

const app = express();
require("dotenv").config();

// Bodyparser middleware
app.use(express.json());

// Setting up Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

app.use("/subjects", require("./routes/subjects"));
app.use("/lessons", require("./routes/lessons"));
app.use("/tasks", require("./routes/tasks"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}...`));
