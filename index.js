const readline = require("readline-sync");
const fs = require("fs");
const { log } = require("console");

const line = (width = 30) => {
  console.log("-".repeat(width));
};

const space = () => {
  console.log("");
};

const clear = () => {
  console.clear();
};

const title = (title) => {
  console.log(`${title}`);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const signIn = (users = [], resturants = []) => {
  let email = readline.question("Enter email : ");

  if (!emailRegex.test(email)) {
    console.log("Invalid email address.");
    return;
  }

  let password = readline.question("Enter password :");

  if (!passwordRegex.test(password)) {
    console.log("Invalid password format");
    return;
  }

  let user = users.find((user) => user.email === email);

  if (user) {
    if (user.password === password) {
      let currentUserResturant = resturants?.find((resturant) =>
        resturant?.members?.some((member) => member.userId === user.id),
      );

      return {
        isLoggedIn: true,
        currentLoggedInUser: { id: user.id, email: user.email },
        currentUserResturant: currentUserResturant,
      };
      console.log("success");
    } else {
      console.log("Invalid credentials");
    }
  } else {
    console.log("Invalid credentials");
  }
};

const signUp = (users = []) => {
  let email = readline.question("Enter email : ");

  if (!emailRegex.test(email)) {
    console.log("Invalid email address.");
    return;
  }

  let password = readline.question("Enter password : ");

  if (!passwordRegex.test(password)) {
    console.log("Invalid password format");
    return;
  }

  const isUserExist = users.find((user) => user.email === email);

  if (isUserExist) {
    console.log("Already have an account");
    return;
  }

  let user = { id: users.length + 1001, email, password };

  return { user };
};

const signOut = () => {
  return {
    isLoggedIn: false,
    currentLoggedInUser: null,
  };
};

const handleExit = () => {
  return false;
};

const mainMenuOptions = () => {
  console.log("1. Sign In");
  console.log("2. Sign Up");
  console.log("3. Exit");
};

const handleMainMenuOptions = (choice, users, resturants) => {
  switch (choice) {
    case "1":
      return signIn(users, resturants);
      break;
    case "2":
      return signUp(users);
      break;
    case "3":
      const running = handleExit();
      return { running: false };
      break;
    default:
  }
};

const resturantMenuOptions = () => {
  console.log("1. Create Resturant");
  console.log("2. Switch Resturant");
  console.log("3. View Resturants");
  console.log("4. Owned Resturants");
  console.log("5. Update Resturants");
  console.log("6. Delete Resturants");
  console.log("7. Sign Out");
};

const createResturant = (resturants = []) => {
  let name = readline.question("Enter resturant name : ");

  let location = readline.question("Enter location : ");

  let resturant = { id: resturants.length + 2001, name, location };

  return { resturant };
};

const viewResturants = (userId, resturants = []) => {
  clear();
  const userResturants = resturants.filter((resturant) =>
    resturant.members?.some((member) => member.userId === userId),
  );

  userResturants.map((resturant, index) => {
    const member = resturant.members?.find(
      (member) => member.userId === userId,
    );

    console.log(
      `${index + 1}  |  ${resturant.name} (${member.role})   |  ${resturant.location}`,
    );
  });
  space();
  line();
  space();
};

const ownedResturants = (userId, resturants = []) => {
  clear();
  const userOwnedResturants = resturants.filter((resturant) =>
    resturant.members?.some(
      (member) => member.userId === userId && member.role === "owner",
    ),
  );

  userOwnedResturants.map((resturant, index) => {
    const member = resturant.members?.find(
      (member) => member.userId === userId,
    );

    console.log(
      `${index + 1}  |  ${resturant.name} (${member.role})  |  ${resturant.location}`,
    );
  });
  space();
  line();
  space();
};

const switchResturant = (userId, resturants = []) => {
  clear();
  const userResturants = resturants.filter((resturant) =>
    resturant.members?.some((member) => member.userId === userId),
  );

  userResturants.map((resturant, index) => {
    const member = resturant.members?.find(
      (member) => member.userId === userId,
    );

    console.log(`${index + 1}.  ${resturant.name} (${member.role})`);
  });

  let choice = readline.questionInt("Select resturant : ");
  if (choice > userResturants.length) {
    space();
    console.log("invalid choice");
    space();
    return;
  }
  let currentUserResturant = userResturants[choice - 1];
  clear();
  return { currentUserResturant };
};

   const deleteResturant = (userId, resturants = []) => {
    const 
 
    }


const handleResturantMenuOptions = (
  choice,
  currentLoggedInUser,
  resturants,
) => {
  switch (choice) {
    case "1":
      return createResturant(resturants);
      break;
    case "2":
      const res = switchResturant(currentLoggedInUser.id, resturants);
      return res;
      break;
    case "3":
      return viewResturants(currentLoggedInUser.id, resturants);
      break;
    case "4":
      return ownedResturants(currentLoggedInUser.id, resturants);
      break;
    case "5":
      break;
    case "6":
      break;
    case "7":
      return signOut();
      break;
    default:
      console.log("Invalid choice");
  }
};

function main() {
  let running = true;
  let isLoggedIn = false;
  let currentLoggedInUser = null;
  let currentUserResturant = null;
  let response;
  let users = [];
  let resturants = [];
  let userResturants = [];

  const handleWriteData = () => {
    fs.writeFileSync("data.json", JSON.stringify({ users, resturants }));
  };

  const handleReadData = () => {
    return JSON.parse(fs.readFileSync("data.json", "utf-8"));
  };

  const data = handleReadData();
  users = data?.users;
  resturants = data?.resturants;

  do {
    if (!isLoggedIn) {
      mainMenuOptions();
      let choice = readline.question("Enter your choice : ");

      response = handleMainMenuOptions(choice, users, resturants);

      if (response?.running !== undefined && response.running === false) {
        running = false;
      }

      if (response?.user) {
        users.push(response.user);
        handleWriteData();
      }

      if (response?.isLoggedIn) {
        isLoggedIn = true;
        currentLoggedInUser = response.currentLoggedInUser;
        currentUserResturant = response.currentUserResturant;
        clear();
      }
    } else {
      console.log(`LoggedIn user id : ${currentLoggedInUser?.id}`);
      console.log(`LoggedIn user email: ${currentLoggedInUser?.email}`);

      space();
      console.log("Current Resturant");
      console.log(`Current Resturant id : ${currentUserResturant?.id}`);
      console.log(`Current Resturant name: ${currentUserResturant?.name}`);

      space();
      line();

      resturantMenuOptions();

      line();
      space();

      let choice = readline.question("Enter your choice : ");

      response = handleResturantMenuOptions(
        choice,
        currentLoggedInUser,
        resturants,
      );
      if (response?.currentUserResturant) {
        currentUserResturant = response.currentUserResturant;
      }
      if (response?.resturant) {
        let resturant = {
          id: response.resturant.id,
          name: response.resturant.name,
          location: response.resturant.location,
          members: [{ userId: currentLoggedInUser.id, role: "owner" }],
        };
        resturants.push(resturant);
        handleWriteData();
        clear();
      }

      if (
        response?.currentLoggedInUser === null ||
        response?.isLoggedIn === false
      ) {
        isLoggedIn = false;
        currentLoggedInUser = null;
      }
      // if (response?.userResturants) {
      //   userResturants = response.userResturants;
      // }
    }
  } while (running);
}

main();
