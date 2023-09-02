const express = require('express');
const path = require('path');
const app = express();

const buildDir = '../client/build';

app.use(express.static(path.join(__dirname, buildDir)));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});