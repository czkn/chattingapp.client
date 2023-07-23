import axios from "axios";
import {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Container, Form, ListGroup, Modal, Row} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import ChatsToggleButton from "./ChatsToggleButton";
import AlertInvalidCredentials from "./AlertInvalidCredentials";

const ListOfChats = (props) => {

    const[chats,setChats] = useState([]);
    const[selectedChat, setSelectedChat] = useState("");
    const[radioValue,setRadioValue] = useState('1')
    const[show, setShow] = useState(false)
    const[name, setName] = useState("")
    const[createChatErrors, setCreateChatErrors] = useState("")
    const[joinChatErrors, setJoinChatErrors] = useState("")
    const[isJoinChatFailed, setIsJoinChatFailed] = useState(false)
    const[isInvalid, setIsInvalid] = useState(false);

    const radios = [
        { name: 'My chats', value: '1' },
        { name: 'Public Chats', value: '2' },
    ];

    const navigate = useNavigate()

    useEffect(() => {
        handleGetChats()
    }, [radioValue])

    useEffect(() => {
        if(props.loggedInUserStatusCode === 404) {
            navigate("/login")
            return
        }
    }, [props.loggedInUserStatusCode]);

    const getOpenChats = () => {
    axios.get("http://localhost:7023/api/Chat/OpenChats", {withCredentials: true})
        .then(response => {
            setChats(response.data)
        })
        .catch(error => {
          return error.status
        })
  }

    const getYourChats = () => {
        axios.get("http://localhost:7023/api/Chat/YourChats", {withCredentials: true})
            .then(response => {
                setChats(response.data)
            })
            .catch(error => {
                return error.status
            })
    }

    const signOut = () => {
        axios.post("http://localhost:7023/logout", {}, {withCredentials: true})
            .then(response => {
                navigate("/login")
            }).catch(error => error.status);
    }

    const createChat = () => {
        axios.post("http://localhost:7023/api/Chat", {name: name}, {withCredentials: true})
            .then(response => {
                if(response.status === 201) {
                    setName("");
                    handleGetChats()
                }
            }).catch(error => {
                        switch (error.response.status) {
                            case 400:
                                setCreateChatErrors(error.response.data.errors);
                                setIsInvalid(true);
                                break;
                            default:
                                console.log(`Unhandled error code: ${error.response.status}`);
                                break;
                        }
                    })
    }

    const handleGetChats = () => {
        if(radioValue === '1') getYourChats()
        if(radioValue === '2') getOpenChats()
    }

    const handleJoinChat = () => {
        axios.patch("http://localhost:7023/api/Chat/JoinChat/" + selectedChat.id, {}, {withCredentials: true})
            .then(response => { if(response.status === 204) getYourChats(); setRadioValue('1') })
            .catch(error => {
                setJoinChatErrors(error.response.data)
                setIsJoinChatFailed(true)
                setTimeout(() => setIsJoinChatFailed(false), 5000)
            })
    }

    const handleOpenChat = () => {
        navigate("/messages", {state: selectedChat})
    }

    return (
        <>
            <div className={"default-container-chats"}>

                <ButtonGroup className="d-flex justify-content-between">
                    <ChatsToggleButton radios={radios} radioValue={radioValue} setRadioValue={setRadioValue} handleGetChats={handleGetChats}/>
                    <Button onClick={signOut} variant="secondary" >Sign out</Button>
                </ButtonGroup>

                <Container style={{color: "white"}}>
                    <Row>
                        <Col xs={4}>
                            {radioValue === '1' ? <h2>My Chats</h2> : <h2>Public Chats</h2>}
                            <ListGroup>
                                {chats.map((chat) => (
                                    <ListGroup.Item
                                        key={chat.id}
                                        active={chat.id === selectedChat.id}
                                        onClick={() => setSelectedChat(chat)}
                                        action
                                    >
                                        {chat.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>
                    </Row>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                        <Button disabled={!selectedChat} variant={"success"} style={{width: 150, borderRadius: 30 }} onClick={() => {
                            radioValue === '1' ? handleOpenChat() : handleJoinChat() }} >{radioValue === '1' ? 'Open chat' : 'Join chat'}</Button>

                        <Button className="signup-button" onClick={() => setShow(true)}>Create a new chat</Button>
                    </div>

                </Container>

                <Modal show={show} onHide={() => { setShow(false); setName("") } } >
                    <Modal.Header>
                        <Form validated={isInvalid}>
                            <Form.Group controlId="formEmail">
                                <h3 style={{color: "black"}}>Chat name</h3>
                                <Form.Control
                                    type="text"
                                    placeholder="Please enter chat name"
                                    required
                                    value={name}
                                    name={"chatName"}
                                    onChange={(event) => setName(event.target.value)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {createChatErrors.Name !== undefined && createChatErrors.Name[0]}
                                </Form.Control.Feedback>
                                <Button className={"signup-button"} onClick={createChat} style={{width: 150}} >Create</Button>
                            </Form.Group>
                        </Form>
                    </Modal.Header>
                </Modal>
            </div>
        {isJoinChatFailed && <AlertInvalidCredentials variant={"danger"} credentials={joinChatErrors}/>}
        </>
    );

}

export default ListOfChats;