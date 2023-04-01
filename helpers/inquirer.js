const inquirer = require("inquirer");
const colors = require("colors");

const questions = [
  {
    type: "list",
    name: "option",
    message: "What do you wanna do?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} 🌆 Search city.`,
      },
      {
        value: 2,
        name: `${"2.".green} 📃 History.`,
      },
      {
        value: 0,
        name: `${"0.".green} 😒 Exit.`,
      },
    ],
  },
];

async function confirm(message = "") {
  const question = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];

  const { ok } = await inquirer.prompt(question);
  return ok;
}

async function listTasksChecklist(list = []) {
  const choices = list.map((task, index) => {
    const idx = `${index + 1}`.green;

    return {
      value: task.id,
      name: `${idx}. ${task.desc}`,
      checked: task.completeIN ? true : false,
    };
  });

  const question = [
    {
      type: "checkbox",
      name: "ids",
      message: "Select",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(question);
  return ids;
}

async function listPlaces(places = []) {
  const choices = places.map((place, index) => {
    const idx = `${index + 1}`.green;
    return {
      value: place.id,
      name: `${idx}. ${place.name}`,
    };
  });

  choices.unshift({
    value: "0",
    name: `${"0".green}. Cancel.`,
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Choose a place",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);

  return id;
}

async function readLine(message = "") {
  const question = [
    {
      type: "input",
      name: "description",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Ingrese un valor";
        }
        return true;
      },
    },
  ];

  const { description } = await inquirer.prompt(question);
  return description;
}

async function inquirerMenu() {
  console.clear();
  console.log("========================================================".green);
  console.log("Terminal WeatherApp: axios + inquirer + colors".green);
  console.log("========================================================".green);

  const { option } = await inquirer.prompt(questions);

  return Number(option);
}

async function pause() {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"ENTER".green} to continue.`,
    },
  ];

  console.log("\n");

  await inquirer.prompt(question);
}

module.exports = {
  inquirerMenu,
  pause,
  readLine,
  listPlaces,
  confirm,
  listTasksChecklist,
};
