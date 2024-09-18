import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Toolbar,
  IconButton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CargoChat from "./cargoChat";
import FuelChat from "./fuelChat";
import OperationsChat from "./operationsChat";
import SecurityChat from "./securityChat";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase";

const StaffChat = () => {
  const [userName, setUserName] = useState("");
  const [userRoles, setUserRoles] = useState("");
  const [currentChatRoom, setCurrentChatRoom] = useState("nochat");
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserName(userDoc.data().userName);
            setUserRoles(userDoc.data().userRole);
          } else {
            console.error("User document not found.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const chatRooms = [];

  if (
    [
      "Flight Operations Manager",
      "Information Desk Staff",
      "Check In Staff",
      "Landside Operations Manager",
      "Airport Operations Manager",
      "Baggage Security Supervisor",
    ].includes(userRoles)
  ) {
    chatRooms.push({ key: "operationsChat", label: "Operations Chat" });
  }

  if (
    [
      "Landside Operations Manager",
      "Logistics Manager",
      "Cargo Manager",
      "Cargo Handler",
      "Airport Operations Manager",
    ].includes(userRoles)
  ) {
    chatRooms.push({ key: "cargoChat", label: "Cargo Chat" });
  }

  if (
    [
      "Fuel Manager",
      "Landside Operations Manager",
      "Airport Operations Manager",
    ].includes(userRoles)
  ) {
    chatRooms.push({ key: "fuelChat", label: "Fuel Chat" });
  }

  if (
    [
      "Airport Operations Manager",
      "Check In Staff",
      "Information Desk Staff",
      "Chief Security Officer",
    ].includes(userRoles)
  ) {
    chatRooms.push({ key: "securityChat", label: "Security Chat" });
  }

  const ChatRoom = ({ roomKey }) => {
    switch (roomKey) {
      case "cargoChat":
        return (
          <div>
            <Toolbar
              variant="dense"
              sx={{ borderBottom: "1px solid #e0e0e0", pb: "15px" }}
            >
              <IconButton edge="start" color="primary" onClick={handleGoBack}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography component="div" sx={{ flexGrow: 1 }}>
                Cargo Handlers Group Chat
              </Typography>
            </Toolbar>
            <CargoChat />
          </div>
        );

      case "fuelChat":
        return (
          <div>
            <Toolbar
              variant="dense"
              sx={{ borderBottom: "1px solid #e0e0e0", pb: "15px" }}
            >
              <IconButton edge="start" color="primary" onClick={handleGoBack}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography component="div" sx={{ flexGrow: 1 }}>
                Fuel Managers Group Chat
              </Typography>
            </Toolbar>
            <FuelChat />
          </div>
        );
      case "operationsChat":
        return (
          <div>
            <Toolbar
              variant="dense"
              sx={{ borderBottom: "1px solid #e0e0e0", pb: "15px" }}
            >
              <IconButton edge="start" color="primary" onClick={handleGoBack}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography component="div" sx={{ flexGrow: 1 }}>
                Airport Operations Group Chat
              </Typography>
            </Toolbar>
            <OperationsChat />
          </div>
        );
      case "securityChat":
        return (
          <div>
            <Toolbar
              variant="dense"
              sx={{ borderBottom: "1px solid #e0e0e0", pb: "15px" }}
            >
              <IconButton edge="start" color="primary" onClick={handleGoBack}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography component="div" sx={{ flexGrow: 1 }}>
                Security Team Group Chat
              </Typography>
            </Toolbar>
            <SecurityChat />
          </div>
        );
      case "nochat":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <List style={{ width: "100%", padding: 0 }}>
              {chatRooms.map((room) => (
                <ListItem
                  key={room.key}
                  button
                  onClick={() => handleRoomSelect(room.key)}
                  style={{ width: "100%" }}
                >
                  <ListItemIcon>
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText primary={room.label} />
                </ListItem>
              ))}
            </List>
          </div>
        );
      default:
        return null;
    }
  };

  const handleRoomSelect = (roomKey) => {
    setCurrentChatRoom(roomKey);
  };

  const handleGoBack = () => {
    setCurrentChatRoom("nochat");
  };

  return (
    <div>
      <ChatRoom roomKey={currentChatRoom} />
    </div>
  );
};

export default StaffChat;
