const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (client) => {
  console.log("user connected");
});
server.listen(9000);
