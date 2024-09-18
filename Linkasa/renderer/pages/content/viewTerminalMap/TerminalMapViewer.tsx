import React, { useState } from "react";
import { Container, Tabs, Tab, Box, Typography } from "@mui/material";

const TerminalMapViewer = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container>
            <Tabs value={value} onChange={handleChange}>
                <Tab label="Terminal 1" />
                <Tab label="Terminal 2" />
                <Tab label="Terminal 3" />
            </Tabs>

            <TabPanel value={value} index={0}>
                {/* Content for Terminal 1 */}
                <img
                    src="https://airportguide.com/terminal_maps/SUB_overview_map.png"
                    alt="Terminal 1 Map"
                    style={{ width: "100%", transform: "scale(1)" }}
                />
            </TabPanel>

            <TabPanel value={value} index={1}>
                {/* Content for Terminal 2 */}
                <img
                    src="https://airportguide.com/terminal_maps/CGK_overview_map.png"
                    alt="Terminal 2 Map"
                    style={{ width: "100%", transform: "scale(1)" }}
                />
            </TabPanel>

            <TabPanel value={value} index={2}>
                {/* Content for Terminal 3 */}
                <img
                    src="https://i.pinimg.com/564x/d1/96/09/d196094a80f8eb6f1a6542d2474e0edd.jpg"
                    alt="Terminal 3 Map"
                    style={{ width: "100%", transform: "scale(1)" }}
                />
            </TabPanel>
        </Container>
    );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
};

export default TerminalMapViewer;
