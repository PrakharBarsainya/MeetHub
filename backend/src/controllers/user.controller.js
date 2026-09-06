import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

const register = async (req, res) => {
const { name, username, password } = req.body;

try {
if (!name || !username || !password) {
return res.status(httpStatus.BAD_REQUEST).json({
message: "Name, username and password are required",
});
}

const existUser = await User.findOne({ username });

if (existUser) {
  return res.status(httpStatus.CONFLICT).json({
    message: "User already exists",
  });
}

const hashedPassword = await bcrypt.hash(password, 10);

const newUser = new User({
  name,
  username,
  password: hashedPassword,
});

await newUser.save();

return res.status(httpStatus.CREATED).json({
  message: "User registered successfully",
});

} catch (error) {
console.error("REGISTER ERROR:", error);

return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  message: `Something went wrong: ${error.message}`,
});
}
};

const login = async (req, res) => {
const { username, password } = req.body;

if (!username || !password) {
return res.status(httpStatus.BAD_REQUEST).json({
message: "Please provide username and password",
});
}

try {
const user = await User.findOne({ username });

if (!user) {
  return res.status(httpStatus.NOT_FOUND).json({
    message: "User not found",
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(httpStatus.UNAUTHORIZED).json({
    message: "Invalid username or password",
  });
}

const token = crypto.randomBytes(20).toString("hex");

user.token = token;

await user.save();

return res.status(httpStatus.OK).json({
  token,
  message: "User logged in successfully!",
});

} catch (error) {
console.error("LOGIN ERROR:", error);

return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  message: `Something went wrong: ${error.message}`,
});
}
};

const getUserHistory = async (req, res) => {
const { token } = req.query;

try {
if (!token) {
return res.status(httpStatus.UNAUTHORIZED).json({
message: "Token is required",
});
}

const user = await User.findOne({ token });

if (!user) {
  return res.status(httpStatus.UNAUTHORIZED).json({
    message: "Invalid or expired token",
  });
}

const meetings = await Meeting.find({
  user_id: user.username,
}).sort({ date: -1 });

return res.status(httpStatus.OK).json(meetings);

} catch (error) {
console.error("GET HISTORY ERROR:", error);
return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  message: `Something went wrong: ${error.message}`,
});
}
};

const addToHistory = async (req, res) => {
const { token, meeting_code } = req.body;

try {
if (!token) {
return res.status(httpStatus.UNAUTHORIZED).json({
message: "Token is required",
});
}

if (!meeting_code) {
  return res.status(httpStatus.BAD_REQUEST).json({
    message: "Meeting code is required",
  });
}

const user = await User.findOne({ token });

if (!user) {
  return res.status(httpStatus.UNAUTHORIZED).json({
    message: "Invalid or expired token",
  });
}

const newMeeting = new Meeting({
  user_id: user.username,
  meeting_id: meeting_code.trim(),
});

await newMeeting.save();

return res.status(httpStatus.CREATED).json({
  message: "Added meeting to history",
  meeting: newMeeting,
});
} catch (error) {
console.error("ADD HISTORY ERROR:", error);
return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
  message: `Something went wrong: ${error.message}`,
});
}
};

export {
login,
register,
getUserHistory,
addToHistory,
};
