const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/i.html');
});
app.post('/', (req, res) => {
    const enteredCode = req.body.code;

    console.log("entered code is: ",enteredCode);
    if(enteredCode == 234) res.redirect(`/${enteredCode}`);
    else {res.send('code not matched');}
});
// app.listen(port, () => {
//     console.log(`Student Page Server is running at http://localhost:${port}`);
// });
