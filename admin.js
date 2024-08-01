const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;
const classCodes = new Set();
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/adminPage.html');
});
function generateUniqueCode() {
    let code;
    do {
        code = Math.random().toString(36).substr(2, 6).toUpperCase(); // Change this as needed
    } while (classCodes.has(code));
    classCodes.add(code);
    return code;
}

app.use(bodyParser.json());

app.post('/generateCode', (req, res) => {
    const code = generateUniqueCode();
    res.json({ code });
});

app.listen(port, () => {
    console.log(`Admin Page Server is running at http://localhost:${port}`);
});
