const fs = require("fs");
const { axiosMAPBOX, axiosOPENWEATHER } = require("../helpers/axios");

class Searchs {
  history = [];
  dbPath = "./db/database.json";

  get historyCapitalized() {
    return this.history.map((place) =>
      place
        .split(" ")
        .map((w) => `${w.charAt(0).toUpperCase()}${w.substring(1)}`)
        .join(" ")
    );
  }

  // this.history
  //   //cortamos el historial por espacios
  //   .map((place) => place.split(" "))
  //   //iteramos el nuevo arreglo
  //   .map((words) =>
  //     //como es un array de arrays debemos de volver a iterar ya que ahi recien tendremos acceso a las palabras
  //     //ya con acceso a las palabras convertimos la letra inicial en mayuscula mientras que dejamos el resto igual.
  //     words.map((w) => w[0].toUpperCase() + w.substring(1)).join(" ")
  //   )

  constructor() {
    this.readDB();
  }

  addHistory(place = "") {
    const existOnHistory = this.history.includes(place.toLowerCase());
    if (existOnHistory) return;
    this.history = this.history.splice(0, 5);
    this.history.unshift(place.toLowerCase());
    this.saveDB();
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, "utf-8");
    const { history } = JSON.parse(info);
    this.history = [...history];
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  async searchPlaces(city = "") {
    try {
      const response = await axiosMAPBOX(city).get();
      return response.data.features.map((feature) => {
        return {
          id: feature.id,
          name: feature.place_name,
          lng: feature.center[0],
          lat: feature.center[1],
        };
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getWeather(lon = 0, lat = 0) {
    try {
      const response = await axiosOPENWEATHER(lon, lat).get();
      const {
        weather: [{ description }],
        main: { temp, feels_like, temp_min, temp_max, humidity },
      } = await response.data;

      return {
        description,
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = Searchs;
