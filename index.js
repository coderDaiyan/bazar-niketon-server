const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const port = 4000;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8m43.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection(`${process.env.DB_COLLECTION}`);

  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product).then((result) => {
      res.send(result.insertedCount > 0);
      console.log("Product Added");
    });
  });

  app.get("/products", (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    productsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
        console.log("deleted");
      });
  });
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.send("Look Bruh! I'm Using MONGODB");
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
