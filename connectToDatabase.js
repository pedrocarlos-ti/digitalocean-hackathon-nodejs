const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;

// connect to the db
const url = process.env.DATABASE_URL;
const dbName = "todos";

if (!url) throw new Error("Please enter a DATABASE_URL");

// connect to the db
let cachedClient = null;
let cachedDb = null;

// we'll also cache a version of the client and db so we dont connect too many times
module.exports = async function connectToDatabase() {
  // return the cached versions if they exist
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // write the cert to a temporary file
  // we need app platform to be able to read the file
  // we will pull the cert from environment variables and write it to a temporary file
  // fs.writeFileSync("./ca-certificate.crt", cert);

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsCAFile: "./ca-certificate.crt",
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
};
