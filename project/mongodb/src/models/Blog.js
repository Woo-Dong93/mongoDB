const { Schema, model, Types } = require("mongoose");

// 관계는 model를 생성할 때 컬렉션 이름(첫번째 인자)를 사용해야 합니다 = ref
const BlogSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    islive: { type: Boolean, require: true, default: false },
    user: { type: Types.ObjectId, require: true, ref: "user" },
  },
  { timestamps: true }
);

const Blog = model("blog", BlogSchema);

module.exports = { Blog };
