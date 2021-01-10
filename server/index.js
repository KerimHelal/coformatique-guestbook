const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/coformatique-db', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/message.routes')(app);
require('./app/routes/replies.routes')(app);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

