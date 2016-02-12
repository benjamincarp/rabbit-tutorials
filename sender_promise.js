#!/usr/bin/env node

var amqp = require('amqplib');


amqp.connect('amqp://localhost').then(function(conn) {
    conn.createChannel().then(function(ch) {
        var q = 'hello';

        ch.assertQueue(q, {durable: true})
            .then(ch.sendToQueue(q, new Buffer('Hello World!')))
            .then(function(ok){ console.log(" [x] Sent 'Hello World!'") });
    });
    setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

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