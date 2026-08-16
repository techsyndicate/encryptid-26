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
  }),
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
      if (currentDate < 1786734000000) return res.redirect("/countdown");
    }
    const allUsers = await User.find().select("-logs").sort({
      points: "desc",
      lastAnswered: "asc",
    });
    const foundChallenges = await Challenge.find().sort({ challengeId: 1 });
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
  proxyRouter,
);
app.use("/admin", ensureAuthenticated, ensureAdmin, forwardBanned, adminRouter);
app.use("/check", ensureAuthenticated, forwardBanned, checkRouter);

// app.get("/christopherjudge", (req, res) => {
//   res.redirect("https://docs.google.com/document/d/1My90xlY84EarocIPKw02JpBQCXczTr0Lze0lRRh5DJo/edit?tab=t.0")
// })

app.get("/timessquare", (req, res) => {
  return res.end(`1) By day I am non-existent, but by night I hold full sway,
I weave vivid worlds from shadows when the light has faded away.
I can craft you soaring castles or lead you down dark halls,
Painting landscapes in your mind before the morning calls.
I am the architect of your sleeping mind - Who Am I?

2) (64,2,1) (193,8,10) (209, 8, 20) ( 269,6,1) (141,4,13) 
   (56, 5, 19) (56, 7, 4) (205, 3, 1) (237, 5 ,28) (138, 6, 14)`);
});

app.get("/apollo11", (req, res) => {
  return res.end(`👩🐤👬👐👤👜👡👍👥🐩👚🐗🐗👏🐱🐬🐧🐩🐗💹💮🐗👐🐱🐬🐧🐪`);
});

app.get("/nooneelse", (req, res) => {
  return res.end(`3VH9dtxW`);
});

app.get("/mclaren", (req, res) => {
  return res.end(`https://www.dropbox.com/scl/fi/bxh39g9uiv7mq60785nmg/spectrotraceaudio.wav?rlkey=ol4a05nn3t4wymg1oqowp8oed&st=373m61t9&dl=0
  მტრების დასაბნევად, პირველ რიგში, საკუთარი თავი უნდა დააბნიო.`);
});

app.get("/christopherjudge", (req, res) => {
  return res.redirect(
    "https://drive.google.com/file/d/1IgpRCk8jqJYtNxNwQHq21SzqxwOyZZdR/view?usp=sharing",
  );
});

app.get("/godlike", (req, res) => {
  // return res.redirect("https://www.dropbox.com/scl/fi/ziuiekgb1b0l6lua868jc/whats-this.png?rlkey=53xicvrstdk8hncfhbwv9o28m&st=grvb7x6o&dl=0")
  res.render("godlike");
});

app.get("/025114592", (req, res) => {
  // return res.redirect("https://www.dropbox.com/scl/fi/ziuiekgb1b0l6lua868jc/whats-this.png?rlkey=53xicvrstdk8hncfhbwv9o28m&st=grvb7x6o&dl=0")
  res.render(
    "https://www.dropbox.com/scl/fi/ffmfqvm38e88wsigequ3z/puzzlepiece4.png?rlkey=u0s53r1l0l23fqhfwrwm4pzcm&st=geusjrey&dl=0",
  );
});
app.get("/michaeladamthwaite", (req, res) => {
  // return res.redirect("https://www.dropbox.com/scl/fi/ziuiekgb1b0l6lua868jc/whats-this.png?rlkey=53xicvrstdk8hncfhbwv9o28m&st=grvb7x6o&dl=0")
  res.render("michaeladamthwaite");
});

app.get("/charliekirk", (req, res) => {
  return res.redirect("https://drive.google.com/file/d/1lGzYFbPhyOHDb67U04Da_6CsXNwYUoU3/view?usp=sharing");
})

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
