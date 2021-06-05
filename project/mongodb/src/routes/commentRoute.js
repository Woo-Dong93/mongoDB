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

    const [blog, user] = await Promise.all([Blog.findById(blogId), User.findById(userId)]);

    if (!blog || !user) return res.status(400).send({ error: "blog or user does not exist" });

    if (!blog.islive) return res.status(400).send({ error: "blog is not available" });

    // 수정 및 추가
    const comment = new Comment({ content, user, userFullName: `${user.name.first} ${user.name.last}`, blog });

    // 블로그에도 추가해주기 = push api 활용
    await Promise.all([comment.save(), Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })]);
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

commentRouter.patch("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (typeof content !== "string") return res.status(400).send({ err: "content is required" });

  // 블로그에서 내장되어있기 때문에 같이 수정해야 합니다.
  // 몽고 db 문법 : comments._id (comments 배열안에 있는 comemt객체의 id)
  // comments.$: 조건에 만족하는 comment를 선택하는 문법
  const [comment] = await Promise.all([
    Comment.findOneAndUpdate({ _id: commentId }, { content }, { new: true }),
    Blog.updateOne({ "comments._id": commentId }, { "comments.$.content": content }),
  ]);

  return res.send({ comment });
});

commentRouter.delete("/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findOneAndDelete({ _id: commentId });

  // 블로그안에 commets의 배열안에있는 객체중 id가 commentId인 것을 수정해라!
  // pull을 이용해 내장된 정보 제거, 조건이 추가해야함
  // comments배열에 대해 pull을 하겠다 => 조건문 추가
  // 조건 모두 만족시켜셔 pull 시키기 : { $pull: { comments: { $eleMatch: {content:"hello", state: true} } } }
  await Blog.updateOne({ "comments._id": commentId }, { $pull: { comments: { _id: commentId } } });

  return res.send({ comment });
});

module.exports = {
  commentRouter,
};
