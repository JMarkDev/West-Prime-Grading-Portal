const express = require("express");
const database = require("./src/config/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const verifyToken = require("./src/middlewares/verifyToken");
const refreshToken = require("./src/middlewares/refreshToken");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const notificationRoute = require("./src/routes/notificationRoute");
const studentRoute = require("./src/routes/studentRoute");
const courseRoute = require("./src/routes/courseRoute");
const gradeRoute = require("./src/routes/gradeRoute");
const subjectRoute = require("./src/routes/subjectRoute");
const schoolYearRoute = require("./src/routes/schoolYearRoute");
const classRoute = require("./src/routes/classRoute");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173"],
  // origin: ["http://192.168.1.8:3000", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
// built in middleware the handle urlencoded data
// in other words form data;
// 'content-type: application/x-www-form-urlencoded'
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  res.sendFile(`${__dirname}/uploads/${filename}`);
});

// public routes no token required

app.use("/auth", authRoute);
// refresh token route
app.post("/refresh", refreshToken, async (req, res) => {
  return res.json({ message: "refresh" });
});

//protected route
app.use("/protected", verifyToken, async (req, res) => {
  return res.json({
    user: req.user,
    message: "You are authorized to access this protected resources.",
  });
});

// check verify user middleware
app.use(verifyToken);

app.use("/users", userRoute);
app.use("/notification", notificationRoute);
app.use("/students", studentRoute);
app.use("/courses", courseRoute);
app.use("/grades", gradeRoute);
app.use("/subjects", subjectRoute);
app.use("/schoolyears", schoolYearRoute);
app.use("/classes", classRoute);

app.get("/");
// Server setup
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  allowEIO3: true,
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("add_animal", (data) => {
    socket.broadcast.emit("success_add", data);
  });

  socket.on("new_notification", (data) => {
    socket.broadcast.emit("success_notification", data);
  });
});

// if (process.env.DEVELOPMENT !== "test") {
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  database.authenticate();
  database
    .sync({ force: false }) // delelte all data in the database
    // .sync({ alter: true })
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error("Error connecting to the database: ", error);
    });
});
// }

module.exports = app;
// add seeders and use id that already exit in database when it have foreignkey
