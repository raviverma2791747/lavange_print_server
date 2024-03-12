const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
//const multer = require("multer");
const path = require("path");

// const storage = multer.memoryStorage();

const bodyParser = require("body-parser");
require("body-parser-xml")(bodyParser);
const cors = require("cors");
const dotenv = require("dotenv");
const router = require("./routes/public");
const protectedRouter = require("./routes/private/index.js");
const mongoose = require("mongoose");
// const { initScheduledJobs } = require("./helper/scheduledFunctions.js");
const { init } = require("./helper/init");
const fs = require("fs");
const errorHandler = require("./middlewares/errorHandler.js");
const { initSocket } = require("./socket/index.js");

dotenv.config();

const app = express();
const server = require("http").createServer(app);


app.set("env", process.env.NODE_ENV || "development");
app.set("trust proxy", true);

mongoose.connect(process.env.MONGO_URI);

if (app.get("env") == "production") {
  app.use(
    cors({
      origin: [
        "https://print.lavange.in",
        "https://admin-print.lavange.in",
        "https://ecommerce-one-drab-95.vercel.app",
        "http://localhost:5000",
        "https://admin.socket.io"
      ],
    })
  );
} else {
  app.use(cors());
}

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.xml({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(cookieParser());
app.use(require("express-status-monitor")());
app.use("/media", express.static(path.join(__dirname, process.env.MEDIA_PATH)));

if (app.get("env") == "production") {
  var accessLogStream = fs.createWriteStream(
    __dirname + "/logs/" + "access.log",
    { flags: "a" }
  );
  app.use(morgan("combined", { stream: accessLogStream }));
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev")); //log to console on development
}

// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms")
// );

app.get("/print", async (req, res, next) => {
  return res.json({ status: 200 });
});

app.use("/print/public", router);
app.use("/print/private", protectedRouter);

app.use(errorHandler);

//Scheduled functions
// if (app.get("env") == "production" && process.env.RUN_SCHEDULE_JOB === true) {
//   console.log("Schedule Job Ennabled")
//   initScheduledJobs();
// }

init();

initSocket(server);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(process.env.AWS_S3_BUCKET);
  console.log(`Started server in ${app.get("env")} at:`, process.env.PORT);
});
