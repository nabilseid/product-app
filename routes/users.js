var express = require("express");
const crypto = require("crypto");
const { route } = require(".");
var router = express.Router();

function sendRes(res, success, status, message) {
  res.send({ success: success, status: status, message: message });
}

const users = [
  {
    username: "JhonDoe",
    password: "JhonPass",
  },
];

const getHashedPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

router.post("/signup", (req, res, next) => {
  const { username, password, confirmPassword } = req.body;
  // Check if the password and confirm password fields match
  if (password === confirmPassword) {
    // Check if user with the same email is also registered
    if (users.find((user) => user.username === username)) {
      sendRes(res, false, 200, "User already registered.");
      return;
    }

    const hashedPassword = getHashedPassword(password);

    // Store user into the database if you are using one
    users.push({
      username,
      password: hashedPassword,
    });

    sendRes(res, true, 200, "Registration Complete.");
  } else {
    sendRes(res, false, 200, "Password does not match.");
  }
});

const authTokens = {};

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString("hex");
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = getHashedPassword(password);

  const user = users.find((u) => {
    return u.username === username && hashedPassword === u.password;
  });

  if (user) {
    const authToken = generateAuthToken();

    // Store authentication token
    authTokens[authToken] = user;

    // Setting the auth token in cookies
    res.cookie("AuthToken", authToken);

    // Redirect user to the protected page
    sendRes(res, true, 200, "Logged in");
  } else {
    sendRes(res, false, 200, "Invalid username or password");
  }
});

router.post("/logout", (req, res, next) => {
  res.clearCookie("AuthToken");
  sendRes(res, true, 200, "Logged out");
});

module.exports = router;
