// FlightFactory.js
import Flight from './Flight';

class FlightFactory {
  createFlight(departureAirport, destinationAirport, departureDate, arrivalDate, planeModel, airline) {
    return new Flight(departureAirport, destinationAirport, departureDate, arrivalDate, planeModel, airline);
  }
}

export default FlightFactory;
