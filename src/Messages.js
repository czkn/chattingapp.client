import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Form} from "react-bootstrap";
import ChatDetails from "./ChatDetails";
import { HubConnectionBuilder } from '@microsoft/signalr';
import "./Messages.css"

const Messages = () => {

    const [hubConnection, setHubConnection] = useState(null);

    const[messages,setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const [sendMessageErrors, setSendMessageErrors] = useState([]);
    const[show, setShow] = useState(false)
    const [isInvalid, setIsInvalid] = useState(false);

    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        if(location.state === null) {
            navigate("/login")
            return
        }

        getMessages()
        startSignalRConnection()

        return () => {
            if (hubConnection) {
                hubConnection.stop();
                console.log("SignalR connection stopped.");
            }
        };

    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const startSignalRConnection = async () => {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:7023/chathub")
            .withAutomaticReconnect()
            .build();

        try {
            await connection.start().then( async () => {
                await connection.invoke("JoinRoom", location.state.id);
            });

            connection.on("ReceiveMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            setHubConnection(hubConnection)
        } catch (error) {
            console.error("Error establishing SignalR connection:", error);
        }
    };

    const getMessages = () => {
        axios.get("http://localhost:7023/api/Message/" + location.state.id, {withCredentials: true})
            .then(response => {
                if(response.status === 200) {
                    setMessages(response.data)
                }

            })
            .catch(error => {

            })
    }

    const sendMessage = () => {
        axios.post("http://localhost:7023/api/Message", {text: newMessage, chatId: location.state.id}, {withCredentials: true})
            .then(response => {
                if(response.status === 201) {
                    setNewMessage("");
                    setIsInvalid(false);
                }
            }).catch(error => {
            setSendMessageErrors(error.response.data.errors);
            setIsInvalid(true);
            })
    };

    const scrollToBottom = () => {
        const chatContainer = document.querySelector(".msger-chat");
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    return (
        <section className="msger">
            <header className="msger-header">
                <div className="msger-header-title">
                    Chat  {location.state.name}
                </div>
                <div className="msger-header-options">
                    <ChatDetails show={show} setShow={setShow} chat ={location.state}/>
                </div>
            </header>
            <main className="msger-chat">
                {messages.map((message) => (
                    <div className="msg left-msg" key={message.id}>
                        <div className="msg-img" />

                        <div className="msg-bubble">
                            <div className="msg-info">
                                <div className="msg-info-name">{message.sentByName}</div>
                                <div className="msg-info-time">{message.sentAt.substring(11, 16)} {message.sentAt.substring(0, 10)}</div>
                            </div>

                            <div className="msg-text">
                                {message.text}
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <Form.Group controlId="formMessage" className="msger-inputarea">
                <input
                    type="text"
                    className="msger-input"
                    placeholder="Enter your message..."
                    required
                    value={newMessage}
                    name="newMessage"
                    onChange={(event) => setNewMessage(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            sendMessage();
                        }
                    }}
                />
                <Button type="submit" onClick={sendMessage} style={{ marginLeft: 10 }} variant="success">Send</Button>
            </Form.Group>
        </section>
    );
}

export default Messages;