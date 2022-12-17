const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userData, clientId) => {
  // if the userData doesn't exist in users array
  !users.some((user) => user.sub === userData.sub) &&
    users.push({ ...userData, clientId });
};

io.on("connection", (client) => {
  console.log("user connected");

  client.on("addUsers", (userData) => {
    addUser(userData, client.id);
  });
});

server.listen(9000);
