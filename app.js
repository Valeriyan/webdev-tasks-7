const express = require('express');
const hbs = require('hbs');

const app = express();
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/server/bundles`);
app.use(express.static(`${__dirname}/public`));

require('./routes.js')(app);

app.listen(process.env.PORT || 8080);
