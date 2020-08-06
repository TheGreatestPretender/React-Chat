import * as firebase from 'firebase';
//import firestore from 'firebase/firestore';

const settings = {
    timestampsInSnapshots: true
};

const config = {
    projectId: 'your project id',
    apiKey: 'your api key',
    databaseURL: 'your db url'
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;
