import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import IconButton from "@mui/material/IconButton";

import "./history.css";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);

  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);

        const history = await getHistoryOfUser();

        console.log("HISTORY IN COMPONENT:", history);

        if (Array.isArray(history)) {
          setMeetings(history);
        } else {
          setMeetings([]);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getHistoryOfUser]);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Unknown date";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const day = date
      .getDate()
      .toString()
      .padStart(2, "0");

    const month = (date.getMonth() + 1)
      .toString()
      .padStart(2, "0");

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="history-navbar">
        <IconButton
          onClick={() => {
            routeTo("/home");
          }}
        >
          <HomeIcon className="home-icon" />
        </IconButton>
      </div>

      {loading ? (
        <h3>Loading History...</h3>
      ) : meetings.length > 0 ? (
        meetings.map((meeting) => (
          <Card
            key={meeting._id}
            variant="outlined"
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Code: {meeting.meeting_id}
              </Typography>

              <Typography
                sx={{ mb: 1.5 }}
                color="text.secondary"
              >
                Date: {formatDate(meeting.date)}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <h3>No History Yet</h3>
      )}
    </div>
  );
}
