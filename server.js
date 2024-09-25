const http = require('http');
const app = require('./app');
 const port = 4001

const server = http.createServer(app)

    
server.listen(port, () => {
    console.log(`the server is running on http://localhost:${port}`);
})