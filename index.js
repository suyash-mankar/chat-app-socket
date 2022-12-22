function requestHandler(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("<h1> server is running </h1>");
}

const server = require("http").createServer(requestHandler);
const port = 5000;
const io = require("socket.io")(server, {
  // enable cors
  cors: {
    origin: "*",
  },
});

// array to keep a list of active users
var users = [];

// add active user in the users array
const addUser = (userData, clientId) => {
  // if the user already exists in the array, update the socket id (socket id will change whenever we refresh the app)
  // array.some (...) --> returns true or false
  if (users.some((user) => user.sub === userData.sub)) {
    let existingUser = users.find((user) => user.sub === userData.sub);
    existingUser.clientId = clientId;
  } else {
    // if the user doesn't exist in the users array
    users.push({ ...userData, clientId });
  }
};

// get a particular user as per given userId --> used to find the receiver when we want to send msg
const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (client) => {
  console.log("user connected");

  // when client hit "addUsers", call addUser and emit "getUsers" with users array
  client.on("addUsers", (userData) => {
    addUser(userData, client.id);
    io.emit("getUsers", users);
    console.log(users);

  });

  // when client hit "sendMessage", call getUser and emit "getMessage" with message data --> to send msg to a particular receiver
  client.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user.clientId).emit("getMessage", data);
  });
});

server.listen(port, function (err) {
  if (err) {
    console.log("error in starting socket server: ", err);
    return;
  }
  console.log("socket server is running on port: ", port);
});
