import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { auth, db } from "../../../firebase/firebase";
import "firebase/auth";
import "firebase/firestore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FlightFactory from "./flightFactory/FlightFactory";
import {
  Container,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Snackbar,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import DataService from "../DataServiceStrategy/DataService";

const InsertFlights = () => {
  const [insertOpen, setInsertOpen] = useState(false);

  const openInsert = () => {
    setInsertOpen(true);
  };

  const closeInsert = () => {
    setInsertOpen(false);
  };

  const [flightData, setFlightData] = useState({
    departureAirport: "",
    destinationAirport: "",
    departureDate: null,
    arrivalDate: null,
    planeModel: "",
    airline: "",
  });

  const handleInputChange = (fieldName, value) => {
    setFlightData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handlePlaneModelChange = (event) => {
    handleInputChange("planeModel", event.target.value);
  };

  const handleAirlineChange = (event) => {
    handleInputChange("airline", event.target.value);
  };
  const flightFactory = new FlightFactory();
  const handleSubmit = async () => {
    try {
      const flightsCollection = collection(db, "flights");

      const newFlight = flightFactory.createFlight(
        flightData.departureAirport,
        flightData.destinationAirport,
        flightData.departureDate.toDate(),
        flightData.arrivalDate.toDate(),
        flightData.planeModel,
        flightData.airline
      );

      await addDoc(flightsCollection, {
        airline: newFlight.airline,
        arrivalDate: newFlight.arrivalDate,
        departureDate: newFlight.departureDate,
        departure: newFlight.departureAirport,
        destination: newFlight.destinationAirport,
        planeModel: newFlight.planeModel,
        flightStatus: calculateFlightStatus(
          newFlight.departureDate,
          newFlight.arrivalDate
        ),
      });

      console.log("Flight data successfully inserted into Firestore!");
      setOpenSnackbar(true);
      closeInsert(); // Close the dialog after submission
    } catch (error) {
      console.error("Error inserting data into Firestore:", error);
    }
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

  const calculateFlightStatus = (departureDate, arrivalDate) => {
    const now = new Date();

    if (now < departureDate) {
      return "Soon";
    } else if (now >= departureDate && now <= arrivalDate) {
      return "Flying";
    } else {
      return "Arrived";
    }
  };

  const [flights, setFlights] = useState([]);
  const dataService = new DataService("flights");

  useEffect(() => {
    const unsubscribe = dataService.fetchData((data) => {
      const flightsData = data.map((flight) => ({
        ...flight,
        flightStatus: calculateFlightStatus(
          flight.departureDate.toDate(),
          flight.arrivalDate.toDate()
        ),
      }));
      setFlights(flightsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  const openDeleteConfirmation = (flightId) => {
    setFlightToDelete(flightId);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setFlightToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  // Function to delete a flight
  const deleteFlight = async (flightId) => {
    try {
      const flightRef = doc(db, "flights", flightId);
      await deleteDoc(flightRef);
      console.log("Flight deleted successfully!");
      closeDeleteConfirmation();
    } catch (error) {
      console.error("Error deleting flight:", error);
    }
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
  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <Container component="main" maxWidth="xl">
      <Typography variant="h6" gutterBottom>
        Flight Schedules
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>FlightID</TableCell>
              <TableCell>Departing From</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Departure Time</TableCell>
              <TableCell>Arrival Time</TableCell>
              <TableCell>Airline</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight, index) => (
              <TableRow key={index}>
                <TableCell>{flight.id}</TableCell>
                <TableCell>{flight.departure}</TableCell>
                <TableCell>{flight.destination}</TableCell>
                <TableCell>
                  {flight.departureDate.toDate().toLocaleString()}
                </TableCell>
                <TableCell>
                  {flight.arrivalDate.toDate().toLocaleString()}
                </TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>{flight.planeModel}</TableCell>
                <TableCell
                  sx={{
                    color:
                      flight.flightStatus === "Soon"
                        ? "red"
                        : flight.flightStatus === "Flying"
                        ? "blue"
                        : flight.flightStatus === "Arrived"
                        ? "green"
                        : "inherit",
                  }}
                >
                  {flight.flightStatus}
                </TableCell>
                <TableCell>
                  {userRole === "Chief Operations Officer" && (
                    <IconButton
                      onClick={() => openDeleteConfirmation(flight.id)}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={insertOpen} onClose={closeInsert}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Register New Flight
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="departureAirport"
                name="departureAirport"
                label="Departure Airport"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  handleInputChange("departureAirport", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="destinationAirport"
                name="destinationAirport"
                label="Destination Airport"
                fullWidth
                variant="standard"
                onChange={(e) =>
                  handleInputChange("destinationAirport", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={flightData.departureDate}
                  sx={{ width: "100%" }}
                  onChange={(value) =>
                    handleInputChange("departureDate", value)
                  }
                  label="Departure Date and Time"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={flightData.arrivalDate}
                  sx={{ width: "100%" }}
                  onChange={(value) => handleInputChange("arrivalDate", value)}
                  label="Arrival Date and Time"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="plane-model">Plane Model</InputLabel>
                <Select
                  value={flightData.planeModel}
                  onChange={handlePlaneModelChange}
                  labelId="plane-model"
                  id="plane-model"
                  name="plane-model"
                  label="plane-model"
                  variant="standard"
                >
                  <MenuItem value="Boeing 737">Boeing 737</MenuItem>
                  <MenuItem value="Airbus 330">Airbus 330</MenuItem>
                  <MenuItem value="Airbus A220">Airbus A220</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="airline">Airline</InputLabel>
                <Select
                  value={flightData.airline}
                  onChange={handleAirlineChange}
                  labelId="airline"
                  id="airline"
                  name="airline"
                  label="airline"
                  variant="standard"
                >
                  <MenuItem value="Singapore Airlines">
                    Singapore Airlines
                  </MenuItem>
                  <MenuItem value="Qatar Airways">Qatar Airways</MenuItem>
                  <MenuItem value="ANA All Nippon Airways">
                    ANA All Nippon Airways
                  </MenuItem>
                  <MenuItem value="Emirates">Emirates</MenuItem>
                  <MenuItem value="Cathay Pacific Airways">
                    Cathay Pacific Airways
                  </MenuItem>
                  <MenuItem value="Air France">Air France</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                insert flight
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this flight?
          </Typography>
          <Typography gutterBottom>{flightToDelete}</Typography>
          <Button
            sx={{ color: "red" }}
            onClick={() => deleteFlight(flightToDelete)}
          >
            Yes, Delete
          </Button>
          <Button sx={{ color: "green" }} onClick={closeDeleteConfirmation}>
            Cancel
          </Button>
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
          Insert Flight Data Success
        </Alert>
      </Snackbar>

      <Fab
        onClick={openInsert}
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

export default InsertFlights;
