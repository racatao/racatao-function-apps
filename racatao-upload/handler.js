const busboy = require('busboy');
const toBlob = require('stream-to-blob')

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

    toBlob(file, function (err, blob) {
      if (err) {
        console.log('error toBlob', err)
        context.res = {
          status: 400,
          body: err
        }
        return context.done()
      }

      context.log('Uploading blob', JSON.stringify(blob))
      context.bindings.uploadBlob = blob
      context.done(null, blob)
    })
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
    context.done();
  });

  bb.end(event.body);
}

module.exports = handler;
