const readline = require("readline-sync");
const fs = require("fs");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const line = (width = 30) => console.log("-".repeat(width));

const showMenu = (options) =>
  options.forEach((option, index) => console.log(`${index + 1}. ${option}`));

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync("data.json", "utf-8"));
  } catch {
    return { users: [], resturants: [] };
  }
};

const saveData = (users, resturants) =>
  fs.writeFileSync("data.json", JSON.stringify({ users, resturants }, null, 2));

const getCredentials = () => {
  const email = readline.question("Enter email : ");

  if (!emailRegex.test(email)) {
    console.log("Invalid email address");
    return null;
  }

  const password = readline.question("Enter password : ");

  if (!passwordRegex.test(password)) {
    console.log("Invalid password format");
    return null;
  }

  return { email, password };
};

const signIn = (users) => {
  const credentials = getCredentials();

  if (!credentials) return;

  const { email, password } = credentials;

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    console.log("Invalid credentials");
    return;
  }

  return {
    isLoggedIn: true,
    currentLoggedInUser: {
      id: user.id,
      email: user.email,
    },
  };
};

const signUp = (users) => {
  const credentials = getCredentials();

  if (!credentials) return;

  const { email, password } = credentials;

  if (users.some((u) => u.email === email)) {
    console.log("Already have an account");
    return;
  }

  return {
    user: {
      id: users.length + 1001,
      email,
      password,
    },
  };
};

const createResturant = () => ({
  resturant: {
    name: readline.question("Enter restaurant name : "),
    location: readline.question("Enter location : "),
  },
});

const viewResturants = (userId, resturants) => {
  const userResturants = resturants.filter((resturant) =>
    resturant.members?.some((member) => member.userId === userId),
  );

  if (!userResturants.length) {
    console.log("No restaurants found");
    return;
  }

  userResturants.forEach((resturant, index) =>
    console.log(`${index + 1} | ${resturant.name} | ${resturant.location}`),
  );
};

function main() {
  let running = true;
  let isLoggedIn = false;
  let currentLoggedInUser = null;

  const data = loadData();

  let users = data.users || [];
  let resturants = data.resturants || [];

  while (running) {
    if (!isLoggedIn) {
      showMenu(["Sign In", "Sign Up", "Exit"]);

      const choice = readline.question("Enter your choice : ");

      let response;

      switch (choice) {
        case "1":
          response = signIn(users);
          break;

        case "2":
          response = signUp(users);

          if (response?.user) {
            users.push(response.user);
            saveData(users, resturants);
            console.log("Account created successfully");
          }
          break;

        case "3":
          running = false;
          continue;

        default:
          console.log("Invalid choice");
          continue;
      }

      if (response?.isLoggedIn) {
        isLoggedIn = true;
        currentLoggedInUser = response.currentLoggedInUser;
        console.clear();
      }
    } else {
      console.log(`LoggedIn User ID : ${currentLoggedInUser.id}`);
      console.log(`LoggedIn Email   : ${currentLoggedInUser.email}`);

      console.log();
      line();

      showMenu([
        "Create Restaurant",
        "Switch Restaurant",
        "View Restaurants",
        "Update Restaurant",
        "Delete Restaurant",
        "Exit",
      ]);

      line();
      console.log();

      const choice = readline.question("Enter your choice : ");

      switch (choice) {
        case "1": {
          const response = createResturant();

          const resturant = {
            ...response.resturant,
            members: [
              {
                userId: currentLoggedInUser.id,
                role: "owner",
              },
            ],
          };

          resturants.push(resturant);
          saveData(users, resturants);

          console.log("Restaurant created successfully");
          break;
        }

        case "3":
          viewResturants(currentLoggedInUser.id, resturants);
          break;

        case "6":
          isLoggedIn = false;
          currentLoggedInUser = null;
          console.clear();
          break;

        default:
          console.log("Feature not implemented yet");
      }
    }
  }
}

main();
