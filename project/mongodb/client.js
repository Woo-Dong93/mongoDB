console.log("client code running.");
const axios = require("axios");

const URI = "http://localhost:3000";

const test = async () => {
  console.time("loading time: ");
  let {
    data: { blogs },
  } = await axios.get(`${URI}/blog`);

  //console.dir(blogs[0], { depth: 10 });
  console.timeEnd("loading time: ");
};

const testGroup = async () => {
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
  await test();
};

testGroup();
