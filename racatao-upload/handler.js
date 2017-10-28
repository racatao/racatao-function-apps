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
      if (fieldname == 'file') {
        let binary = data.toString('binary')
        context.log('Found file form, calling context done (file)', binary);
        context.bindings.uploadBlob = binary
        context.log('uploadBlob content', JSON.stringify(context.bindings.uploadBlob))
        context.done(null, binary);
      }
    })
    .on('end', () => {
      context.log('File [%s] Finished', fieldname)
    });
  })
  .on('field', (fieldname, val) => {
    context.log('Field [%s]: value: %j', fieldname, val)
      if (fieldname == 'file') {
        context.log('Found file form, calling context done (field)')
        context.bindings.uploadBlob = val
        context.done(null, val);
      }
  })
  .on('finish', (data) => {
    context.log('Done parsing form!');
  })
  .on('error', err => {
    context.log('failed', err);
    context.res = {
      status: 400,
      body: err
    };
    context.done(err, null);
  });

  bb.end(event.body);
}

module.exports = handler;
