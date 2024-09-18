import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import NoLuggageIcon from "@mui/icons-material/NoLuggage";
import MapIcon from "@mui/icons-material/Map";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import EngineeringIcon from '@mui/icons-material/Engineering';
import BusinessIcon from '@mui/icons-material/Business';

class RoleState {
  renderMainList(handleListItemClick) {
    return <React.Fragment></React.Fragment>;
  }

  renderSecondaryList() {
    return (
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
        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class HRDirectorState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => handleListItemClick("Manage Staff")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Staff" />
        </ListItemButton>

        <ListItemButton
          onClick={() => handleListItemClick("Manage Job Vacancy")}
        >
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Job Vacancy" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Trainings" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class COOState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => handleListItemClick("Insert Flights")}>
          <ListItemIcon>
            <ConnectingAirportsIcon />
          </ListItemIcon>
          <ListItemText primary="Insert new flight" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class LostAndFoundState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton
          onClick={() => handleListItemClick("Insert Lost And Found Item")}
        >
          <ListItemIcon>
            <NoLuggageIcon />
          </ListItemIcon>
          <ListItemText primary="Log item" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class GateAgentState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => handleListItemClick("Insert Flights")}>
          <ListItemIcon>
            <ConnectingAirportsIcon />
          </ListItemIcon>
          <ListItemText primary="View Flights" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class InformationDeskState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => handleListItemClick("Insert Flights")}>
          <ListItemIcon>
            <ConnectingAirportsIcon />
          </ListItemIcon>
          <ListItemText primary="View Flights" />
        </ListItemButton>
        <ListItemButton
          onClick={() => handleListItemClick("View Terminal Maps")}
        >
          <ListItemIcon>
            <MapIcon />
          </ListItemIcon>
          <ListItemText primary="View Terminal Maps" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

class AirportOperationsState extends RoleState {
  renderMainList(handleListItemClick) {
    return (
      <React.Fragment>
        <ListItemButton onClick={() => handleListItemClick("Insert Flights")}>
          <ListItemIcon>
            <ConnectingAirportsIcon />  
          </ListItemIcon>
          <ListItemText primary="View Flights" />
        </ListItemButton>
        <ListItemButton onClick={() => handleListItemClick("View Weather")}>
          <ListItemIcon>
            <ThunderstormIcon />
          </ListItemIcon>
          <ListItemText primary="View Live Weather" />
        </ListItemButton>
        <ListItemButton onClick={() => handleListItemClick("View Facilities")}>
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="View Facilities" />
        </ListItemButton>
        <ListItemButton onClick={() => handleListItemClick("Manage Maintenance")}>
          <ListItemIcon>
            <EngineeringIcon />
          </ListItemIcon>
          <ListItemText primary="Manage Maintenance" />
        </ListItemButton>
      </React.Fragment>
    );
  }
}

const getRoleState = (role) => {
  switch (role) {
    case "Human Resources Director":
      return new HRDirectorState();
    case "Chief Operations Officer":
      return new COOState();
    case "Lost And Found Staff":
      return new LostAndFoundState();
    case "Gate Agent":
      return new GateAgentState();
    case "Information Desk Staff":
      return new InformationDeskState();
    case "Airport Operations Manager":
      return new AirportOperationsState();
    default:
      return new RoleState();
  }
};

export const mainListItems = (role, handleListItemClick) => {
  const roleState = getRoleState(role);
  return roleState.renderMainList(handleListItemClick);
};

export const secondaryListItems = () => {
  const roleState = new RoleState(); // Use a default state for the secondary list
  return roleState.renderSecondaryList();
};
