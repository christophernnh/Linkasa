import {
  Button,
  Container,
  Dialog,
  DialogContent,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../../firebase/firebase";
import DataService from "../DataServiceStrategy/DataService";
import AddIcon from "@mui/icons-material/Add";


const ViewFacilities = () => {
  const [insert, setInsert] = useState(false);
  const openInsert = () => {
    setInsert(true);
  };
  const closeInsert = () => {
    setInsert(false);
  };

  const [facilityData, setFacilityData] = useState({
    itemName: "",
    location: "",
    status: "",
  });

  const handleInputChange = (fieldName, value) => {
    setFacilityData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const itemCollection = collection(db, "facilities");

      await addDoc(itemCollection, {
        itemName: facilityData.itemName,
        location: facilityData.location,
        status: facilityData.status,
      });

      console.log("facility data inserted");
      //   setOpenSnackbar(true);
      closeInsert();
    } catch (error) {
      console.error("Error inserting data into Firestore:", error);
    }
  };

  const [items, setItems] = useState([]);
  const dataService = new DataService("facilities");

  useEffect(() => {
    const unsubscribe = dataService.fetchData(setItems);

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Facilities
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Facility ID</TableCell>
              <TableCell>Facility Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell
                  sx={{
                    color:
                    item.status === "Under Maintenance"
                        ? "red"
                        : item.status === "Active"
                        ? "green"
                        : item.status === "Inactive"
                        ? "inherit"
                        : "inherit",
                  }}
                >
                  {item.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={insert} onClose={closeInsert}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Register Facility
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="itemName"
                name="itemName"
                label="Facility Name"
                fullWidth
                variant="standard"
                onChange={(e) => handleInputChange("itemName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="plane-model">Location</InputLabel>
                <Select
                  label="Location"
                  labelId="Location"
                  id="Location"
                  name="Location"
                  value={facilityData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  fullWidth
                >
                  <MenuItem value="Terminal 1">Terminal 1</MenuItem>
                  <MenuItem value="Terminal 2">Terminal 2</MenuItem>
                  <MenuItem value="Terminal 3">Terminal 3</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="Status">Status</InputLabel>
                <Select
                  label="Status"
                  labelId="Status"
                  id="Status"
                  name="Status"
                  value={facilityData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Register Facility
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

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

export default ViewFacilities;
