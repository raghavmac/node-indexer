// ElasticSearch Client
var elasticsearch = require('elasticsearch'),
  client = elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });

// Redis Client
var redis = require('redis'),
  redisClient = redis.createClient();

/**
 * sampleController.js
 *
 * @description :: Server-side logic for managing samples.
 */
module.exports = {

    /**
     * description  This takes in a sample message and indexes into ElasticSearch and Redis.
     * POST  /index
     * param  {String} message
     * sampleController.create()
     */
    create: function (req, res) {
      var redisKey = 'message';

      redisClient.lpush(redisKey, JSON.stringify(req.body.message), function(err, result) {
        if (err) return console.error('Error: ', err);

        var data = {
          message: req.body.message
        };
        client.index({ index: 'sample', type: 'message', body: data }, function(error, index) {
          if (error) {
            console.error('Error indexing: ', error);
            res.status(403).json({
                error: 'Error indexing the data.',
            });
          } else {
            return res.status(200).json({ success: 'Message indexed to Redis and ElasticSearch.'});
          }
        });
      });
    },

    /**
     * description  This gets the data from Redis.
     * GET  /index
     * sampleController.list()
     */
    list: function (req, res) {
      var redisKey = 'message';

      redisClient.lrange(redisKey, 0, -1, function(err, messages) {
        if (err) console.error('Error: ', err);

        if (messages.length > 0) {
          for (var i = 0; i < messages.length; i++) {
            messages[i] = JSON.parse(messages[i]);
          }

          return res.status(200).json(messages);
        } else {
          res.status(403).json({
              error: 'No messages found.',
          });
        }
      });
    },

    /**
     * description  This searches data from ElasticSearch.
     * GET  /search/:keyword
     * param  {String} keyword
     * sampleController.search()
     */
    search: function (req, res) {
      var keyword = req.params.keyword;

      client.search({
        index: 'sample',
        type: 'message',
        q: keyword
      }).then(function(response) {
        var hits = response.hits.hits;

        return res.status(200).json(hits);
      }, function(err) {
        console.error('Error in search: ', err);
      });
    }

};
