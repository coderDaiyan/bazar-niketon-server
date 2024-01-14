const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());
const port = 4000;
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://bazarUser:bazaruser12345@cluster0.b8m43.mongodb.net/bazarNiketonDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const productsCollection = client
    .db("bazarNiketonDatabase")
    .collection("products");

  const ordersCollection = client
    .db("bazarNiketonDatabase")
    .collection(`orders`);

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

  app.get("/product/:id", (req, res) => {
    productsCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
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

  app.post("/addOder", (req, res) => {
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    ordersCollection
      .find({ email: req.query.email })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
  console.log("MongoDB Connected");
});

app.get("/", (req, res) => {
  res.send("Look Bruh! I'm Using MONGODB");
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
