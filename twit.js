const Twit = require("twit");

const T =  new Twit({
  consumer_key: "ybFUSrzAXGkKdIyHV1NeXYLZb",
  consumer_secret: "xJabGs8lQYPdTphq3G7ZOXUlNVIj3ow8CQuji8JLKTnBJTZ1nQ",
  access_token: "1061773966510096384-7k4izjTZuxeD3ZNn9QYxCKm6O064H2",
  access_token_secret: "Vv7jUoiDjy7ZwpdD0dhkA9SHQrE9MAQ11uT7KuZ8QhELK"
});

T.get('search/tweets', { q: 'banana since:2011-07-11', count: 100 }, function(err, data, response) {
  console.log(data);
});