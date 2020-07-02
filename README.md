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
