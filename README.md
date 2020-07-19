# API of the MyStudiez apps.

This repository contains the API of the MyStudiez platform.

## Tech used

Our backend uses Node.js and Firebase to serve our frontend on all of our platforms.

### Installation

After you forked and cloned the repository, run `npm i` and create a `secrets` folder and a `.env` file. You can find out how you need to set up your own .env file in **`example.env`**.

In order to run this application you must have a Firebase project set up. If you are logged in to your Google account, you can easily add a new project in [Firebase Console](https://console.firebase.google.com). Once you've done that, you need to **generate a private key file** from Firebase Console. (In Firebase Console: Project Settings -> Service accounts -> Generate new private key) and put it under api\secrects\, the folder you previously created, so the path to the file would look like this: `api\secrets\service-account-file.json`. After that, you're ready to develop!

### Setting up testing environment

We're testing our code with the Mocha testing framework and Chai assertion library. Firebase Emulators provide our test databases. In order to set up Firebase Emulators, you must install Firebase CLI either globally with `npm i -g firebase-tools`, or if you are using npm 5.2 or higher, you can simply use `npx` to run the packages globally. In order to set up the emulators correctly, you'll need `Node.js 8.6.0 or higher` and `Java 7 or higher`. You can check your Node version with `node --version` and your Java version with `java --version`.
Once you've installed everything that is needed, run `firebase login`. After you log in, run `firebase init`. Select the features you want to set up in the project's folder (_Emulators_), select the emulators you want to install (_Database_), select whether you want to install the Emulator UI (recommended), and that's it!. You can start the emulator(s) with `firebase emulators:start`

### Docs

- [Node.js](https://nodejs.org/en/docs/)
- [Firebase](https://firebase.google.com/docs)
- [Setting up the Firebase emulators](https://firebase.google.com/docs/rules/emulator-setup)
- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)

## API routes

You have to be **logged in** to your account, in order to successfully send a request to any of the following routes:

### Subjects

To retrieve

- All subjects: Make a **GET** request to `/subjects/:userId`
- A specific subject: Make a **GET** request to `/subjects/:userId/:subjectId`

To add a subject:

- Make a **POST** request to `/subjects/:userId`
- The request's body should include:
  - `name`: Name of the subject
  - `teacher`: Name of the subject's teacher
  - `colorCode`: Subject will be marked with this color

To edit a subject:

- Make a **PUT** request to `/subjects/:userId/:subjectId`
- The request's body should include:
  - All fields of the subject you want to edit (with the new values)
  - If you decide not to change something, you have to include the old, unchanged values

To delete a subject:

- Make a **DELETE** request to: `subjects/:userId/:subjectId`
  - This will also delete all lessons, tasks & exams that have the specified `subjectId`

### Lessons

To retrieve

- All lessons: Make a **GET** request to `/lessons/:userId`
- A specific subject's lessons: Make a **GET** request to `/lessons/:userId/:subjectId`
- A specific lesson: Make a **GET** request to `/lessons/:userId/:subjectId/:lessonId`

To add a lesson:

- Make a **POST** request to `/lessons/:userId`
- The request's body should include:
  - `subjectId`: ID of the lesson's subject
  - `week`: Represents whether the lesson is on Week A or B
  - `day`: Day of the lesson stored as an integer, 1: Sunday - 7: Saturday
  - `starts`: Time when lesson starts (format: HH:mm {string})
  - `ends`: Time when lesson ends(format: HH:mm {string})
  - `location`: Location of the lesson

To edit a lesson:

- Make a **PUT** request to `lessons/:userId/:subjectId/:lessonId`
- The request's body should include:
  - All fields of the lesson you want to edit (with the new values)
  - If you decide not to change something, you have to include the old, unchanged values

To delete a lesson:

- Make a **DELETE** request to `lessons/:userId/:subjectId/:lessonId`

### Tasks

To retrieve

- All tasks: Make a **GET** request to `/tasks/:userId`
- A specific subject's tasks: Make a **GET** request to `/tasks/:userId/:subjectId`
- A specific task: Make a **GET** request to `/tasks/:userId/:subjectId/:taskId`

To add a task:

- Make a **POST** request to `/tasks/:userId`
- The request's body should include:
  - `name`: Name of the task
  - `description`: Description of the task (optional)
  - `type`: Type of the task, either assignment (1) or revision (2)
  - `subjectId`: ID of the task's subject
  - `dueDate`: Due date of the task (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z)
  - `reminder`: Date of reminder (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z, optional)

To edit a task:

- Make a **PUT** request to `tasks/:userId/:subjectId/:taskId`
- The request's body should include:
  - All fields of the task you want to edit (with the new values)
  - If you decide not to change something, you have to include the old, unchanged values

To delete a task:

- Make a **DELETE** request to: `tasks/:userId/:subjectId/:taskId`

### Exams

To retrieve

- All exams: Make a **GET** request to `/exams/:userId`
- A specific subject's exams: Make a **GET** request to `/exams/:userId/:subjectId`
- A specific exam: Make a **GET** request to `/exams/:userId/:subjectId/:examId`

To add an exam:

- Make a **POST** request to `/exams/:userId`
- The request's body should include:
  - `name`: Name of the exam
  - `description`: A short description, notes (optional)
  - `subjectId`: ID of the exam's subject
  - `dueDate`: The date of the exam (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z)
  - `reminder`: Date of reminder (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z, optional)

To edit an exam:

- Make a **PUT** request to `exams/:userId/:subjectId/:examId`
- The request's body should include:
  - All fields of the exam you want to edit (with the new values)
  - If you decide not to change something, you have to include the old, unchanged values

To delete an exam:

- Make a **DELETE** request to: `exams/:userId/:subjectId/:examId`
