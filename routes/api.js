var express = require('express');

var redis = require("redis"),
        client = redis.createClient();
//        client = redis.createClient(14658,"redis-14658.demo.francois.demo-rlec.redislabs.com");

module.exports = (function() {
    'use strict';
    var api = express.Router();

    // Get history of n values for a device
    api.get('/',function(req,res){
        client.smembers('myset',function(err,reply){
            res.json(reply);
        });
    });
    
    // Set a friendly name to a device
    api.post('/',function(req,res){
        client.sadd('myset',req.body.item);
        res.json({"result":"received"});
    });

    return api;
})();
