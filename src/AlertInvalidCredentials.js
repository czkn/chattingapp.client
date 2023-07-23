import {Alert} from "react-bootstrap";

const AlertInvalidCredentials = (props) => {

    return(
        <div style={{display: "flex", justifyContent: "center"}}>
            <Alert variant={props.variant} style={{display: "flex", justifyContent: "center", width: 350}}>
                <strong>{props.credentials}</strong>
            </Alert>
        </div>
    )

}

export default AlertInvalidCredentials;