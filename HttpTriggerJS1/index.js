var MultiPraser = require('./parser.js');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.headers['content-type'] !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        context.res = {
            status: 400,
            body: "Only content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet accepted"
        }
        context.log.warn('Received wrong content trype ' + req.headers['content-type']);
        context.done();
        return;
    }

    context.log(req.body)
    if (req.body) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Success"
        };

        var multipartData = new MultipartParser(req.headers['content-type'], req.body);
		context.log(multipartData);
        context.bindings.uploadBlob = multipartData;
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass file in body"
        };
    }
    context.done();
};