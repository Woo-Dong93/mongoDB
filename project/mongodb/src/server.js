const express = require("express");
const app = express();
const { userRouter, blogRouter, commentRouter } = require("./routes");
const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://admin:biMuuAn6aQbTw5Cq@tutorial.gdksv.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    // promise를 return합니다.
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    mongoose.set("debug", true);
    console.log("MongoDB conneted");

    app.use(express.json());

    // 라우터 설정
    app.use("/user", userRouter);
    app.use("/blog", blogRouter);
    app.use("/blog/:blogId/comment", commentRouter);

    app.listen(3000, function () {
      console.log("server listening on poert 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
