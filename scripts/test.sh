export FIREBASE_DATABASE_EMULATOR_HOST="localhost:9000"
export CI='true'
npx firebase emulators:exec 'mocha --timeout 10000 --exit' --only database