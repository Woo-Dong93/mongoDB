const express = require("express");
const app = express();
const mongoose = require("mongoose");

const users = [];

const MONGO_URI =
  "mongodb+srv://admin:biMuuAn6aQbTw5Cq@tutorial.gdksv.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    // promise를 return합니다.
    let mongodbConnection = await mongoose.connect(MONGO_URI);

    app.use(express.json());

    app.get("/user", function (req, res) {
      return res.send({ users });
    });

    app.post("/user", function (req, res) {
      users.push({ name: req.body.name, age: req.body.age });
      return res.send({ success: true });
    });

    app.listen(3000, function () {
      console.log("server listening on poert 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
