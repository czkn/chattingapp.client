import {ToggleButton} from "react-bootstrap";

const ChatsToggleButton = (props) => {
  return(
          <div className="buttons-container">
              {props.radios.map((radio, idx) => (
                  <ToggleButton
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant="outline-light"
                      name="radio"
                      value={radio.value}
                      checked={props.radioValue === radio.value}
                      className="radio-jobs"
                      onChange={(e) => props.setRadioValue(e.currentTarget.value)}
                      onClick={props.handleGetChats}
                  >
                      {radio.name}
                  </ToggleButton>
              ))}
          </div>

  )
}

export default ChatsToggleButton;