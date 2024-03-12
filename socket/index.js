const { instrument } = require("@socket.io/admin-ui");

var io = null;

const initSocket = (server) => {
  io = require("socket.io")(server, {
    transports: ["websocket"],
    cors: {
      origin: ["*"],
      credentials: false,
    },
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("message", (msg) => {
      console.log(msg);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("notify", (msg) => {});
  });
};

const sendMessage = (message) => {
  io.sockets.emit("message", message);
};

const notify = (message) => {
  io.sockets.emit("notify", message);
};

const joinAdminRoom = () => {};

module.exports = {
  io,
  initSocket,
  sendMessage,
  notify,
};
