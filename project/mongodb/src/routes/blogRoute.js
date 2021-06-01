const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
const blogRouter = Router();
const { Blog, User } = require("../models");

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, islive, userId } = req.body;
    if (typeof title !== "string") return res.status(400).send({ error: "title is required" });
    if (typeof content !== "string") return res.status(400).send({ error: "content is required" });
    if (islive && typeof islive !== "boolean") return res.status(400).send({ error: "islive must be a boolean" });
    // userId가 형식이 맞는지
    if (!isValidObjectId(userId)) return res.status(400).send({ error: "userId is invaild" });

    // userId가 존재하는지 검사
    let user = await User.findById(userId);
    if (!user) return res.status(400).send({ error: "user does net exist" });

    // 블로그 생성
    // 그냥 user를 넣어도 id를 뽑아서 넣어준다. = 몽구스가 값을 적절하게 보고 알아서 데이터를 만듭니다.
    // islive도 없어서 false도 넣어줍니다.
    //let blog = new Blog({ ...req.body, user });
    let blog = new Blog({ ...req.body, user: userId });
    await blog.save();
    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.send({ blogs });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invaild" });

    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invaild" });

    const { title, content } = req.body;
    if (typeof title !== "string") return res.status(400).send({ error: "title is required" });
    if (typeof content !== "string") return res.status(400).send({ error: "content is required" });

    const blog = await Blog.findOneAndUpdate({ _id: blogId }, { title, content }, { new: true });
    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// 특정 부분적으로 수정
blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invaild" });

    const { islive } = req.body;
    if (typeof islive !== "boolean") return res.status(400).send({ error: "boolean islive is required" });

    // findOneAndUpdate와 동일하다, 첫번째 인자를 더 간편하게 받을 수 있다.
    // { new: true }) : 변경된 값 받기
    const blog = await Blog.findByIdAndUpdate(blogId, { islive }, { new: true });

    return res.send({ blog });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = { blogRouter };
