import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase/firebase";
import "firebase/auth";
import "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
} from "firebase/auth";
import axios from "axios";
import DataService from "../DataServiceStrategy/DataService";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ManageStaff = () => {
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const [open, setOpen] = useState(false);

  const [users, setUsers] = useState([]);

  const openRegister = () => {
    setOpen(true);
  };

  const closeRegister = () => {
    setOpen(false);
  };


  const dataService = new DataService("users");

  useEffect(() => {
    const unsubscribe = dataService.fetchData(setUsers);

    return () => {
      unsubscribe();
    };
  }, []);

  const insertStaff = async (name, role, email, password) => {
    try {
      // Make an HTTP request to your API endpoint
      const response = await axios.post("../../api/register", {
        name,
        email,
        password,
        role,
      });

      console.log(response.data); // Log the response from the server

      // Continue with the rest of your logic (if needed)
      setOpenSnackbar(true);
      setName("");
      setEmail("");
      setPassword("");
      setRole("");
      setOpen(false);
    } catch (error) {
      console.error("Error creating user:", error.message);
    }
  };

  const deleteUser = async (userId) => {
    // try {
    //   // Delete user from Firebase Authentication
    //   await deleteAuthUser(auth.currentUser);
  
    //   // Delete user from Firestore
    //   const userDocRef = doc(db, "users", userId); // Corrected the reference to use userId
    //   const userDocSnapshot = await getDoc(userDocRef);
  
    //   if (userDocSnapshot.exists()) {
    //     await deleteDoc(userDocRef);
    //     setOpenSnackbar(true);
    //   } else {
    //     console.error("User document not found in Firestore");
    //   }
    // } catch (error) {
    //   console.error("Error deleting user:", error.message);
    // }
  };

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.name.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    handleRegister(name, email, password);
  };

  // valdation and insertion
  const handleRegister = (name: String, email: String, password: String) => {
    let isValid = true;
    // setError(errors);
    if (isValid) {
      insertStaff(name.toString(), role, email.toString(), password.toString());
    }
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />
      <Typography
        component="h1"
        variant="h5"
        style={{ marginTop: "2%", marginBottom: "2%" }}
      >
        Employee List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No. </TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>User Email</TableCell>
              <TableCell>User Role</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.userEmail}</TableCell>
                <TableCell>{user.userRole}</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteUser(user.userId)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
        }}
      ></Box>
      <Dialog open={open} onClose={closeRegister}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Register Employee
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  variant="outlined"
                  fullWidth
                  required
                  error={error.role.length > 0}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="role"
                    id="role"
                    label="Role"
                    value={role}
                    onChange={handleChange}
                  >
                    <MenuItem value="Customer Service Manager">
                      Customer Service Manager
                    </MenuItem>
                    <MenuItem value="Information Desk Staff">
                      Information Desk Staff
                    </MenuItem>
                    <MenuItem value="Lost And Found Staff">
                      Lost And Found Staff
                    </MenuItem>
                    <MenuItem value="Check in Staff">Check-in Staff</MenuItem>
                    <MenuItem value="Gate Agent">Gate Agent</MenuItem>
                    <MenuItem value="Airport Operations Manager">
                      Airport Operations Manager
                    </MenuItem>
                    <MenuItem value="Flight Operations Manager">
                      Flight Operations Manager
                    </MenuItem>
                    <MenuItem value="Ground Handling Manager">
                      Ground Handling Manager
                    </MenuItem>
                    <MenuItem value="Landside Operations Manager">
                      Landside Operations Manager
                    </MenuItem>
                    <MenuItem value="Maintenance Manager">
                      Maintenance Manager
                    </MenuItem>
                    <MenuItem value="Customs And Border Control Officer">
                      Customs And Border Control Officer
                    </MenuItem>
                    <MenuItem value="Baggage Security Supervisor">
                      Baggage Security Supervisor
                    </MenuItem>
                    <MenuItem value="Cargo Manager">Cargo Manager</MenuItem>
                    <MenuItem value="Logistics Manager">
                      Logistics Manager
                    </MenuItem>
                    <MenuItem value="Fuel Manager">Fuel Manager</MenuItem>
                    <MenuItem value="Cargo Handler">Cargo Handler</MenuItem>
                    <MenuItem value="Civil Engineering Manager">
                      Civil Engineering Manager
                    </MenuItem>
                    <MenuItem value="Airport Director">
                      Airport Director
                    </MenuItem>
                    <MenuItem value="Chief Financial Officer">
                      Chief Financial Officer
                    </MenuItem>
                    <MenuItem value="Chief Operations Officer">
                      Chief Operations Officer
                    </MenuItem>
                    <MenuItem value="Chief Security Officer">
                      Chief Security Officer
                    </MenuItem>
                    <MenuItem value="Human Resources Director">
                      Human Resources Director
                    </MenuItem>
                  </Select>
                  {error.role && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginLeft: "12px",
                      }}
                    >
                      {error.role}
                    </div>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              //   fullWidth
              variant="contained"
              sx={{ mt: 4, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end"></Grid>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Register Success
        </Alert>
      </Snackbar>
      <Fab
        onClick={openRegister}
        color="primary"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "16px",
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default ManageStaff;
