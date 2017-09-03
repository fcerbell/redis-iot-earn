var express = require('express');

module.exports = (function() {
    'use strict';
    var viewsRoute = express.Router();

    // Main page
    viewsRoute.get('/', function(req, res) {
        res.render('index');
    });

    // Contents
    viewsRoute.get('/home', function(req, res) {
        res.render('templates/home');
    });

    return viewsRoute;
})();

