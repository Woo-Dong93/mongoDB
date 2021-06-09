const { Schema, model, Types } = require("mongoose");
const { CommentSchema } = require("./Comment");

// 관계는 model를 생성할 때 컬렉션 이름(첫번째 인자)를 사용해야 합니다 = ref
const BlogSchema = new Schema(
  {
    title: { type: String, require: true },
    content: { type: String, require: true },
    islive: { type: Boolean, require: true, default: false },
    user: {
      _id: { type: Types.ObjectId, require: true, ref: "user" },
      username: { type: String, required: true },
      name: {
        first: { type: String, required: true },
        last: { type: String, required: true },
      },
    },
    commentsCount: { type: Number, default: 0, required: true },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

// 자동 생성하는 key들에게 index부여, 복합키도 가능
// 복합디 유니크 가능 : { unique: true }
// BlogSchema.index({ "user._id": 1, updateAt: 1 }, { unique: true });
BlogSchema.index({ "user._id": 1, updateAt: 1 });
// test index
BlogSchema.index({ title: "text", content: "text" });

// 가상데이터 사용하지 않습니다.
// // 가상키 생성
// BlogSchema.virtual("comment", {
//   // 참고할 것
//   ref: "comment",
//   // 관계 설명
//   // 블로그의 _id
//   localField: "_id",
//   // comment의 어떤 것과 관계되느냐?
//   // comment의 blog에 id가 저장되어있으니 사용
//   foreignField: "blog",
// });

// // 적용
// BlogSchema.set("toObject", { virtuals: true });
// BlogSchema.set("toJSON", { virtuals: true });

const Blog = model("blog", BlogSchema);

module.exports = { Blog };
