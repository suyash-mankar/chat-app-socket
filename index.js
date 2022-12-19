const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-app-t7c1.onrender.com",
  },
});

let users = [];

const addUser = (userData, clientId) => {
  // if the userData doesn't exist in users array
  !users.some((user) => user.sub === userData.sub) &&
    users.push({ ...userData, clientId });
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (client) => {
  console.log("user connected");

  client.on("addUsers", (userData) => {
    addUser(userData, client.id);
    io.emit("getUsers", users);
  });

  client.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user.clientId).emit("getMessage", data);
  });
});

server.listen(9000);
