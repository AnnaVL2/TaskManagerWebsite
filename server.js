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

// require('./config/passport')(passport);
// const passportAunt = require('./config/passport')(passport);

// app.post(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   function (req, res) {
//     res.send(req.user.profile);
//   }
// );

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

/////// users /////// users /////// users /////// users ///////

router.route("/users").get((req, res) => {
  User.find((err, users) => {
    if (err) console.log(err);
    else res.json(users);
  });
});
router.route("/users/:id").get((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) console.log(err);
    else res.json(user);
  });
});

// Register
router.route("/users/register").post((req, res, next) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  User.addUser(user, (err, user) => {
    if (err) {
      res.status(400).send("Failed to create new user");
    } else {
      res.status(200).json({ user: "User added successfully" });
    }
  });
});

// // Authenticate
// router.route("/users/authenticate").post((req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   require("./config/passport")(passport);

//   User.getUserByUsername(username, (err, user) => {
//     if (err) throw err;
//     if (!user) {
//       return res.json({ success: false, msg: "User not found" });
//     }
//     User.comparePassword(password, user.password, (err, isMatch) => {
//       if (err) throw err;
//       if (isMatch) {
//         const token = jwt.sign(user, config.secret, {
//           expiresIn: 72000, // 2 hours
//         });

//         res.json({
//           success: true,
//           token: "JWT " + token,
//           user: {
//             id: user._id,
//             name: user.name,
//             username: user.username,
//             email: user.email,
//           },
//         });
//       } else {
//         return res.json({ success: false, msg: "Wrong password" });
//       }
//     });
//   });
// });

// // Profile
// router
//   .route("/users/profile", passport.authenticate("jwt", { session: false }))
//   .get((req, res, next) => {
//     res.json({ user: req.user });
//   });

router.route("/users/update/:id").post((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) return next(new Error("Could not load document"));
    else {
      user.name = req.body.name;
      user.email = req.body.email;
      user.username = req.body.username;
      user.password = req.body.password;

      user
        .save()
        .then((user) => {
          res.json("Update done");
        })
        .catch((err) => {
          res.status(400).send("Update failed");
        });
    }
  });
});
router.route("/users/delete/:id").get((req, res) => {
  User.findByIdAndRemove({ _id: req.params.id }, (err, user) => {
    if (err) res.json(err);
    else res.json("Removed successfully");
  });
});

router.route("/users/profile").get((req, res) => {
  res.send("PROFILE");
});

router.route("/users/validate").post((req, res) => {
  res.send("VALIDATE");
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
