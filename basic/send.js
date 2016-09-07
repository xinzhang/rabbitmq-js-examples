var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn){
    conn.createChannel(function(err, ch){
        var q = "fireonwheels";
        ch.assertQueue(q, {durable:true});
        ch.sendToQueue(q, new Buffer('hello world'));
    });

    setTimeout(function() { conn.close(); process.exit(0) }, 500);

})
