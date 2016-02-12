#!/usr/bin/env node

var amqp = require('amqplib');
var ch, conn;

var q = 'task_queue';
var msg = process.argv.slice(2).join(' ') || JSON.stringify({ text:"Hello World!", version:"12345678" });

amqp.connect('amqp://localhost').then(function(_conn) {
    conn = _conn;
    return conn.createChannel();
})
.then(function(_ch) {
    ch = _ch;

    return ch.assertQueue(q, {durable: true});
})
.then(function(){
    return ch.sendToQueue(q, new Buffer(msg));
})
.then(function(){
    console.log(" [x] Sent  '%s'", msg)
});

setTimeout(function() { conn.close(); process.exit(0) }, 500);