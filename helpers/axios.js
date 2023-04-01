const axios = require("axios").default;

const paramsMapBox = {
  access_token: process.env.MAPBOX_KEY,
  limit: 5,
  proximity: "ip",
};

const paramsOpenWeather = {
  appid: process.env.OPENWEATHER_KEY,
  units: "metric",
};

function axiosMAPBOX(city = "brazil") {
  return axios.create({
    baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json`,
    params: paramsMapBox,
  });
}

function axiosOPENWEATHER(lon = 0, lat = 0) {
  return axios.create({
    baseURL: `https://api.openweathermap.org/data/2.5/weather`,
    params: {
      ...paramsOpenWeather,
      lat,
      lon,
    },
  });
}

module.exports = { axiosMAPBOX, axiosOPENWEATHER };
