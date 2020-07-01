const Twit = require("twit");

const fs = require("fs");
const T = new Twit({
  consumer_key: "ybFUSrzAXGkKdIyHV1NeXYLZb",
  consumer_secret: "xJabGs8lQYPdTphq3G7ZOXUlNVIj3ow8CQuji8JLKTnBJTZ1nQ",
  access_token: "1061773966510096384-7k4izjTZuxeD3ZNn9QYxCKm6O064H2",
  access_token_secret: "Vv7jUoiDjy7ZwpdD0dhkA9SHQrE9MAQ11uT7KuZ8QhELK",
});

let sinceId = null;
const getData = async (location, sinceId) => {
  return T.get("search/tweets", {
    q: "#ps5 since:2020-06-11",
    count: 100,
    geocode: location,
    since_id: sinceId,
  }).then((result) => {
    let array = [];
    result.data[Object.keys(result.data)[0]].forEach((value) => {
      array.push(value.id);
      return array;
    });
    sinceId = array.slice(-1).pop();
    console.log(sinceId);
    return result.data;
  });
};

const restructuredObject = (data, country) => {
  let array = [];
  data[Object.keys(data)[0]].forEach((value) => {
    const { text, user } = value;
    const { location: userLocation } = user;
    array.push({ text, userLocation, country });
  });
  return array;
};

const writeFile = async () => {
  const USADataset = await getData("39.293281,-100.658108,1900km", 1278177055918694400);
  const FRDataSet = await getData("46.693822,2.242383,553.49km", 1278192703574904800);
  fs.writeFileSync(
    "./data/tweets.json",
    JSON.stringify(
      [
        ...restructuredObject(USADataset, "USA"),
        ...restructuredObject(FRDataSet, "FR"),
      ],
      null,
      "\t"
    ),
    { flag: "a" }
  );
};

writeFile();
