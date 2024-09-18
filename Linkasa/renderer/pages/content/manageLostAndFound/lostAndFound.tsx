import {
  Button,
  Container,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import React, { useState, useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { db } from "../../../firebase/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DataService from "../DataServiceStrategy/DataService";

const LostAndFound = () => {
  const [insert, setInsert] = useState(false);
  const openInsert = () => {
    setInsert(true);
  };
  const closeInsert = () => {
    setInsert(false);
  };

  const [lostandfoundData, setlostandfoundData] = useState({
    itemName: "",
    foundDate: null,
    itemDescription: "",
    returnedTo: null,
    returnDate: null,
    status: "",
  });

  const handleInputChange = (fieldName, value) => {
    setlostandfoundData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const itemCollection = collection(db, "lostandfound");

      await addDoc(itemCollection, {
        itemName: lostandfoundData.itemName,
        foundDate: lostandfoundData.foundDate.toDate(),
        itemDescription: lostandfoundData.itemDescription,
        returnedTo: null,
        returnDate: null,
        status: "In storage",
      });

      console.log("Lost and found data inserted");
      //   setOpenSnackbar(true);
      closeInsert();
    } catch (error) {
      console.error("Error inserting data into Firestore:", error);
    }
  };

  const [items, setItems] = useState([]);
  const dataService = new DataService("lostandfound");

  useEffect(() => {
    const unsubscribe = dataService.fetchData(setItems);

    return () => {
      unsubscribe();
    };
  }, []);

  //edit status
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const openEditDialog = (itemId) => {
    setSelectedItemId(itemId);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleEditStatus = async () => {
    try {
      const itemDocRef = doc(db, "lostandfound", selectedItemId);

      // Get the current timestamp

      // Update the document fields
      await updateDoc(itemDocRef, {
        returnDate: serverTimestamp(),
        returnedTo: newStatus,
        status: "Returned",
      });

      console.log("Status updated successfully");
      closeEditDialog();
    } catch (error) {
      console.error("Error updating status in Firestore:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Lost and Found Items
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Item Name</TableCell>
              <TableCell>Item Description</TableCell>
              <TableCell>Item Found Date</TableCell>
              <TableCell>Item Return Date</TableCell>
              <TableCell>Returned To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.itemDescription}</TableCell>
                <TableCell>
                  {item.foundDate.toDate().toLocaleString()}
                </TableCell>
                <TableCell>
                  {item.returnDate
                    ? item.returnDate.toDate().toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {item.returnedTo ? item.returnedTo : "N/A"}
                </TableCell>
                <TableCell
                  sx={{
                    color:
                    item.status === "In storage"
                        ? "red"
                        : item.status === "Returned"
                        ? "green"
                        : "inherit",
                  }}
                >
                  {item.status}
                </TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <IconButton onClick={() => openEditDialog(item.id)}>
                    <BorderColorIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={insert} onClose={closeInsert}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Insert Lost and Found Item
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="itemName"
                name="itemName"
                label="Item name"
                fullWidth
                variant="standard"
                onChange={(e) => handleInputChange("itemName", e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="itemDescription"
                name="itemDescription"
                label="Add a description"
                fullWidth
                multiline
                rows={4}
                onChange={(e) =>
                  handleInputChange("itemDescription", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  value={lostandfoundData.foundDate}
                  sx={{ width: "100%" }}
                  onChange={(value) => handleInputChange("foundDate", value)}
                  label="Item found date"
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Insert Item
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog open={editDialogOpen} onClose={closeEditDialog}>
        <DialogContent>
          <Typography component="h1" variant="h5">
            Return Item
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="newStatus"
                name="newStatus"
                label="Owner name"
                fullWidth
                variant="standard"
                value={newStatus}
                onChange={handleStatusChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditStatus}
              >
                Return Item
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

export default LostAndFound;
