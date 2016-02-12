#!/usr/bin/env node

var amqp = require('amqplib');
var ch, conn, q;

amqp.connect('amqp://localhost').then(function(_conn) {
    conn = _conn;
    return conn.createChannel();
})
.then(function(_ch) {
    q = 'hello';
    ch = _ch;

    return ch.assertQueue(q, {durable: true});
})
.then(function(){
    return ch.sendToQueue(q, new Buffer('Hello World!'));
})
.then(function(){
    console.log(" [x] Sent 'Hello World!'")
});

setTimeout(function() { conn.close(); process.exit(0) }, 500);

//amqp.connect('amqp://localhost', function(err, conn) {
//    conn.createChannel(function(err, ch) {
//        var q = 'task_queue';
//        var msg = process.argv.slice(2).join(' ') || JSON.stringify({ text:"Hello World!", version:"12345678" });
//
//        ch.assertQueue(q, {durable: true});
//        ch.sendToQueue(q, new Buffer(msg), {persistent: true});
//        console.log(" [x] Sent '%s'", msg);
//    });
//    setTimeout(function() { conn.close(); process.exit(0) }, 500);
//});