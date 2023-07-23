import {Button, Form, Modal} from "react-bootstrap";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AlertInvalidCredentials from "./AlertInvalidCredentials";
import {CiSettings} from "react-icons/ci";
import {FiSettings} from "react-icons/fi";
import {IoMdSettings} from "react-icons/io";

const ChatDetails = (props) => {

    const[chatStatus, setChatStatus] = useState()
    const[chatUsers, setChatUsers] = useState([])
    const[deleteOrEditChatErrors, setDeleteOrEditChatErrors] = useState("")
    const[isDeleteOrEditChatFailed, setIsDeleteOrEditChatFailed] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getYourChats()
    }, [])

    const deleteChat = () => {
        axios.delete("http://localhost:7023/api/Chat/" + props.chat.id, {withCredentials: true})
            .then(() => navigate("/listOfChats"))
            .catch(error => {
                if(error.response.status === 400) {
                    setDeleteOrEditChatErrors(error.response.data)
                    setIsDeleteOrEditChatFailed(true)
                    setTimeout(() => setIsDeleteOrEditChatFailed(false), 5000)
                }

            })
    }

    const changeChatStatus = () => {
      axios.patch("http://localhost:7023/api/Chat/" + props.chat.id, {}, {withCredentials: true})
          .then(response => {
              if(response.status === 204) setChatStatus(prevState => !prevState)
          })
          .catch(error => {
              if(error.response.status === 400) {
                  setDeleteOrEditChatErrors(error.response.data)
                  setIsDeleteOrEditChatFailed(true)
                  setTimeout(() => setIsDeleteOrEditChatFailed(false), 5000)
              }

          })
    }

    const displayChatStatus = () => {
      if(chatStatus === true) return "public"

        return "private"
    }

    const getYourChats = () => {
        axios.get("http://localhost:7023/api/Chat/YourChats", {withCredentials: true})
            .then(response => {
                if(response.status === 200) {
                    const currentChat = response.data.filter(chat => chat.id === props.chat.id)
                    setChatStatus(currentChat[0].canPeopleJoin)
                }
            })
            .catch(error => {return error.status})
    }
    
    const getChatUsers = () => {
        axios.get("http://localhost:7023/api/User/" + props.chat.id, {withCredentials: true})
            .then(response => {
                if(response.status === 200) setChatUsers(response.data)
            })
            .catch(error => {return error.status})
    }

  return(
      <>
      <IoMdSettings onClick={() => props.setShow(true)} style={{cursor: "pointer"}}>  Chat Details </IoMdSettings>
          <Modal show={props.show} onHide={() => { props.setShow(false); setChatUsers([]) }}>
              <Modal.Header>
                  {props.chat.name} - this chat is currently {displayChatStatus()}
              </Modal.Header>
              <Modal.Body>
                  <Button variant={"danger"} onClick={deleteChat} style={{width: 150}}>Delete chat</Button>
              </Modal.Body>

              <Modal.Body>
                  <Button onClick={changeChatStatus}>Change chat status</Button>
              </Modal.Body>

              <Modal.Body>
                  <Button onClick={getChatUsers}>Show chat users</Button>
                  {chatUsers.map((user) => (
                      <p>{user.firstName} {user.lastName}</p>
                  ))}
              </Modal.Body>
              {isDeleteOrEditChatFailed && <AlertInvalidCredentials variant={"danger"} credentials={deleteOrEditChatErrors}/>}
          </Modal>
      </>
  )
}

export default ChatDetails;