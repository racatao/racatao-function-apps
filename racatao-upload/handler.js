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
      context.bindings.uploadBlob = data;
    })
    .on('end', () => {
      context.log('File [%s] Finished', fieldname)
    });
  })
  .on('field', (fieldname, val) => {
    context.log('Field [%s]: value: %j', fieldname, val)
  })
  .on('finish', (data) => {
    context.log('Done parsing form!');
    context.done();
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
