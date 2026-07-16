const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers"); // That is use for argument.It is available in yargs

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("Start", "Start a new Server", {}, StartServer)
  .command("init", "Initialise a new repository", {}, initRepo) // command init is 1st reporsitory

  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to staging area",
        type: "string",
      });
    },
    // addRepo,       //edit after addFile logic
    (argv) => {
      addRepo(argv.file);
    },
  )

  .command(
    "commit <message>",
    "Commit the staged file",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    // commitRepo,   //edit after commitChange logic
    (argv) => {
      commitRepo(argv.message);
    },
  )

  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    // revertRepo,
    (argv) => {
      revertRepo(argv.commitID);
    },
  )

  .demandCommand(1, "Yor need at least one command")
  .help().argv;

function StartServer() {
  // console.log("Server login called");
  const app = express();
  const port = process.env.PORT || 3002;

  app.use(bodyParser.json());
  app.use(express.json());

  //Yaha se comment out for running in local browser
  app.use(                         
    cors({
      origin: [
        "https://github-frontend-p7w2.onrender.com",
        "http://localhost:5173",
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    }),
  );
//yaha tak  or niche code one line
  const mongoURL = process.env.MONGODB_URL;

  mongoose
    .connect(mongoURL)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("Unable to connect", err));

  // app.use(cors({ origin: '*'}));       //local browser me chalane ke liye isse  uncomment kr ke again github pr push kre phir attomatically deploy ho jayega

  // app.get("/", (req, res) =>{           //This is temporory, just use checking after that paste in routes
  //   res.send("Welcome!");
  // });

  app.use("/", mainRouter); //after remove the app.get

  let user = "test";
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("====");
      console.log(user);
      console.log("====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;

  db.once("open", async () => {
    console.log("CRUD operations called");
    //CRUD operations
  });

  httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
