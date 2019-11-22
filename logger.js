var bunyan = require('bunyan');
const bunyantcp = require('bunyan-logstash-tcp');

exports.loggerInstance = bunyan.createLogger({
  name: 'transaction-notifier',
  serializers: {
    req: require('bunyan-express-serializer'),
    res: bunyan.stdSerializers.res,
    err: bunyan.stdSerializers.err,
  },
  level: 'info',
  streams: [
    {
      stream: process.stdout,
    },
    {
      level: 'debug',
      type: 'raw',
      stream: bunyantcp.createStream({
        host: '127.0.0.1',
        port: 5000,
      }),
    },
  ],
});

exports.logResponse = function(id, body, statusCode) {
  var log = this.loggerInstance.child(
    {
      id: id,
      body: body,
      statusCode: statusCode,
    },
    true
  );
  log.info('response');
};

exports.stream = {
  write: (message, body) => this.loggerInstance.info(message),
};
