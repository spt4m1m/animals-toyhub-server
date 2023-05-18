const express = require('express');
const path = require('path');
const cors = require('cors');
const colors = require('colors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares 
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port, () => {
    console.log(`Server Running On PORT ${port}`.yellow);
})