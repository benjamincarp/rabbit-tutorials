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
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
});

//amqp.connect('amqp://localhost', function(err, conn) {
//    conn.createChannel(function(err, ch) {
//        var q = 'task_queue';
//
//        ch.assertQueue(q, {durable: true});
//        ch.prefetch(1);
//        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
//        ch.consume(q, function(msg) {
//            console.log(" [x] Received :");
//            console.dir(JSON.parse(msg.content));
//            ch.ack(msg);
//        }, {noAck: false});
//    });
//});