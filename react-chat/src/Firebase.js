import * as firebase from 'firebase';
//import firestore from 'firebase/firestore';

const settings = {
    timestampsInSnapshots: true
};

const config = {
    projectId: 'react-chat-ecbb1',
    apiKey: 'AIzaSyCnYXKRf8AHhfB0wQU0jybXdiAOvHXeKb4',
    databaseURL: 'https://react-chat-ecbb1.firebaseio.com'
};

firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;