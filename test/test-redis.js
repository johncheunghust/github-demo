async function test() {
    const Redis = require("ioredis")

    const redis = new Redis();

    // await redis.setex('c', 10, 123);
    const keys = await redis.keys('*')
    console.log(keys);
}
test()