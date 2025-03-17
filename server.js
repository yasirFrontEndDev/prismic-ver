const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling request:', err);
            res.statusCode = 500;
            res.end('Internal Server Error');
        }
    });

    // Initialize Socket.IO
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected to Socket.IO');

        socket.emit('message', {
            type: 'connection',
            message: 'Connected to server'
        });

        socket.on('message', (data) => {
            try {
                console.log('Received:', data);
                socket.emit('message', {
                    type: 'message',
                    data
                });
            } catch (error) {
                console.error('Error processing message:', error);
                socket.emit('message', {
                    type: 'error',
                    message: 'Error processing message'
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from Socket.IO');
        });

        socket.on('error', (err) => {
            console.error('Socket.IO error:', err);
        });
    });

    // Export broadcast function for other modules to use
    global.broadcast = function broadcast(message) {
        io.emit('message', {
            type: 'broadcast',
            message
        });
    };

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
