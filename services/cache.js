const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have a value for 'key' in redis
    const cacheValue = await client.get(key);

    // if we do, return that
    if (cacheValue) {
        console.log(cacheValue);

        return JSON.parse(cacheValue);
    }

    // Otherwise, issue the query and store the result in redis
    const result = await exec.apply(this, arguments)

    console.log(result);  // type is mongoose document, ModelInstance, not a js object
    console.log(result.validate);
    // [Function: wrappedPointCut] {
    //     '$originalFunction': '$__original_validate',
    //            '$isWrapped': true
    // }

    // Set result as a string in redis
    client.set(key, JSON.stringify(result));

    return result;
};