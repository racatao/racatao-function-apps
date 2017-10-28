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
    .on('data', data => console.log('File [%s] got %d bytes', fieldname, data.length))
    .on('end', () => console.log('File [%s] Finished', fieldname));
  })
  .on('field', (fieldname, val) =>console.log('Field [%s]: value: %j', fieldname, val))
  .on('finish', () => {
    context.log('Done parsing form!');
  })
  .on('error', err => {
    context.log('failed', err);
  });

  bb.end(event.body);
}

module.exports = handler;
