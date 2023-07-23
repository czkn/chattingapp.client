import {Button, Form} from "react-bootstrap";
import AlertInvalidCredentials from "./AlertInvalidCredentials";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Register = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [isInvalid, setIsInvalid] = useState(false);
    const [registerUserStatusCode, setRegisterUserStatusCode] = useState(500);
    const [registerUserErrors, setRegisterUserErrors] = useState([]);
    const [isUserCreationFailed, setIsUserCreationFailed] = useState(false);
    const [userCreationFailReason, setUserCreationFailReason] = useState(false);
    const [isUserCreated, setIsUserCreated] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        if(props.loggedInUserStatusCode === 200) {
            navigate("/listOfChats")
        }
    }, [props.loggedInUserStatusCode]);

    useEffect(() => {
        if(registerUserStatusCode === 201) {
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setIsInvalid(false)
            setIsUserCreated(true)
            setTimeout(() => setIsUserCreated(false), 5000)
        }
    }, [registerUserStatusCode])

    const registerUser = () => {
        axios.post("http://localhost:7023/api/User/register", {
            email: email,
            password: password,
            firstName: firstName,
            lastName: lastName })
            .then(response => setRegisterUserStatusCode(response.status))
            .catch(error => {
                switch (error.response.status) {
                    case 400:
                        setRegisterUserErrors(error.response.data.errors);
                        setIsInvalid(true);
                        break;
                    case 409:
                    case 500:
                        setUserCreationFailReason(error.response.data.message);
                        setIsUserCreationFailed(true);
                        setTimeout(() => setIsUserCreationFailed(false), 5000)
                        break;
                    default:
                        console.log(`Unhandled error code: ${error.response.status}`);
                        break;
                }
            })
    }

    return(
        <>
            <div className="default-container-register">
                <Form validated={isInvalid}>
                    <Form.Group controlId="formEmail">
                        <Form.Label className={"signup-form-label"}>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Please enter your Email"
                            required
                            value={email}
                            name={"email"}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {registerUserErrors.Email !== undefined && registerUserErrors.Email[0]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label className={"signup-form-label"}>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Please enter your Password"
                            required
                            value={password}
                            name={"password"}
                            onChange={(event) => setPassword(event.target.value)}
                            minLength={"15"}
                        />
                        <Form.Control.Feedback type="invalid">
                            {registerUserErrors.Password !== undefined && registerUserErrors.Password[0]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={"signup-form-label"}>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Please enter your First Name"
                            required
                            value={firstName}
                            name={"firstName"}
                            onChange={(event) => setFirstName(event.target.value)}
                            pattern=".{1,30}"
                        />
                        <Form.Control.Feedback type="invalid">
                            {registerUserErrors.FirstName !== undefined && registerUserErrors.FirstName[0]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className={"signup-form-label"}>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Please enter your Last Name"
                            required
                            value={lastName}
                            name={"lastName"}
                            onChange={(event) => setLastName(event.target.value)}
                            pattern=".{1,60}"
                        />
                        <Form.Control.Feedback type="invalid">
                            {registerUserErrors.LastName !== undefined && registerUserErrors.LastName[0]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                        <Button onClick={registerUser} className={"signup-button"}>
                            Register
                        </Button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label
                            style={{color: "white", display: "flex", justifyContent: "center", marginTop: 15}}>
                            <a onClick={() => navigate("/login")}
                               style={{textDecoration: "underline", marginLeft: 5 , cursor: "pointer", color: "#007bff"}}> Back to Login</a>
                        </Form.Label>
                    </Form.Group>
                </Form>
            </div>
            {isUserCreationFailed && <AlertInvalidCredentials variant={"danger"} credentials={userCreationFailReason}/>}
            {isUserCreated && <AlertInvalidCredentials variant={"success"} credentials ={"New account created"}/>}
        </>
    )

}

export default Register;