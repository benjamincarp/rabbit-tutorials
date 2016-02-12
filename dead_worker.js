#!/usr/bin/env node

var amqp = require('amqplib');
var ch, conn;

var live_q = 'live_queue';
var live_x = 'live-exchange';

var wait_q = 'wait_queue';
var wait_x = 'wait-exchange';
var waitQueueOptions = { arguments: { "x-dead-letter-exchange": live_x}, durable: true };

function recieve(msg){
    var messageObject = msg.properties;
    var headers = msg.properties.headers;

    console.log(" [x] Received %s", msg.content.toString());

    var expiration = 100;
    if (headers["x-death"]) {
        expiration = (headers["x-death"][0]["original-expiration"] * 3);
        if (!headers.deaths) headers.deaths = [];
        headers.deaths.push(headers["x-death"]);
        delete(headers["x-death"]);
    }

    //add some randomness here

    if (expiration < 10000) {  //this is our message failed processing condition
        var messageOptions = {
            persistent: true,
            headers: headers,
            expiration: expiration.toString()
        };

        console.log(" [-] Wait time is %s ms", expiration);

        ch.publish(wait_x, '', msg.content, messageOptions);
    }

    return ch.ack(msg);
}

amqp.connect('amqp://localhost').then(function(_conn) {
    conn = _conn;
    return conn.createChannel();
})
.then(function(_ch) {
    ch = _ch;

    return ch.assertExchange(wait_x, 'direct', {durable: true});
})
.then(function(){ return ch.assertQueue(wait_q, waitQueueOptions); })
.then(function(){ return ch.bindQueue(wait_q, wait_x, ''); })
.then(function(){
    return ch.prefetch(1)
})
.then(function(){ return ch.consume(live_q, recieve, {noAck: false}); })
.then(function(){ console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", live_q); });
