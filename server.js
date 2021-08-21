const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Issue = require("./models/issue");
const User = require("./models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("./config/database");

// initializing app variable with express
const app = express();
const router = express.Router();

// CORS Middleware
var corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:4000"],
};

// Body Parser Middleware
app.use(bodyParser.json());

// Body Parser Middleware
app.use(passport.initialize());
app.use(passport.session());


// Index Route
app.get("/", (req, res) => res.send("Hello test any page"));

// all issues routes
router.route("/issues").get((req, res) => {
  Issue.find((err, issues) => {
    if (err) console.log(err);
    else res.json(issues);
  });
});

router.route("/issues/:id").get((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (err) console.log(err);
    else res.json(issue);
  });
});

router.route("/issues/add").post((req, res) => {
  let issue = new Issue(req.body);
  issue
    .save()
    .then((issue) => {
      res.status(200).json({ issue: "Added successfully" });
    })
    .catch((err) => {
      res.status(400).send("Failed to create new record");
    });
});

router.route("/issues/update/:id").post((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (!issue) return next(new Error("Could not load document"));
    else {
      issue.title = req.body.title;
      issue.responcible = req.body.responcible;
      issue.description = req.body.description;
      issue.severity = req.body.severity;
      issue.status = req.body.status;

      issue
        .save()
        .then((issue) => {
          res.json("Update done");
        })
        .catch((err) => {
          res.status(400).send("Update failed");
        });
    }
  });
});

router.route("/issues/delete/:id").get((req, res) => {
  Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});

mongoose.connect(
  "mongodb+srv://anna01:avmongo1980@cluster0.2xgr1.mongodb.net/productsDB?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true }
);
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("connected to DB!");
});
app.use(cors());

// Set Static Folder
const path = require("path");
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/", router);

// Start Server
app.listen(4000, () => console.log("Express server running on port 4000"));
