const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretKey";//mandate step

app.get("/", (req, res) => { 
  res.json({
    message: "a sample api",
  });
});

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "anil",
    email: "abc@test.com",
  };

  //kind of fix syntax
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    res.json({
      token,
    });
  });
});

app.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send({ result: "invalid token" });
    } else {
      res.json({
        message: "profile accessed",
        authData,
      });
    }
  });
});
//middleware function to handle jwt check and seperated from any keyword if used in the header like-bearer
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"]; //fixed type of syntax
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" "); //beacause bearer and token in header are seperated by space
    const token = bearer[1];

    // it will ignore the first element array in which bearer was written in the authorization key and taken the second element array i.e, our token
    req.token = token;
    next();
  } else {
    res.send({ result: "token is not valid" });
  }
} //using next bcs it will act as an middleware

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
