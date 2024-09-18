import {
    Avatar,
    Box,
    Button,
    CssBaseline,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Typography,
  } from "@mui/material";
  import { createTheme, ThemeProvider } from "@mui/material/styles";
  import { auth, db } from "../../../firebase/firebase";
  import * as React from "react";
  import {
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDoc,
    doc,
    query,
    orderBy,
  } from "firebase/firestore";
  import SendIcon from "@mui/icons-material/Send";
  
  const defaultTheme = createTheme({
    palette: {
      primary: {
        main: "#4863A0",
      },
    },
  });
  
  export default function CargoChat() {
    const [messages, setMessages] = React.useState([]);
    const [inputValue, setInputValue] = React.useState("");
    const [userName, setUserName] = React.useState("");
    const [userRole, setUserRole] = React.useState("");
  
    const user = auth.currentUser;
  
    const fetchGlobalchat = () => {
      const q = query(collection(db, "cargoChat"), orderBy("Date"));
  
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const globalchatData = snapshot.docs.map((doc) => doc.data());
        setMessages(globalchatData);
      });
  
      return unsubscribe;
    };
  
    React.useEffect(() => {
      const unsubscribe = fetchGlobalchat();
      return () => unsubscribe();
    }, []);
  
    React.useEffect(() => {
      const fetchUserName = async () => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setUserName(userDoc.data().userName);
              setUserRole(userDoc.data().userRole);
            } else {
              console.error("User document not found.");
            }
          } catch (error) {
            console.error("Error fetching user name:", error.message);
          }
        }
      };
  
      fetchUserName();
    }, [user]);
  
    const handleSendMessage = async () => {
      if (user && inputValue.trim() !== "") { 
        const newMessage = {
          Name: userName,
          Message: inputValue,
          Date: serverTimestamp(),
          Role: userRole,
        };
  
        try {
          await addDoc(collection(db, "cargoChat"), newMessage);
          setInputValue("");
          setTimeout(() => {
            scrollListToBottom();
          }, 0);
        } catch (error) {
          console.error("Error sending message:", error.message);
        }
      } else {
        console.error("User not authenticated.");
      }
    };
  
    const scrollListToBottom = () => {
      const listContainer = document.getElementById("chat-list");
  
      if (listContainer) {
        listContainer.scrollTop = listContainer.scrollHeight;
      }
    };
  
    return (
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <div
          style={{ display: "flex", flexDirection: "column", height: "65vh" }}
        >
          <div
            id="chat-list"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#000000",
            }}
          >
            <List style={{ overflowY: "auto" }}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {message.Date && message.Date.toDate().toLocaleString()}
                    </Typography>
                    <ListItemText
                      primary={
                        <Typography sx={{ text: "bold" }} color="textPrimary">
                          <strong>
                            {message.Name} [{message.Role}]
                          </strong>
                        </Typography>
                      }
                      secondary={
                        <Typography color="textPrimary">
                          {message.Message}
                        </Typography>
                      }
                    />
                  </div>
                </ListItem>
              ))}
            </List>
          </div>
          <Box style={{ display: "flex" }}>
          <TextField
            label="Type your message"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ flexGrow: 1 }}
          />
          <IconButton color="primary" onClick={handleSendMessage}>
            <SendIcon />
          </IconButton>
        </Box>
        </div>
      </ThemeProvider>
    );
  }
  