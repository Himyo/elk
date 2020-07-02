const Twit = require("twit");
const fs = require("fs");
const config = require("./config");
const T = new Twit(config);

const getData = async (location, sinceId) => {
  return T.get("search/tweets", {
    q: "#ps5 since:2020-06-11",
    count: 100,
    geocode: location,
    since_id: sinceId,
    include_rts: false
  }).then((result) => {
    let array = [];
    result.data[Object.keys(result.data)[0]].forEach((value) => {
      array.push(value.id);
      return array;
    });
    sinceId = array.slice(-1).pop();
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
  const USADataset = await getData("39.293281,-100.658108,1900km");
  const FRDataSet = await getData("46.693822,2.242383,553.49km");
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
