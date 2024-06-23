require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const apiUrl = process.env.URL;
const CONNECTION_STRING = apiUrl;
const dbName = "AllowResaleInfo";
const collectionName = "allows";
let collection;
const app = express();
app.use(cors());

app.listen(5038, async () => {
  const uri = apiUrl;
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db(dbName);
  collection = database.collection(collectionName);
  console.log(`Server running on port 5038`);
});

app.get("/get", async (request, response) => {
  const cursor = await collection.find({});
  const results = await cursor.toArray();
  response.send(results);
});

// app post or add the nullifier and commitment hash
app.post("/", multer().none(), async (request, response) => {
  let nullifier = request.body.nullifier;
  let commitment = request.body.commitment;
  const allowTicket = {
    old_nullifier: `${nullifier}`,
    old_commitment: `${commitment}`,
  };
  try {
    const insertManyResult = await collection.insertOne(allowTicket);
    console.log(`documents successfully inserted.\n`);
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
  }
});

// delete the nullifier and commitment hash
app.delete("/", multer().none(), async (request, response) => {
  // console.log(`delete query information ${request.body}`) ;
  let nullifier = request.body.nullifier;
  let commitment = request.body.commitment;

  const deleteQuery = {
    old_nullifier: `${nullifier}`,
    old_commitment: `${commitment}`,
  };
  try {
    const deleteResult = await collection.deleteOne(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong trying to delete documents: ${err}\n`);
  }
});


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`
