const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

// 관계는 model를 생성할 때 컬렉션 이름(첫번째 인자)를 사용해야 합니다 = ref
const CommentSchema = new Schema(
  {
    content: { type: String, require: true },
    user: { type: ObjectId, require: true, ref: "user", index: true },
    userFullName: { type: String, require: true },
    blog: { type: ObjectId, require: true, ref: "blog" },
  },
  { timestamps: true }
);

CommentSchema.index({ blog: 1, createdAt: -1 });

// 실제 컬렉션 이름은 끝에 s가 붙습니다.
const Comment = model("comment", CommentSchema);

module.exports = { Comment, CommentSchema };
