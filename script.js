const csv = require("csvtojson");
const fs = require("fs");

require("array.prototype.flatmap").shim();
const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});

const parsedCsv = async () => {
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
      fs.writeFileSync(
        "./data/data.json",
        JSON.stringify(jsonArrayObj, null, 2)
      );
      return jsonArrayObj;
    });
};

async function run() {
  await client.indices.create(
    {
      index: "groupe7",
      body: {
        mappings: {
          properties: {
            id: { type: "integer" },
            text: { type: "text" },
            user: { type: "keyword" },
            time: { type: "date" },
          },
        },
      },
    },
    { ignore: [400] }
  );

  const buffer = fs.readFileSync('./data/data.json');
  const dataset = JSON.parse(buffer.toString());

  const body = dataset.flatMap((doc) => [
    { index: { _index: "groupe7" } },
    doc,
  ]);

  const { body: bulkResponse } = await client.bulk({ refresh: true, body });

  if (bulkResponse.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    bulkResponse.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    console.log(erroredDocuments);
  }
}

run().catch(console.log);
