var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var ex = "logs";
        var msg = process.argv.slice(2).join(' ') || 'helloworld';
        ch.assertExchange(ex, 'fanout', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            ch.bindQueue(q.queue, ex, '');

            ch.consume(q.queue, function (msg) {
                var secs = msg.content.toString().split('.').length - 1;
                console.log(" [x] Received %s", msg.content.toString());
                setTimeout(function () {
                    console.log(" [x] Done for" + msg.content.toString());
                    ch.ack(msg);
                }, secs * 1000);
            }, { noAck: false });

        })

    });

    //setTimeout(function() { conn.close(); process.exit(0) }, 500);

})
