import React, { useState, useEffect } from 'react';
import {
    useHistory,
    useParams
  } from "react-router-dom";
import {
    Container, 
    Row, 
    Col,
    Card,
    CardBody,
    CardSubtitle,
    Button,
    Form,
    InputGroup,
    Input,
    InputGroupAddon
} from 'reactstrap';
import Moment from 'moment';
import firebase from '../Firebase';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../Styles.css';

function ChatRoom(props) {
    
    const [chats, setChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [nickname, setNickname] = useState('');
    const [roomname, setRoomname] = useState('');
    const [newChat, setNewChat] = useState({
        roomname: '',
        nickname: '',
        message: '',
        date: '',
        type: ''
    });
    const history = useHistory();
    const { room } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setNickname(localStorage.getItem('nickname'));
            setRoomname(room);

            firebase.database().ref('chats/').orderByChild('roomname').equalTo(roomname).on('value', resp => {
                setChats([]);
                setChats(snapshotToArray(resp));
            })
        }
        fetchData();
    }, [room, roomname]);

    useEffect(() => {
        const fetchData = async() => {
            setNickname(localStorage.getItem('nickname'));
            setRoomname(room);

            firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).on('value', (resp2) => {
                setUsers([]);

                const roomUsers = snapshotToArray(resp2);
                setUsers(roomUsers.filter(x => x.status === 'online'));
            })
        }
        fetchData();
    }, [room, roomname]);

    const snapshotToArray = (snapshot) => {
        const retArr = [];
        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            item.key = childSnapshot.key;
            retArr.push(item);
        });

        return retArr;
    };

    const submitMessage = (e) => {
        e.preventDefault();

        const chat = newChat;
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('MM/DD/YYYY hh:mm:ss');
        chat.type = 'message';

        const newMessage = firebase.database().ref('chats/').push();
        newMessage.set(chat);

        setNewChat({
            roomname: '',
            nickname: '',
            message: '',
            date: '',
            type: ''
        });
    }
    
    const onChange = (e) => {
        e.persist();
        setNewChat({
            ...newChat,
            [e.target.name]: e.target.value
        });
    };

    const exitChat = (e) => {
        const chat = {
            roomname: '',
            nickname: '',
            message: '',
            date: '',
            type: ''
        };
        chat.roomname = roomname;
        chat.nickname = nickname;
        chat.date = Moment(new Date()).format('MM/DD/YYYY HH:mm:ss');
        chat.message = `${nickname} has left the room`;
        chat.type = 'exit';

        const newMessage = firebase.database().ref('chats/').push();

        firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(roomname).once('value', (resp) => {
            let roomuser = [];
            roomuser = snapshotToArray(resp);

            const user = roomuser.find(x => x.nickname === nickname);

            if (user !== undefined) {
                const userRef = firebase.database().ref('roomusers/' + user.key);
                userRef.update({status: 'offline'}); 
            }
        });

        history.goBack();
    };

    return (
        <div className="Container">
            <Container>
                <Row>
                    <Col xs="4">
                        <div>
                            <Card className="UserCard">
                                <CardBody>
                                    <CardSubtitle>
                                        <Button
                                            variant='primary'
                                            type='button'
                                            onClick={() => {exitChat()}}>
                                                Exit Chat
                                        </Button>
                                    </CardSubtitle>
                                </CardBody>
                            </Card>

                            {users.map((item, index) => (
                                <Card 
                                    key={index}
                                    className="UserCard">
                                        <CardBody>
                                            <CardSubtitle>
                                                {item.nickname}
                                            </CardSubtitle>
                                        </CardBody>
                                </Card>
                            ))}
                        </div>
                    </Col>

                    <Col xs='8'>
                        <ScrollToBottom 
                            className='ChatContent'>
                                {chats.map((item, index) => (
                                    <div 
                                        key={index}
                                        className='MessageBox'
                                        >
                                            {item.type === 'join' || item.type === 'exit' ?
                                            <div className='ChatStatus'>
                                                <span className="ChatDate">{item.date}</span>
                                                <span className='ChatContentCenter'>{item.message}</span>
                                            </div> :
                                            <div className='ChatMessage'>
                                                <div className={`${item.nickname === nickname ? "RightBubble": "LeftBubble"}`}>
                                                    {item.nickname === nickname ? 
                                                        <span className="MessageName">Me</span>
                                                        :
                                                        <span className="MessageName">{item.nickname}</span>
                                                    }
                                                    <span className='MessageDate'> at {item.date} </span>
                                                    <p>{item.message}</p>

                                                </div>
                                            </div>
                                                } 
                                        </div>
                                ))}
                            </ScrollToBottom>
                            <footer className="StickyFooter">
                                <Form 
                                    className="MessageForm"
                                    onSubmit={submitMessage}>
                                        <InputGroup>
                                        <Input 
                                            type='text'
                                            name='message'
                                            id='message'
                                            placeholder='Enter message here'
                                            value={newChat.message}
                                            onChange={onChange}
                                        />
                                            <InputGroupAddon addonType="append">
                                                <Button 
                                                    variant='primary'
                                                    type='submit'
                                                >
                                                    Send
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                </Form>
                            </footer>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default ChatRoom;