const csv = require("csvtojson");
const fs = require("fs");

csv({
  delimiter: ";",
  headers: [
    "title",
    "seo_title",
    "url",
    "author",
    "date",
    "category",
    "locales",
    "content",
  ],
  alwaysSplitAtEOL: true,
  noheader: true,
})
  .fromFile("./data/data.csv")
  .then((jsonArrayObj) => {
    fs.writeFileSync("./data/data.json", JSON.stringify(jsonArrayObj, null, 2));
  });
