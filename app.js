const dotenv = require("dotenv").config();
const {
  inquirerMenu,
  pause,
  readLine,
  listPlaces,
} = require("./helpers/inquirer");
const Searchs = require("./models/searchs");
const colors = require("colors");

async function main() {
  let opt;
  const searchs = new Searchs();

  do {
    opt = await inquirerMenu();
    if (opt === 1) {
      //Mostrar mensaje
      const place = await readLine("City: ");
      //Buscar lugares
      const places = await searchs.searchPlaces(place);
      //Seleccionar lugar
      const idPlace = await listPlaces(places);

      //IMPORTANTE: Skippea la iteracion actual
      if (idPlace === "0") continue;
      const placeSelected = places.find((p) => p.id === idPlace);

      //Guardar en db
      searchs.addHistory( placeSelected.name );

      //Clima
      const weather = await searchs.getWeather(
        placeSelected.lon,
        placeSelected.lat
      );

      if (!weather) throw new Error("Not finded Weather");

      //Mostrar resultados
      console.clear();
      console.log(
        `
            Place: ${`${placeSelected.name}`.rainbow}

        \n===================================================\n
        Temperature: ${weather.temp}\n
        Description: ${weather.description}\n
        Feels like: ${weather.feels_like} \n
        Max temp: ${weather.temp_max} \n
        Min temp: ${weather.temp_min} \n
        Humidity: ${weather.humidity} \n
        Lng. Lat: [${placeSelected.lng}, ${placeSelected.lat}] \n
        \n===================================================\n
      `.green
      );
    }

    if (opt === 2) {
      searchs.historyCapitalized.forEach((place, index) => {
        const idx = `${ index + 1}.`.green
        console.log(`${idx} ${place}`)
      })
    }

    if (opt !== 0) await pause();
  } while (opt !== 0);
}

main().catch((err) => console.error(err));
