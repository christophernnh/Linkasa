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
  } from "firebase/firestore";
  import { useState, useEffect } from "react";
  import { db } from "../../../firebase/firebase";
  import DataService from "../DataServiceStrategy/DataService";
  import AddIcon from "@mui/icons-material/Add";
  import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  
  const MaintenanceSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [insertOpen, setInsertOpen] = useState(false);
  
    const maintenanceDataService = new DataService("maintenanceschedule");
    const facilityDataService = new DataService("facilities");
  
    const [maintenanceData, setMaintenanceData] = useState({
      facilityID: "",
      startDate: null,
      endDate: null,
      status: "",
    });
  
    useEffect(() => {
      const unsubscribeFacilities = facilityDataService.fetchData(
        (facilities) => {
          setFacilities(
            facilities.filter((facility) => facility.status === "Inactive")
          );
        }
      );
  
      const updateFacilityStatusForSchedule = (schedule) => {
        const status = getCurrentStatus(schedule.startDate, schedule.endDate);
        if(status == "Complete"){
            updateFacilityStatus(schedule.FacilityID, "Active");
        }else if(status == "Incomplete"){
            updateFacilityStatus(schedule.FacilityID, "Inactive");
        }else if(status == "On Progress"){
            updateFacilityStatus(schedule.FacilityID, "Under Maintenance");
        }
        
      };
  
      const unsubscribeMaintenance = maintenanceDataService.fetchData(
        (schedules) => {
          setSchedules(schedules);
          schedules.forEach(updateFacilityStatusForSchedule);
        }
      );
  
      return () => {
        unsubscribeMaintenance();
        unsubscribeFacilities();
      };
    }, []);
  
    const getStatusColor = (status) => {
      switch (status) {
        case "Incomplete":
          return "red";
        case "Complete":
          return "green";
        case "On Progress":
          return "blue";
        default:
          return "inherit";
      }
    };
  
    const getCurrentStatus = (startDate, endDate) => {
      const currentDate = new Date();
      const startDateTime = startDate.toDate();
      const endDateTime = endDate.toDate();
  
      if (currentDate < startDateTime) {
        return "Incomplete";
      } else if (currentDate >= startDateTime && currentDate <= endDateTime) {
        return "On Progress";
      } else {
        return "Complete";
      }
    };
  
    const openInsert = () => {
      setInsertOpen(true);
    };
  
    const closeInsert = () => {
      setInsertOpen(false);
    };
  
    const handleFacilityChange = (facilityId) => {
      setSelectedFacility(facilityId);
    };
  
    const handleSubmit = async () => {
      try {
        const maintenanceCollection = collection(db, "maintenanceschedule");
  
        const newMaintenanceDocRef = await addDoc(maintenanceCollection, {
          startDate: maintenanceData.startDate.toDate(),
          endDate: maintenanceData.endDate.toDate(),
          FacilityID: selectedFacility,
        });
  
        console.log("Maintenance schedule successfully inserted into Firestore!");
  
        // Update the facility status when a new maintenance schedule is added
        updateFacilityStatus(selectedFacility, "Under Maintenance");
  
        closeInsert();
      } catch (error) {
        console.error("Error inserting data into Firestore:", error);
      }
    };
  
    const handleMaintenanceComplete = async (schedule) => {
      try {
        // Mark the maintenance schedule as complete in Firestore
        const maintenanceDocRef = doc(db, "maintenanceschedule", schedule.id);
        await updateDoc(maintenanceDocRef, { status: "Complete" });
  
        // Update the facility status to "Active" when maintenance is complete
        updateFacilityStatus(schedule.FacilityID, "Active");
      } catch (error) {
        console.error("Error updating maintenance status:", error);
      }
    };
  
    const handleInputChange = (fieldName, value) => {
      setMaintenanceData((prevData) => ({
        ...prevData,
        [fieldName]: value,
      }));
    };
  
    const updateFacilityStatus = async (facilityId, status) => {
      try {
        const facilityDocRef = doc(db, "facilities", facilityId);
        await updateDoc(facilityDocRef, { status });
        console.log(`Facility status updated to ${status}`);
      } catch (error) {
        console.error("Error updating facility status:", error);
      }
    };
  
    return (
      <Container>
        <Typography variant="h6" gutterBottom>
          Maintenance Schedule
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Maintenance ID</TableCell>
                <TableCell>Facility ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.FacilityID}</TableCell>
                  <TableCell>
                    {item.startDate.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell>{item.endDate.toDate().toLocaleString()}</TableCell>
                  <TableCell
                    sx={{
                      color: getStatusColor(
                        getCurrentStatus(item.startDate, item.endDate)
                      ),
                    }}
                  >
                    {getCurrentStatus(item.startDate, item.endDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={insertOpen} onClose={closeInsert}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography component="h1" variant="h5">
                  Select Facility for Maintenance Schedule
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="facility-select-label">Facility</InputLabel>
                  <Select
                    label="Facility"
                    labelId="facility-select-label"
                    id="facility-select"
                    value={selectedFacility || ""}
                    onChange={(e) => handleFacilityChange(e.target.value)}
                    fullWidth
                  >
                    {facilities.map((facility) => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.itemName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={maintenanceData.startDate}
                    sx={{ width: "100%" }}
                    onChange={(value) => handleInputChange("startDate", value)}
                    label="Maintenance Date"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    value={maintenanceData.endDate}
                    sx={{ width: "100%" }}
                    onChange={(value) => handleInputChange("endDate", value)}
                    label="Until"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!selectedFacility}
                  fullWidth
                >
                  Create Maintenance Schedule
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
  
  export default MaintenanceSchedule;
  