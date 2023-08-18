const mongo = require("mongodb").MongoClient;
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection URL
const mongoDBURL =
  "mongodb+srv://abrormukhammadiev:789654123Abror@tagchat-cluster.u3ihlha.mongodb.net/?retryWrites=true&w=majority";

async function connectToMongo() {
  try {
    const client = await mongo.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
    if (client) {
      console.log("Connected to MongoDB");
    } else {
      console.log("Failed to connect to MongoDB");
    }

    io.on("connection", async (socket) => {
      console.log("A user connected");
      socket.emit("welcome", "Welcome to the chat!");
      const chatCollection = client.db().collection("chats");

      const chatDocuments = await chatCollection.find({}).toArray();

      socket.emit("records", chatDocuments);

      socket.on("input", (data) => {
        let name = data.name;
        let message = data.message;

        if (name === "" || message === "") {
          socket.emit("status", "Please enter a name and message");
        } else {
          chatCollection.insertOne({ name: name, message: message }, (err) => {
            if (err) {
              throw err;
            }
          });
          socket.emit("output", data);
          socket.emit("status", {
            message: "Message sent",
            clear: true,
          });
        }
      });

      socket.on("clear", () => {
        chat.deleteMany({}, () => {
          io.emit("cleared");
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    // Start HTTP server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

connectToMongo();
