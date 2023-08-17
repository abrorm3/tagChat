const mongo = require('mongodb').MongoClient;
const { Server } = require("socket.io");
const http = require("http");

// Create an HTTP server
const server = http.createServer();
const io = new Server(server);

// MongoDB connection URL
const mongoDBURL = 'mongodb+srv://abrormukhammadiev:789654123Abror@tagchat-cluster.u3ihlha.mongodb.net/?retryWrites=true&w=majority';

async function connectToMongo() {
    try {
        const client = await mongo.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');

        // Listen for socket connections
        io.on('connection', (socket) => {
            console.log('A user connected');

            // Get a reference to the chats collection
            const chat = client.db().collection('chats');

            // Emit chat history
            chat.find().limit(100).sort({_id: 1}).toArray((err, res) => {
                if (err) {
                    throw err;
                }
                socket.emit('output', res);
            });

            // Handle input events
            socket.on('input', (data) => {
                let name = data.name;
                let message = data.message;

                if (name === '' || message === '') {
                    socket.emit('status', 'Please enter a name and message');
                } else {
                    // Insert message into the chat collection
                    chat.insertOne({ name: name, message: message }, (err) => {
                        if (err) {
                            throw err;
                        }
                        io.emit('output', [data]);
                        socket.emit('status', {
                            message: 'Message sent',
                            clear: true
                        });
                    });
                }
            });

            // Handle clear event
            socket.on('clear', () => {
                chat.deleteMany({}, () => {
                    io.emit('cleared');
                });
            });
            
            // Handle disconnect event
            socket.on('disconnect', () => {
                console.log('User disconnected');
            });
        });

        // Start the HTTP server
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });

    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connectToMongo();
