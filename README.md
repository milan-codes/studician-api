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

To add a subject: Make a **POST** request to `/subjects/:userId`

The request's body should include:

- `name`: Name of the subject
- `teacher`: Name of the subject's teacher
- `colorCode`: Subject will be marked with this color

### Lessons

To retrieve

- All lessons: Make a **GET** request to `/lessons/:userId`
- A specific subject's lessons: Make a **GET** request to `/lessons/:userId/:subjectId`
- A specific lesson: Make a **GET** request to `/lessons/:userId/:subjectId/:lessonId`

To add a lesson: Make a **POST** request to `/lessons/:userId`

The request's body should include:

- `subjectId`: ID of the lesson's subject
- `week`: Represents whether the lesson is on Week A or B
- `day`: Day of the lesson stored as an integer, 1: Sunday - 7: Saturday
- `starts`: Time when lesson starts (format: HH:mm {string})
- `ends`: Time when lesson ends(format: HH:mm {string})
- `location`: Location of the lesson

### Tasks

To retrieve

- All tasks: Make a **GET** request to `/tasks/:userId`
- A specific subject's tasks: Make a **GET** request to `/tasks/:userId/:subjectId`
- A specific task: Make a **GET** request to `/tasks/:userId/:subjectId/:taskId`

To add a task: Make a **POST** request to `/tasks/:userId`

The request's body should include:

- `name`: Name of the task
- `description`: Description of the task (optional)
- `type`: Type of the task, either assignment (1) or revision (2)
- `subjectId`: ID of the task's subject
- `dueDate`: Due date of the task (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z)
- `reminder`: Date of reminder (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z, optional)

### Exams

To retrieve

- All exams: Make a **GET** request to `/exams/:userId`
- A specific subject's exams: Make a **GET** request to `/exams/:userId/:subjectId`
- A specific exam: Make a **GET** request to `/exams/:userId/:subjectId/:examId`

To add an exam: Make a **POST** request to `/exams/:userId`

The request's body should include:

- `name`: Name of the exam
- `description`: A short description, notes (optional)
- `subjectId`: ID of the exam's subject
- `dueDate`: The date of the exam
- `reminder`: Date of reminder (Use the format emitted by `Date`'s `toJSON` method: eg.: 2020-01-01T00:00:43.511Z, optional)
