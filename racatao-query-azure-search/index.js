const rp = require('request-promise')
// query-key 5112AF0AAE64FF3EE9428CB0794C8034

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.params && req.params.search) {
      const search = req.body.search
      rp({
        method: 'GET',
        url: 'https://racatao-documents.search.windows.net/indexes/raw-files-index/docs',
        qs: {
          search,
          'api-key': '5112AF0AAE64FF3EE9428CB0794C8034',
          'api-version': '2016-09-01'
        }
      })
      .then((response) => {
        context.res = {
          status: 200,
          body: {
            data: response.value.map((el) => el.metadata_storage_name),
            count: response.value.length
          },
          headers: {
            content_type: 'application/json'
          }
        }
        context.log(response.value.length, response.value)
        context.done();
      })
      .catch((err) => {
        context.res = {
          status: 400,
          body: "Error querying AzureSearch API"
        }
        context.log('err', err)
        context.done();
      })
    }
};
