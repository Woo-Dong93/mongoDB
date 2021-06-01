const { Router } = require("express");
const { isValidObjectId } = require("mongoose");
// 중요 : mergeParams를 넣어야 :blogid/comment에서 상위 id를 받을 수 있다.
// 다른 방법 : 상위 blog 라우터에서 연결하면 됩니다.
const commentRouter = Router({ mergeParams: true });
const { Comment, Blog, User } = require("../models");

// 코멘트는 독잔적으로 불러오는 것이 아니라 특정 블로그의 코멘트를 가쟈오는 것이다
// 그래서 blog/:blogId/comment 가 좋습니다.

commentRouter.post("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, userId } = req.body;

    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invaild" });
    if (!isValidObjectId(userId)) return res.status(400).send({ error: "userId is invaild" });
    if (typeof content !== "string") return res.status(400).send({ error: "content is required" });

    // promise.all을 활용해서 최적화
    const [blog, user] = await Promise.all([Blog.findById(blogId), User.findById(userId)]);

    if (!blog || !user) return res.status(400).send({ error: "blog or user does not exist" });

    if (!blog.islive) return res.status(400).send({ error: "blog is not available" });

    // 그대로 넣어도 id만 뽑아서 들어간다.
    const comment = new Comment({ content, user, blog });
    await comment.save();
    return res.send({ comment });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
});

commentRouter.get("/", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) return res.status(400).send({ error: "blogId is invaild" });

    const comment = await Comment.find({ blog: blogId });
    return res.send({ comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

module.exports = {
  commentRouter,
};
