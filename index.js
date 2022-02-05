const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middle war

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifldk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database Connected", new Date().toTimeString());
    const db = client.db("marchbd");
    const user_collection = db.collection("user");
    const task = db.collection('task');
    const submit = db.collection("submit");
    // add user database
    app.post("/user", async (req, res) => {
      const data = req.body;
      const result = await user_collection.insertOne(data);
      res.json(result);
    });
    app.get("/user", async (req, res) => {
      const result = await user_collection.find({}).toArray();
      res.send(result);
    });
    // task post
    app.post('/task', async (req, res) => {
      const tasks = req.body;
      const result = await task.insertOne(tasks);
      res.send(result);
    })
    app.get('/task', async (req, res) => {
      const result = await task.find({}).toArray();
      res.send(result);
    })
    
     app.get("/tasks", async (req, res) => {
       const email = req.query.email
       const filter = { email: email };
       const result = await task.find(filter).toArray();
       res.send(result);
     });
     app.post('/submit', async (req, res) => {
      const tasks = req.body;
      const result = await submit.insertOne(tasks);
      res.send(result);
     })
    app.get('/submit/:id', async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: ObjectId(id) };
       const result = await submit.find(cursor).toArray();
      res.send(result);
    })
    app.put("/submit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          task: req.body.task,
        },
      };
      const result = await submit.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    app.get("/submit", async (req, res) => {
      const result = await submit.find({}).toArray();
      res.send(result);
    });
    app.delete("/submit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await submit.deleteOne(filter);
      res.send(result);
    });
  } finally {
    //    await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("Server Side is running");
  res.send("I am ready to go");
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});
