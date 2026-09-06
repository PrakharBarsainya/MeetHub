import { createContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import server from "../enviroment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: `${server}/api/v1/user`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const token = localStorage.getItem("token");

    return token ? { token } : {};
  });

  const handleRegister = async (name, username, password) => {
    try {
      const request = await client.post("/register", {
        name,
        username,
        password,
      });

      if (request.status === HttpStatusCode.Created) {
        return request.data.message;
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const request = await client.post("/login", {
        username,
        password,
      });

      if (request.status === HttpStatusCode.Ok) {
        const token = request.data.token;

        // Save the newly generated token
        localStorage.setItem("token", token);

        // Keep the current logged-in user in React state
        setUserData({
          username,
          token,
        });

        console.log("LOGIN SUCCESS");
        console.log("Username:", username);
        console.log("Token:", token);

        return request.data.message;
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({});

    console.log("LOGOUT SUCCESS");
  };

  const getHistoryOfUser = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("========== GET HISTORY FRONTEND ==========");
      console.log("History token:", token);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const request = await client.get("/get_all_activity", {
        params: {
          token,
        },
      });

      console.log("HISTORY RESPONSE:", request.data);

      if (Array.isArray(request.data)) {
        console.log("HISTORY LENGTH:", request.data.length);
        return request.data;
      }

      if (request.data && request.data._id) {
        return [request.data];
      }

      throw new Error(
        request.data?.message || "Failed to get meeting history"
      );
    } catch (error) {
      console.error("HISTORY ERROR:", error);
      throw error;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const token = localStorage.getItem("token");

      console.log("========== ADD HISTORY FRONTEND ==========");
      console.log("Token being sent:", token);
      console.log("Meeting code being sent:", meetingCode);

      if (!token) {
        throw new Error("No authentication token found");
      }

      if (!meetingCode) {
        throw new Error("Meeting code is required");
      }

      const request = await client.post("/add_to_activity", {
        token,
        meeting_code: meetingCode,
      });

      console.log("ADD HISTORY RESPONSE:", request.data);

      return request.data;
    } catch (error) {
      console.error("ADD HISTORY ERROR:", error);
      throw error;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    handleLogout,
    getHistoryOfUser,
    addToUserHistory,
  };

  return (
    <AuthContext.Provider value={data}>
      {children}
    </AuthContext.Provider>
  );
};
