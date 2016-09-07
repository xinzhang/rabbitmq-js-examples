var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = "task_queue";

        ch.assertQueue(q, { durable: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);

        ch.prefetch(1);
        ch.consume(q, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;
            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function () {
                console.log(" [x] Done for" + msg.content.toString() );
                ch.ack(msg);
            }, secs * 1000);
        }, {noAck: false});

    });

    //setTimeout(function () { conn.close(); process.exit(0) }, 500);

})
