var MultipartParser = require('./handler')
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(req.body)
    context.log(JSON.stringify(req.headers))
    if (req.body) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Success"
        };

        var multipartData = new MultipartParser(req, context);
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
        context.done();
    }
};
