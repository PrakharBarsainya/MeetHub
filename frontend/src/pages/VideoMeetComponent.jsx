import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField } from "@mui/material";
import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import server from "../enviroment";
import { AuthContext } from "../context/AuthContext";

const server_url = server;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  const { addToUserHistory } = React.useContext(AuthContext);

  const socketRef = useRef();
  const socketIdRef = useRef();
  const localVideoref = useRef();
  const videoRef = useRef([]);
  const chatRef = useRef(null);

  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);

  const [video, setVideo] = useState([]);
  const [audio, setAudio] = useState();

  const [screen, setScreen] = useState();
  const [showModal, setModal] = useState(true);
  const [screenAvailable, setScreenAvailable] = useState();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState(3);

  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getPermissions();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      Object.values(connections).forEach((connection) => {
        try {
          connection.close();
        } catch (e) {
          console.log(e);
        }
      });

      connections = {};
    };
  }, []);

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
        videoPermission.getTracks().forEach((track) => track.stop());
        console.log("Video permission granted");
      }
    } catch (error) {
      setVideoAvailable(false);
      console.log("Video permission denied");
    }

    try {
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
        audioPermission.getTracks().forEach((track) => track.stop());
        console.log("Audio permission granted");
      }
    } catch (error) {
      setAudioAvailable(false);
      console.log("Audio permission denied");
    }

    if (navigator.mediaDevices.getDisplayMedia) {
      setScreenAvailable(true);
    } else {
      setScreenAvailable(false);
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
      console.log("SET STATE HAS ", video, audio);
    }
  }, [video, audio]);

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  const getUserMediaSuccess = (stream) => {
    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;

    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      try {
        connections[id].addStream(window.localStream);

        connections[id].createOffer().then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({
                  sdp: connections[id].localDescription,
                })
              );
            })
            .catch((e) => console.log(e));
        });
      } catch (e) {
        console.log(e);
      }
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            if (localVideoref.current?.srcObject) {
              const tracks =
                localVideoref.current.srcObject.getTracks();

              tracks.forEach((track) => track.stop());
            }
          } catch (e) {
            console.log(e);
          }

          const blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);

          window.localStream = blackSilence();

          if (localVideoref.current) {
            localVideoref.current.srcObject = window.localStream;
          }

          for (let id in connections) {
            try {
              connections[id].addStream(window.localStream);

              connections[id].createOffer().then((description) => {
                connections[id]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      id,
                      JSON.stringify({
                        sdp: connections[id].localDescription,
                      })
                    );
                  })
                  .catch((e) => console.log(e));
              });
            } catch (e) {
              console.log(e);
            }
          }
        })
    );
  };

  const getUserMedia = () => {
    if (
      (video && videoAvailable) ||
      (audio && audioAvailable)
    ) {
      navigator.mediaDevices
        .getUserMedia({
          video: video && videoAvailable,
          audio: audio && audioAvailable,
        })
        .then(getUserMediaSuccess)
        .catch((e) => console.log(e));
    } else {
      try {
        if (localVideoref.current?.srcObject) {
          const tracks =
            localVideoref.current.srcObject.getTracks();

          tracks.forEach((track) => track.stop());
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
            audio: true,
          })
          .then(getDislayMediaSuccess)
          .catch((e) => console.log(e));
      }
    }
  };

  const getDislayMediaSuccess = (stream) => {
    console.log("Screen sharing started");

    try {
      if (window.localStream) {
        window.localStream.getTracks().forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;

    if (localVideoref.current) {
      localVideoref.current.srcObject = stream;
    }

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      try {
        connections[id].addStream(window.localStream);

        connections[id].createOffer().then((description) => {
          connections[id]
            .setLocalDescription(description)
            .then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({
                  sdp: connections[id].localDescription,
                })
              );
            })
            .catch((e) => console.log(e));
        });
      } catch (e) {
        console.log(e);
      }
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            if (localVideoref.current?.srcObject) {
              const tracks =
                localVideoref.current.srcObject.getTracks();

              tracks.forEach((track) => track.stop());
            }
          } catch (e) {
            console.log(e);
          }

          const blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);

          window.localStream = blackSilence();

          if (localVideoref.current) {
            localVideoref.current.srcObject = window.localStream;
          }

          getUserMedia();
        })
    );
  };

  const gotMessageFromServer = (fromId, message) => {
    const signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        if (!connections[fromId]) {
          return;
        }

        connections[fromId]
          .setRemoteDescription(
            new RTCSessionDescription(signal.sdp)
          )
          .then(() => {
            if (signal.sdp.type === "offer") {
              return connections[fromId]
                .createAnswer()
                .then((description) => {
                  return connections[fromId].setLocalDescription(
                    description
                  );
                })
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    fromId,
                    JSON.stringify({
                      sdp: connections[fromId].localDescription,
                    })
                  );
                });
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        if (!connections[fromId]) {
          return;
        }

        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  const connectToSocketServer = () => {
    console.log("Client tries to connect");

    socketRef.current = io(server_url, {
      transports: ["websocket"],
      withCredentials: false,
    });

    socketRef.current.on("connect", async () => {
      console.log(
        "Connected to socket server:",
        socketRef.current.id
      );

      socketIdRef.current = socketRef.current.id;

      /*
       * IMPORTANT:
       * Save the actual meeting code from the URL,
       * NOT the Socket.IO socket ID.
       *
       * Example:
       * http://localhost:3000/meeting/ABC123
       *
       * meetingCode = ABC123
       */

      const meetingCode = window.location.pathname
        .split("/")
        .filter(Boolean)
        .pop();

      console.log("MEETING CODE:", meetingCode);

      if (meetingCode) {
        try {
          await addToUserHistory(meetingCode);
          console.log(
            "Meeting added to history successfully"
          );
        } catch (error) {
          console.error(
            "Failed to add meeting to history:",
            error
          );
        }
      } else {
        console.error(
          "Could not determine meeting code from URL"
        );
      }

      socketRef.current.emit(
        "join-call",
        window.location.href
      );

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) =>
          videos.filter((video) => video.socketId !== id)
        );

        delete connections[id];
      });

      socketRef.current.on(
        "user-joined",
        (id, clients) => {
          clients.forEach((socketListId) => {
            if (socketListId === socketIdRef.current) {
              return;
            }

            connections[socketListId] =
              new RTCPeerConnection(
                peerConfigConnections
              );

            connections[socketListId].onicecandidate = (
              event
            ) => {
              if (event.candidate) {
                socketRef.current.emit(
                  "signal",
                  socketListId,
                  JSON.stringify({
                    ice: event.candidate,
                  })
                );
              }
            };

            connections[socketListId].onaddstream = (
              event
            ) => {
              const videoExists =
                videoRef.current.find(
                  (video) =>
                    video.socketId === socketListId
                );

              if (videoExists) {
                setVideos((videos) => {
                  const updated = videos.map((video) =>
                    video.socketId === socketListId
                      ? {
                          ...video,
                          stream: event.stream,
                        }
                      : video
                  );

                  videoRef.current = updated;

                  return updated;
                });
              } else {
                const newVideo = {
                  socketId: socketListId,
                  stream: event.stream,
                  autoplay: true,
                  playsinline: true,
                };

                setVideos((videos) => {
                  const updated = [
                    ...videos,
                    newVideo,
                  ];

                  videoRef.current = updated;

                  return updated;
                });
              }
            };

            if (window.localStream) {
              connections[socketListId].addStream(
                window.localStream
              );
            } else {
              const blackSilence = (...args) =>
                new MediaStream([
                  black(...args),
                  silence(),
                ]);

              window.localStream =
                blackSilence();

              connections[socketListId].addStream(
                window.localStream
              );
            }
          });

          if (id === socketIdRef.current) {
            for (let id2 in connections) {
              if (id2 === socketIdRef.current) {
                continue;
              }

              try {
                connections[id2].addStream(
                  window.localStream
                );
              } catch (e) {
                console.log(e);
              }

              connections[id2]
                .createOffer()
                .then((description) => {
                  return connections[
                    id2
                  ].setLocalDescription(description);
                })
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({
                      sdp: connections[id2]
                        .localDescription,
                    })
                  );
                })
                .catch((e) => console.log(e));
            }
          }
        }
      );
    });

    socketRef.current.on(
      "signal",
      gotMessageFromServer
    );

    socketRef.current.on("connect_error", (err) => {
      console.error(
        "Socket connection error:",
        err.message
      );
    });
  };

  const silence = () => {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const dst =
      oscillator.connect(
        ctx.createMediaStreamDestination()
      );

    oscillator.start();
    ctx.resume();

    return Object.assign(
      dst.stream.getAudioTracks()[0],
      {
        enabled: false,
      }
    );
  };

  const black = ({
    width = 640,
    height = 480,
  } = {}) => {
    const canvas = Object.assign(
      document.createElement("canvas"),
      {
        width,
        height,
      }
    );

    canvas
      .getContext("2d")
      .fillRect(0, 0, width, height);

    const stream = canvas.captureStream();

    return Object.assign(
      stream.getVideoTracks()[0],
      {
        enabled: false,
      }
    );
  };

  const handleVideo = () => {
    setVideo(!video);
  };

  const handleAudio = () => {
    setAudio(!audio);
  };

  useEffect(() => {
    if (screen !== undefined) {
      getDislayMedia();
    }
  }, [screen]);

  const handleScreen = () => {
    setScreen(!screen);
  };

  const handleEndCall = () => {
    try {
      if (localVideoref.current?.srcObject) {
        const tracks =
          localVideoref.current.srcObject.getTracks();

        tracks.forEach((track) => track.stop());
      }
    } catch (e) {
      console.log(e);
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    window.location.href = "/";
  };

  const openChat = () => {
    setModal(true);
    setNewMessages(0);
  };

  const closeChat = () => {
    setModal(false);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (
    data,
    sender,
    socketIdSender
  ) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        sender,
        data,
      },
    ]);

    if (
      socketIdSender !== socketIdRef.current
    ) {
      setNewMessages(
        (prevNewMessages) =>
          prevNewMessages + 1
      );
    }
  };

  const sendMessage = () => {
    if (!message.trim()) {
      return;
    }

    if (!socketRef.current) {
      return;
    }

    socketRef.current.emit(
      "chat-message",
      message,
      username
    );

    setMessage("");
  };

  const connect = () => {
    if (!username.trim()) {
      return;
    }

    setAskForUsername(false);
    getMedia();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter into Lobby</h2>

          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            variant="outlined"
          />

          <Button
            variant="contained"
            onClick={connect}
          >
            Connect
          </Button>

          <div>
            <video
              ref={localVideoref}
              autoPlay
              muted
            ></video>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModal ? (
            <div className={styles.chatRoom}>
              <div className={styles.chatContainer}>
                <h1>Chat</h1>

                <div
                  className={styles.chattingDisplay}
                  ref={chatRef}
                >
                  {messages.length !== 0 ? (
                    messages.map(
                      (item, index) => (
                        <div
                          style={{
                            marginBottom:
                              "20px",
                          }}
                          key={index}
                        >
                          <p
                            style={{
                              fontWeight:
                                "bold",
                            }}
                          >
                            {item.sender}
                          </p>

                          <p>
                            {item.data}
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </div>

                <div
                  className={styles.chattingArea}
                >
                  <TextField
                    value={message}
                    onChange={handleMessage}
                    id="outlined-basic"
                    label="Enter Your chat"
                    variant="outlined"
                  />

                  <Button
                    variant="contained"
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div
            className={styles.buttonContainers}
          >
            <IconButton
              onClick={handleVideo}
              style={{ color: "white" }}
            >
              {video === true ? (
                <VideocamIcon />
              ) : (
                <VideocamOffIcon />
              )}
            </IconButton>

            <IconButton
              onClick={handleEndCall}
              style={{ color: "red" }}
            >
              <CallEndIcon />
            </IconButton>

            <IconButton
              onClick={handleAudio}
              style={{ color: "white" }}
            >
              {audio === true ? (
                <MicIcon />
              ) : (
                <MicOffIcon />
              )}
            </IconButton>

            {screenAvailable === true ? (
              <IconButton
                onClick={handleScreen}
                style={{ color: "white" }}
              >
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            <Badge
              badgeContent={newMessages}
              max={999}
              color="orange"
            >
              <IconButton
                onClick={() =>
                  setModal(!showModal)
                }
                style={{ color: "white" }}
              >
                <ChatIcon />
              </IconButton>
            </Badge>
          </div>

          <video
            className={styles.meetUserVideo}
            ref={localVideoref}
            autoPlay
            muted
          ></video>

          <div
            className={styles.conferenceView}
          >
            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (
                      ref &&
                      video.stream
                    ) {
                      ref.srcObject =
                        video.stream;
                    }
                  }}
                  autoPlay
                  playsInline
                ></video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
