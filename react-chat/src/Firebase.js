import * as firebase from 'firebase';
//import firestore from 'firebase/firestore';

const settings = {
    timestampsInSnapshots: true
};

const config = {
    projectId: 'Your firebase project id',
    apiKey: 'your api key',
    databaseURL: 'your db url duh'
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;