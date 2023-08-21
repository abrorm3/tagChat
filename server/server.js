const mongo = require("mongodb").MongoClient;
const { Server } = require("socket.io");
const http = require("http");
const dotenv = require('dotenv');
dotenv.config();

const server = http.createServer();
const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:4200",
//     methods: ["GET", "POST"],
//   },
});

// MongoDB connection URL
const mongoDBURL = process.env.mongoDBURL;
  

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
      const chatCollection = client.db().collection("chats");

      const chatDocuments = await chatCollection.find({}).sort({_id: -1}).limit(120).toArray();
      const messagesInDesiredOrder = chatDocuments.reverse();

      socket.emit("records", messagesInDesiredOrder);

      socket.on("input", async (data) => {
        let name = data.name;
        let message = data.message;
        let tags = data.tags || [];
      
        if (name === "" || message === "") {
          socket.emit("status", "Please enter a name and message");
        } else {
          const chatDocument = {
            name: name,
            message: message,
            tags: tags,
          };
      
          chatCollection.insertOne(chatDocument, (err) => {
            if (err) {
              throw err;
            }
          });
      
          io.emit("output", chatDocument);
          socket.emit("status", {
            message: "Message sent",
            clear: true,
          });
      
          // Emit the filtered messages to the client
          const filteredMessages = messagesInDesiredOrder.filter((message) => {
            if (tags.length === 0) {
              return true; // Show all messages if no tags are selected
            }
      
            // Check if message tags are defined and contain at least one of the selected tags
            return (
              message.tags &&
              message.tags.some((tag) => tags.includes(tag))
            );
          });
          socket.emit("filteredMessages", filteredMessages);
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
