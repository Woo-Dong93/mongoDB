const { Router } = require("express");
const mongoose = require("mongoose");
const userRouter = Router();
const { User, Blog, Comment } = require("../models");

userRouter.get("/", async (req, res) => {
  // 조건없이 다부르기
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.get("/:userId", async (req, res) => {
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

    const [user] = await Promise.all([
      // 삭제하는 객체를 return하게 된다. 못찾으면 null을 리턴함
      // deleteOne도 가능합니다. 하지만 user를 받을 수 없다.
      User.findOneAndDelete({ _id: userId }),
      // blog 삭제
      Blog.deleteMany({ "user._id": userId }),
      // 블로그 안에있는 후기 삭제
      Blog.updateMany({ "comments.user": userId }, { $pull: { comments: { user: userId } } }),
      // 후기 삭제])
      Comment.deleteMany({ user: userId }),
    ]);

    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ err: "invalild userId" });

    const { age, name } = req.body;
    if (!age && !name) return res.status(400).send({ err: "age or name is required" });
    if (age && typeof age !== "number") return res.status(400).send({ err: "age must be a number" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res.status(400).send({ err: "first and last name are strings" });

    let user = await User.findById(userId);
    if (age) user.age = age;

    if (name) {
      user.name = name;
      await Blog.updateMany({ "user._id": userId }, { "user.name": name });
      // 하나의 블로그에 여러개의 코멘트가 있는데 그것을 다 바꿔야한다.
      // 첫번째 인자에 필터를 넣지지 않는다.
      // arrayFilters 사용
      await Blog.updateMany(
        {},
        { "comments.$[element].userFullName": `${name.first} ${name.last}` },
        { arrayFilters: [{ "element.user": userId }] }
      );
    }
    await user.save();

    return res.send({ user });
  } catch (err) {
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};
