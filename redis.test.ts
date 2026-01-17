import { describe, it, beforeAll, afterAll } from "@jest/globals";
import { createClient, RedisClientType } from "redis";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("Redis", () => {
    let container: StartedTestContainer;
    let redisClient: RedisClientType;

    beforeAll(async () => {
        container = await new GenericContainer("redis:8")
            .withExposedPorts(6379)
            .start();
        const redisUrl = `redis://${container.getHost()}:${container.getMappedPort(6379)}`;
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
