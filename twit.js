const Twit = require("twit");

const fs = require("fs");
const T = new Twit({
  consumer_key: "ybFUSrzAXGkKdIyHV1NeXYLZb",
  consumer_secret: "xJabGs8lQYPdTphq3G7ZOXUlNVIj3ow8CQuji8JLKTnBJTZ1nQ",
  access_token: "1061773966510096384-7k4izjTZuxeD3ZNn9QYxCKm6O064H2",
  access_token_secret: "Vv7jUoiDjy7ZwpdD0dhkA9SHQrE9MAQ11uT7KuZ8QhELK",
});

// for (let index = 0; index < 1; index++) {
let lastId = null;
// const locUsa = "39.293281,-100.658108,1900km";
// const locFrance = "46.693822,2.242383,553.49km";
const getData = async (location, sinceId) => {
  return T.get("search/tweets", {
    q: "#ps5 since:2020-06-11",
    count: 100,
    geocode: location,
    since_id: sinceId
  }).then((result) =>{
    if(!lastId) {
      let array = [];
      result.data[Object.keys(result.data)[0]].forEach((value) => {
        array.push(value.id);
        return array;
      });
      lastId = array.slice(-1).pop();
    }
    return result.data;
  });
};

// }

const restructuredObject = (data) => {
  let array = [];
  data[Object.keys(data)[0]].forEach((value) => {
    const { text, user } = value;
    const { location: userLocation } = user;
    array.push({ text, userLocation });
  });
  return array;
};

const writeFile = async () => {
  const USADataset = await getData("39.293281,-100.658108,1900km", lastId);
  const FRDataSet = await getData("46.693822,2.242383,553.49km", lastId);
  fs.writeFileSync(
    "./data/tweets.json",
    JSON.stringify([...restructuredObject(USADataset), ...restructuredObject(FRDataSet)], null, "\t"),
    { flag: "a" }
  );
};

writeFile();
