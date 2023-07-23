import {Route, Routes} from "react-router-dom";
import Login from "./Login";
import ListOfChats from "./ListOfChats";
import Register from "./Register";
import axios from "axios";
import {useEffect, useState} from "react";
import Messages from "./Messages";

function AppRouter() {

    const[loggedInUserStatusCode, setLoggedInUserStatusCode] = useState(404);

    const checkIsUserLoggedIn = () => {
        axios.get("http://localhost:7023/api/User/IsUserLoggedIn", {withCredentials: true})
            .then(response => {
                setLoggedInUserStatusCode(response.status)
            })
            .catch(error => {
                setLoggedInUserStatusCode(error.status)
            })
    }

    useEffect(() => {
        checkIsUserLoggedIn()

        return () => {

        };
    }, [])

    return (
        <Routes>
            <Route path={"/"} element={<Login />} />
            <Route path={"/login"} element={<Login loggedInUserStatusCode = {loggedInUserStatusCode} /> } />
            <Route path={"/register"} element={<Register loggedInUserStatusCode = {loggedInUserStatusCode} />} />
            <Route path={"/listOfChats"} element={<ListOfChats loggedInUserStatusCode = {loggedInUserStatusCode} />} />
            <Route path={"/messages"} element={<Messages loggedInUserStatusCode = {loggedInUserStatusCode} />} />
        </Routes>
    );
}

export default AppRouter;