const { Router } = require("express");
const mongoose = require("mongoose");
const userRouter = Router();
const { User } = require("../models/User");

userRouter.get("/", async (req, res) => {
  // 조건없이 다부르기
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.get(":userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // true: objectId형식, false: 아닐때
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalild userId" });
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username) return res.status(400).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res.status(400).send({ err: "Both first and last name are required" });
    const user = new User(req.body);

    // db에 저장하기
    await user.save();
    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalild userId" });
    // 삭제하는 객체를 return하게 된다. 못찾으면 null을 리턴함
    // deleteOne도 가능합니다. 하지만 user를 받을 수 없다.
    const user = await User.findOneAndDelete({ _id: userId });
    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalild userId" });

    const { age, name } = req.body;
    if (!age && !name) return res.status(400).send({ err: "age or name is required" });
    if (age && typeof age !== "number") return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res.status(400).send({ err: "first and last name are strings" });
    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;

    // const user = await User.findByIdAndUpdate(userId, updateBody, { new: true });
    let user = await User.findById(userId);
    if (age) user.age = age;
    if (name) user.name = name;
    await user.save();

    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};
