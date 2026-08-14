require("dotenv").config();

const express = require("express"),
  app = express(),
  path = require("path"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  flash = require("express-flash"),
  session = require("express-session"),
  PORT = process.env.PORT || 5001,
  loginRouter = require("./routers/loginRouter"),
  browserRouter = require("./routers/browserRouter"),
  proxyRouter = require("./routers/proxyRouter"),
  regRouter = require("./routers/regRouter"),
  adminRouter = require("./routers/adminRouter"),
  checkRouter = require("./routers/checkRouter"),
  { checkCmd } = require("./utils/bash"),
  {
    ensureAuthenticated,
    forwardAuthenticated,
    ensureAdmin,
    forwardBanned,
  } = require("./utils/authenticate"),
  User = require("./schemas/userSchema"),
  Challenge = require("./schemas/challengeSchema"),
  passportInit = require("./utils/passport-config"),
  bcrypt = require("bcrypt"),
  MongooseSessionStore = require("./utils/mongoose-store");

mongoose.connect(process.env.MONGO_URI, console.log("MONGODB CONNECTED"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
passportInit(passport);
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongooseSessionStore(),
    cookie: {
      secure: "auto",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res) => {
  try {
    const myUser = req.user;
    if (!myUser) return res.redirect("/login");
    if (myUser.banned) return res.redirect("/banned");
    if (!myUser.admin) {
      const currentDate = Date.now();
      if (currentDate < 1786732200000) return res.redirect("/countdown");
    }
    const allUsers = await User.find().sort({
      points: "desc",
      lastAnswered: "asc",
    });
    const foundChallenges = await Challenge.find().sort({ title: 1 });
    const cryptChallenges = await Challenge.find({ type: "cryptic" }).sort({
      title: 1,
    });
    res.render("index", {
      challenges: foundChallenges,
      user: myUser,
      allUsers,
    });
  } catch (error) {
    console.log(error);
    res.end("something went wrong. please try again.");
  }
});
app.get("/leaderboard", async (req, res) => {
  const allUsers = await User.find().sort({
    points: "desc",
    lastAnswered: "asc",
  });
  res.render("leaderboard", { allUsers: allUsers });
});
app.get("/countdown", ensureAuthenticated, (req, res) => {
  res.render("countdown");
});

app.post("/check/cmd", async (req, res) => {
  if (!req.user) return res.end("no user found");
  const { cmd } = req.body;
  const cmdResult = await checkCmd(cmd, req.user);
  return res.end(cmdResult);
});
app.post("/getuser", async (req, res) => {
  if (!req.user) return res.end("guest");
  return res.end(req.user.name);
});
app.get("/banned", (req, res) => {
  res.render("banned");
});

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
    return res.redirect("/login");
  });
});

app.post("/changeProfile", async (req, res) => {
  try {
    const user = req.user,
      { displayName } = req.body;
    if (displayName == user.name) return res.json({ success: true });
    if (!displayName || displayName == "")
      return res.json({ success: false, message: "Display name is empty!" });
    const foundUser = await User.findOne({ name: displayName });
    if (foundUser)
      return res.json({
        success: false,
        message: "Display name already exists!",
      });
    await User.findByIdAndUpdate(user.id, {
      name: displayName,
    });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Something went wrong." });
  }
});
app.use("/login", forwardAuthenticated, loginRouter);
app.use("/register", forwardAuthenticated, regRouter);
app.use("/browser", ensureAuthenticated, forwardBanned, browserRouter);
app.use(
  "/enableAndConfigureProxy",
  ensureAuthenticated,
  forwardBanned,
  proxyRouter
);
app.use("/admin", ensureAuthenticated, ensureAdmin, forwardBanned, adminRouter);
app.use("/check", ensureAuthenticated, forwardBanned, checkRouter);

app.listen(PORT, console.log(`RoboVM listening on port ${PORT}`));

// const User = require('./schemas/userSchema')
// async function testDo() {
//     const hashedPassword = await bcrypt.hash('test', 10)
//     const newUser = new User({
//         fname: 'Test',
//         lname: 'Test',
//         username: 'ctfuser',
//         password: hashedPassword
//     })
//     await newUser.save()
// }
// testDo()
