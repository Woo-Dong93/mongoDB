const mongoose = require("mongoose");

const UserShema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
    age: Number,
    email: String,
  },
  { timestamps: true }
);
// timestampes 옵션 : 데이터를 생성했을 때 생성시간을 만들어주고 업데이트할 때마다 업데이트 시간을 수정해줍니다.

// 몽구스에 user라는 컬렉션을 만들것이로 이런 구조를 가지고 있어! 라고 알리기;
const User = mongoose.model("user", UserShema);

module.exports = { User };
