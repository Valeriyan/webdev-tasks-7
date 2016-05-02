'use strict';
const pages = require('./server/controllers/pages.js');

module.exports = (app) => {
    app.get('/', pages.index);
};
