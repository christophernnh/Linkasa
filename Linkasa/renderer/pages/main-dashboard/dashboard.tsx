import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PublicIcon from "@mui/icons-material/Public";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Drawer from "@mui/material/Drawer";
import { mainListItems, secondaryListItems } from "./listItems";
import Chat from "./chats/chat";
import StaffChat from "./chats/staffChat";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth, db } from "../../firebase/firebase.js";
import Router from "next/router";
import { AuthCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import ManageStaff from "../content/manageStaff/manageStaff";
import InsertFlights from "../content/manageFlight/insertFlights";
import LostAndFound from "../content/manageLostAndFound/lostAndFound";
import TerminalMapViewer from "../content/viewTerminalMap/TerminalMapViewer";
import ViewWeather from "../content/weatherAPI/viewWeather";
import ViewFacilities from "../content/FacilityManagement/viewFacilities";
import MaintenanceSchedule from "../content/FacilityManagement/maintenanceSchedule";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const SideDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#4863A0",
    },
  },
});

export default function Dashboard({ children }) {
  const [selectedItem, setSelectedItem] = React.useState(null);
  const handleListItemClick = (item) => {
    setSelectedItem(item);
  };

  const [userRole, setUserRole] = React.useState("");
  

  const fetchUserRole = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const role = userData?.userRole;
      setUserRole(role);
      console.log(userRole);
    } else {
      console.error("User document not found in Firestore");
    }
  };

  React.useEffect(() => {
    fetchUserRole();
  }, [auth.currentUser.uid]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log(auth.currentUser);
      Router.push("../login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };
  const [open, setOpen] = React.useState(true);
  const [chatOpen, setChatOpen] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const toggleChatDrawer = () => {
    setChatOpen(!chatOpen);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Welcome, {auth.currentUser.email}
            </Typography>
            <IconButton color="inherit">
              <Badge
                badgeContent={4}
                color="secondary"
                style={{ marginRight: "40%" }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit" onClick={toggleChatDrawer}>
              <Badge badgeContent={4} color="secondary">
                <ChatIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <SideDrawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems(userRole, handleListItemClick)}
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
              <ListSubheader component="div" inset>
                Account Management
              </ListSubheader>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="User" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout} style={{ color: "red" }}>
                <ListItemIcon style={{ color: "red" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" style={{ color: "red" }} />
              </ListItemButton>
            </React.Fragment>
          </List>
        </SideDrawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
            {(() => {
              switch (selectedItem) {
                case "Manage Staff":
                  return <ManageStaff />;
                case "Insert Flights":
                  return <InsertFlights />;
                case "Insert Lost And Found Item":
                  return <LostAndFound />;
                case "View Terminal Maps":
                  return <TerminalMapViewer/>;
                case "View Weather":
                  return <ViewWeather/>;
                case "View Facilities":
                  return <ViewFacilities/>;
                case "Manage Maintenance":
                  return <MaintenanceSchedule/>;
                default:
                  return null;
              }
            })()}
          </Container>
        </Box>

        {/* Chat Drawer */}
        <Drawer
          variant="temporary"
          anchor="right"
          open={chatOpen}
          onClose={toggleChatDrawer}
          ModalProps={{
            keepMounted: false,
          }}
          PaperProps={{
            style: {
              maxWidth: 1000,
            },
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", width: "500px" }}
          >
            <Typography
              variant="h6"
              sx={{ mt: 10, textAlign: "center", position: "fixed" }}
            >
              {" "}
              Chat
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                >
                  <Tab
                    label={<PublicIcon />}
                    {...a11yProps(0)}
                    sx={{ width: 250 }}
                  />
                  <Tab
                    label={<SupervisorAccountIcon sx={{ fontSize: "35px" }} />}
                    {...a11yProps(1)}
                    sx={{ width: 250 }}
                  />
                </Tabs>
              </Box>
              <CustomTabPanel value={activeTab} index={0}>
                <Chat></Chat>
              </CustomTabPanel>
              <CustomTabPanel value={activeTab} index={1}>
                <StaffChat></StaffChat>
              </CustomTabPanel>
            </Typography>
          </div>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}
