import { useNavigate } from "react-router-dom";
import withAuth from "../utils/withAuth";
import { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FaHistory } from "react-icons/fa";
import "./HomeComponent.css";

// import {addToUserHistory} from "../context/AuthContext"
import { AuthContext } from "../context/AuthContext";

const HomeComponent = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const { addToUserHistory } = useContext(AuthContext);

  let navigate = useNavigate();

  let handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  const handeleNavigaet = () => {
    navigate("/history");
  };

  return (
    <>
      <div className="navbar">
        <div>
          <h3>MeetHub</h3>
        </div>

        <div onClick={handeleNavigaet} className="navbar-links">
          <div className="history-block">
            <FaHistory className="history-icon" />
            <p>History </p>
          </div>

          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Call Just like Quality Education</h2>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                margin: "1rem",
              }}
            >
              <TextField
                label="Enter Code"
                onChange={(e) => setMeetingCode(e.target.value)}
              />
              <Button variant="contained" onClick={handleJoinVideoCall}>
                Join
              </Button>
            </div>
          </div>
        </div>

        <div className="rightPanel">
          <img src="./logo3.png" alt="Join Video Call Photo" />
        </div>
      </div>
    </>
  );
};

export default withAuth(HomeComponent);
