import {Button, Form} from "react-bootstrap";
import {useState, useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import AlertInvalidCredentials from "./AlertInvalidCredentials";

const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isInvalid, setIsInvalid] = useState(false);
    const [loginUserStatusCode, setLoginUserStatusCode] = useState(400);
    const [loginUserErrors, setLoginUserErrors] = useState([]);
    const [invalidEmailOrPassword, setInvalidEmailOrPassword] = useState("");
    const [isEmailOrPasswordInvalid, setIsEmailOrPasswordInvalid] = useState(false);

    const navigate = useNavigate()


    useEffect(() => {
        if(props.loggedInUserStatusCode === 200) {
            navigate("/listOfChats")
            return
        }
    }, [props.loggedInUserStatusCode]);

    useEffect(() => {
        if(loginUserStatusCode === 200) {
            navigate("/listOfChats")
        }
    }, [loginUserStatusCode])

    const loginUser = () => {
        axios.post("http://localhost:7023/api/User/login", {
            email: email,
            password: password }, {withCredentials: true})
            .then(response => setLoginUserStatusCode(response.status))
            .catch(error => {
                switch (error.response.status) {
                    case 400:
                        setLoginUserErrors(error.response.data.errors);
                        setIsInvalid(true);
                        break;
                    case 401:
                        setInvalidEmailOrPassword(error.response.data.message);
                        setIsEmailOrPasswordInvalid(true)
                        setTimeout(() => setIsEmailOrPasswordInvalid(false), 5000)
                        break;
                    default:
                        console.log(`Unhandled error code: ${error.response.status}`);
                        break;
                }
            })
    }

    return(
        <>
            <div className={"default-container-login"}>
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
                            {loginUserErrors.Email !== undefined && loginUserErrors.Email[0]}
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
                            minLength={"8"}
                        />
                        <Form.Control.Feedback type="invalid">
                            {loginUserErrors.Password !== undefined && loginUserErrors.Password[0]}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group style={{display: "flex", justifyContent: "center", marginTop: 20}}>
                        <Button onClick={loginUser} className={"signup-button"}>
                            Log in
                        </Button>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label
                            style={{color: "white", display: "flex", justifyContent: "center", marginTop: 15}}>Don't have an account?
                            <a onClick={() => navigate("/register")}
                               style={{textDecoration: "underline", marginLeft: 5 , cursor: "pointer", color: "#007bff"}}> Sign up</a>
                        </Form.Label>
                    </Form.Group>
                </Form>
            </div>
            {isEmailOrPasswordInvalid && <AlertInvalidCredentials variant={"danger"} credentials={invalidEmailOrPassword}/>}
        </>
    )
}

export default Login;