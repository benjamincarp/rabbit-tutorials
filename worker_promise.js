#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost').then(function(conn) {
    conn.createChannel().then(function(ch) {
        var q = 'hello';

        ch.assertQueue(q, {durable: true});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {noAck: true});
    });
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