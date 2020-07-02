# API of the MyStudiez apps.

This repository contains the API of the MyStudiez platform.

## Tech used

Our backend uses Node.js and Firebase to serve our frontend on all of our platforms.

### Installation

After you forked and cloned the repository, run `npm i` and create a `secrets` folder and a `.env` file. You can found out how you need to set up your own .env file in **`example.env`**.

In order to run this application you must have a Firebase project set up. If you are logged in to your Google account, you can easily add a new project in [Firebase Console](https://console.firebase.google.com). Once you've done that, you need to **generate a private key file** from Firebase Console. (In Firebase Console: Project Settings -> Service accounts -> Generate new private key) and put it under api\secrects\, the folder you previously created, so the path to the file would look like this: `api\secrets\service-account-file.json`. After that, you're ready to develop!

### Docs

- [Node.js](https://nodejs.org/en/docs/)
- [Firebase](https://firebase.google.com/docs)

## API routes

You have to be **logged in** to your account, in order to successfully send a request to any of the following routes:

### Subjects

To retrieve

- All subjects: Make a **GET** request to `/subjects/:userId`
- A specific subject: Make a **GET** request to `/subjects/:userId/:subjectId`

### Lessons

To retrieve

- All lessons: Make a **GET** request to `/lessons/:userId`
- A specific subject's lessons: Make a **GET** request to `/lessons/:userId/:subjectId`
- A specific lesson: Make a **GET** request to `/lessons/:userId/:subjectId/:lessonId`

### Tasks

To retrieve

- All tasks: Make a **GET** request to `/tasks/:userId`
- A specific subject's tasks: Make a **GET** request to `/tasks/:userId/:subjectId`
- A specific task: Make a **GET** request to `/tasks/:userId/:subjectId/:taskId`

### Exams

To retrieve

- All exams: Make a **GET** request to `/exams/:userId`
- A specific subject's exams: Make a **GET** request to `/exams/:userId/:subjectId`
- A specific exam: Make a **GET** request to `/exams/:userId/:subjectId/:examId`
