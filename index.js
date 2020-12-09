require('dotenv').config();
const server = require('./api/server');
const PORT = 2323;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})