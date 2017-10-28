const busboy = require('busboy');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

function handler(event, context) {
  var contentType = event.headers['Content-Type'] || event.headers['content-type'];
  var bb = new busboy({ headers: { 'content-type': contentType }});

  bb.on('file', function (fieldname, file, filename, encoding, mimetype) {
    context.log('File [%s]: filename=%j; encoding=%j; mimetype=%j', fieldname, filename, encoding, mimetype);

    file
    .on('data', data => {
      context.log('File [%s] got %d bytes', fieldname, data.length)
    })
    .on('end', () => {
      context.log('File [%s] Finished', fieldname)
    });
  })
  .on('field', (fieldname, val) => {
    context.log('Field [%s]: value: %j', fieldname, val)
    if (fieldname == 'file') {
      function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/\.]+);base64,(.+)$/),
        response = {};

        if (!matches || matches.length !== 3) {
          return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
      }

      context.log('decoding buffer', val)
      const buffer = decodeBase64Image(val)
      context.log('buffer type', buffer.type)
      context.bindings.uploadBlob = buffer.data
    }
  })
  .on('finish', (data) => {
    context.log('Done parsing form!');
    context.done()
  })
  .on('error', err => {
    context.log('failed', err);
    context.res = {
      status: 400,
      body: err
    };
    context.done();
  });

  bb.end(event.body);
}

module.exports = handler;
