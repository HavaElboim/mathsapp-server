const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://user-connect:12345@cluster0.1dbbw.mongodb.net/mathsapp-server?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

var cors = require("cors");
app.use(cors());

const userSchema = new mongoose.Schema({
  userType: String, //whether the user is a student or a teacher
  email: String,
  userName: String,
  phoneNum: Number,
  grade: String,
  classGroup: Number,
  playingLevel: Number,
  grades: [Schema.Types.ObjectId],
});

const classSchema = new mongoose.Schema({
    classGroup: Number,
    teacherID: Number,
    tests: [Schema.Types.ObjectId],
    exercises: [Schema.Types.ObjectId]
});

const User = mongoose.model("User", userSchema);
const Class = mongoose.model("Class", classSchema);

app.get("/api/users", async (req, res) => {
  console.log("search for all users");
  User.find({})
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ success: false }));
});

app.get("/api/classes", async (req, res) => {
    console.log("search for all classes");
    User.find({})
      .then((classes) => res.json(classes))
      .catch((err) => res.status(404).json({ success: false }));
  });

app.get("/api/users/:id", async (req, res) => {
  console.log("received request for user id: ", req.params.id);

  const { id } = req.params.id; ///here we do destructuring - we take out the params called id from the params array

  User.findById(req.params.id).exec(function (err, user) {
    if (err) {
      console.error("Error retrieving user by id!");
    } else {
      console.log("server user = " + JSON.stringify(user));
      res.json(user);
    }
  });
});

app.get("/api/classes/:id", async (req, res) => {
    console.log("received request for class id: ", req.params.id);
  
    const { id } = req.params.id; ///here we do destructuring - we take out the params called id from the params array
  
    User.findById(req.params.id).exec(function (err, user) {
      if (err) {
        console.error("Error retrieving user by id!");
      } else {
        console.log("server class = " + JSON.stringify(user));
        res.json(user);
      }
    });
  });

// post: to add a user to the database
// - must define Schema for documents (records) in the database


  app.post("/api/users", (req, res) => {
    const { userType, email, userName, phoneNum, grade, classGroup, playingLevel, grades } = req.body;
    console.log("adding user: ", userType, email, userName, phoneNum, grade, classGroup, playingLevel, grades);
    const user = await new User({userType, email, userName, phoneNum, grade, classGroup, playingLevel, grades}).save();
    console.log("POST!", user);
    res.send(user);
  });

  app.post("/api/classes", (req, res) => {
    const { classGroup, teacherID, tests, exercises } = req.body; 
    console.log("adding class: ", classGroup, teacherID, tests, exercises);
    const user = await new Class({classGroup, teacherID, tests, exercises}).save();
    console.log("POST!", class);
    res.send(class);
  });

  // put : to change a value of an item in the database
// define the put as an async function
app.put("/api/users/:id", async (req, res) => {
    const { userType, email, userName, phoneNum, grade, classGroup, playingLevel, grades } = req.body; // pass the new title in the body of the put request
    await User.updateOne({ _id: req.params.id }, { userType, email, userName, phoneNum, grade, classGroup, playingLevel, grades }, {omitUndefined=true}).exec();
  
    res.send("OK!");
  });

  app.put("/api/classes/:id", async (req, res) => {
    const { classGroup, teacherID, tests, exercises } = req.body; // pass the new title in the body of the put request
    await Class.updateOne({ _id: req.params.id }, { classGroup, teacherID, tests, exercises }, {omitUndefined=true}).exec();
  
    res.send("OK!");
  });

  app.delete("/api/users/:id", async (req, res) => {
    console.log("id to delete: ", req.params.id);
    await User.deleteOne({ _id: req.params.id }).exec();
  
    res.send("ok!");
  });

  app.delete("/api/classes/:id", async (req, res) => {
    console.log("id to delete: ", req.params.id);
    await Class.deleteOne({ _id: req.params.id }).exec();
  
    res.send("ok!");
  });

  // The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
  
  const PORT = process.env.PORT || 5000;
  
  //  listen for any requests that come in on port PORT (8000)
  
  app.listen(PORT, () => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      // we're connected!
    });
    //  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
    console.log(`CORS-enabled web server listening on port ${PORT}`);
  });
  