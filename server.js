require("dotenv").config();

// get all the packages we need
const cors = require("cors");
const express = require("express");
const app = express();

const connectToDatabase = require("./connectToDatabase");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

/**
 * routes
 * ===========================
 * ===========================
 **/

/**
 * Home Page
 */
app.get("/", async (req, res) => {
  res.json({ message: "To.do endpoint" });
});

/**
 * Get all todo
 */
app.get("/todo", async (req, res) => {
  const { db } = await connectToDatabase();
  const todo = await db.collection("todo").find({}).toArray();
  res.json({ todo });
});

// get a single todo
app.get("/todo/:todoId", async (req, res) => {
  const { db } = await connectToDatabase();
  const todo = await db.collection("todo").findOne({ id: req.params.todoId });
  res.json({ todo });
});

// create a todo
app.post("/todo", async (req, res) => {
  const { db } = await connectToDatabase();
  const todo = await db.collection("todo").insertOne(req.body);
  res.json({ todo: todo.ops[0] });
});

// update a todo
app.put("/todo/:todoId", async (req, res) => {
  const { db } = await connectToDatabase();
  delete req.body._id;
  const todo = await db
    .collection("todo")
    .updateOne({ id: req.params.todoId }, { $set: req.body });

  res.json({ todo });
});

// delete a todo
app.delete("/todo/:todoId", async (req, res) => {
  const { db } = await connectToDatabase();
  await db.collection("todo").deleteOne({ id: req.params.todoId });
  res.json({}).status(204);
});

// express listen on 3000 and log a message
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
