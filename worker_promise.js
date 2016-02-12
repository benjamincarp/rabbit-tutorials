#!/usr/bin/env node

var amqp = require('amqplib');
var ch, conn;
var q = 'task_queue';

amqp.connect('amqp://localhost').then(function(_conn) {
    conn = _conn;
    return conn.createChannel();
})
.then(function(_ch) {
    ch = _ch;
    return ch.assertQueue(q, {durable: true});
})
.then(function(){ return ch.prefetch(1) })
.then(function(){
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: false});
});
