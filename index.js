var aedes = require('aedes')(),
    mqtt_port = process.env.MQTT_PORT || 1883,
    logPath = process.env.LOG_PATH || 'mqtt.log',
    winston = require('winston');

var logger = new winston.Logger({
    level: 'silly',
    transports: [
        new winston.transports.Console({
            timestamp: true
        }),
        new winston.transports.File({
            filename: 'mqtt.log',
            timestamp: true
        })
    ]
});


var mqtt = require('net').createServer(aedes.handle);

mqtt.listen(mqtt_port, function() {
    logger.debug('mqtt listen started', {});
});

aedes.on('client', function(client) {
  logger.debug('client connect', {
    topic: '/',
    action: 'connect',
    message: client.id
  });
});

aedes.on('clientDisconnect', function(client) {
    logger.debug('client disconnect', {
    topic: '/',
    action: 'disconnect',
    message: client.id
  });
});

aedes.on('subscribe', function(topic, client) {
    logger.debug('client subscribe', {
    topic: '/',
    action: 'subscribe',
    message: client.id + ' ' + JSON.stringify(topic)
  });
});

aedes.on('unsubscribe', function(topic, client) {
    logger.debug('client unsubscribe', {
    topic: '/',
    action: 'unsubscribe',
    message: client.id + ' ' + JSON.stringify(topic)
  });
});

aedes.on('publish', function(packet, client) {

  if(! client) return;
  
  packet.payloadString = packet.payload.toString();
  packet.payloadLength = packet.payload.length;
  packet.payload = JSON.stringify(packet.payload);
  packet.timestamp = new Date();
    logger.info('publish.', {
        topic: packet.topic,
        payload: packet.payloadString
    });
  logger.debug('client publish', {
    topic: '/',
    action: 'publish',
    message: client.id + ' ' + packet.topic
  });

});
