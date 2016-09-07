var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var ex = "direct_logs";
        var msg = process.argv.slice(2).join(' ') || 'helloworld';
        ch.assertExchange(ex, 'direct', { durable: false });

        ch.assertQueue('', { exclusive: true }, function (err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            args.forEach(function(severity) {
                ch.bindQueue(q.queue, ex, severity);    
            }, this);
            
            ch.consume(q.queue, function (msg) {
                var secs = msg.content.toString().split('.').length - 1;
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
                setTimeout(function () {
                    console.log(" [x] Done for" + msg.content.toString());
                    ch.ack(msg);
                }, secs * 1000);
            }, { noAck: false });

        })

    });

    //setTimeout(function() { conn.close(); process.exit(0) }, 500);

})
