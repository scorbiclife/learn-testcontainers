import { describe, it, beforeAll, afterAll } from "@jest/globals";
import { createClient, type RedisClientType } from "redis";
import { RedisContainer, type StartedRedisContainer } from "@testcontainers/redis";

describe("Redis", () => {
    let container: StartedRedisContainer;
    let redisClient: RedisClientType;

    beforeAll(async () => {
        container = await new RedisContainer("redis:8")
            .withExposedPorts(6379)
            .start();
        const redisUrl = container.getConnectionUrl();
        redisClient = createClient({ url: redisUrl });
        await redisClient.connect();
    });

    afterAll(async () => {
        await redisClient.disconnect();
        await container.stop();
    });

    it("should work", async () => {
        await redisClient.set("key", "val");
        expect(await redisClient.get("key")).toBe("val");
    });
});
