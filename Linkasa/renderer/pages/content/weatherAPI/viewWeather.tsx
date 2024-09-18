import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Typography, Card, CardContent, Grid } from "@mui/material";

const ViewWeather = () => {
  const [location, setLocation] = useState("");
  const [data, setData] = useState({});

  const apiUrl = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = "4a4f15a6cc064dd7f257b470b79c55d9"; // Replace with your OpenWeatherMap API key

  const fetchWeatherData = (query) => {
    const url = `${apiUrl}?q=${query}&units=imperial&appid=${apiKey}`;

    axios.get(url).then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  };

  const searchLocation = (event) => {
    if (event.key === "Enter") {
      fetchWeatherData(location);
      setLocation("");
    }
  };

  useEffect(() => {
    // Fetch default weather data for Jakarta, Singapore, and Osaka
    const defaultLocation = "Jakarta";
    fetchWeatherData(defaultLocation);
  }, []); 

  return (
    <div>
      <Card>
        <CardContent>
          <div className="search">
            <TextField
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              label="Enter Location"
              variant="outlined"
              fullWidth
            />
          </div>
        </CardContent>
      </Card>
      <Card sx={{mt:"10px"}}>
        <CardContent>
          <div>
            <Typography variant="h5">{data.name}</Typography>
          </div>
          <div>
            {data.main ? (
              <Typography variant="h1">{data.main.temp.toFixed()}°F</Typography>
            ) : null}
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {data.weather ? (
                <Typography variant="body1">{data.weather[0].main}</Typography>
              ) : null}
            </Grid>
            {data.name !== undefined && (
              <>
                <Grid item xs={4}>
                  {data.main ? (
                    <>
                      <Typography>Feels Like</Typography>
                      <Typography className="bold">
                        {data.main.feels_like.toFixed()}°F
                      </Typography>
                    </>
                  ) : null}
                </Grid>
                <Grid item xs={4}>
                  {data.main ? (
                    <>
                      <Typography>Humidity</Typography>
                      <Typography className="bold">
                        {data.main.humidity}%
                      </Typography>
                    </>
                  ) : null}
                </Grid>
                <Grid item xs={4}>
                  {data.wind ? (
                    <>
                      <Typography>Wind Speed</Typography>
                      <Typography className="bold">
                        {data.wind.speed.toFixed()} MPH
                      </Typography>
                    </>
                  ) : null}
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewWeather;
