var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(err, conn){
    conn.createChannel(function(err, ch){
        var q = "fireonwheels";
        //ch.assertQueue(q, {durable:false});
        ch.consume(q, function(msg){
            console.log(" [x] received %s", msg.content.toString());            
        }, {noAck:true});
    });

    setTimeout(function() { conn.close(); process.exit(0) }, 500);

})
