const amqp = require("amqplib")

async function sendMessage(message) {
    try {
        const connection = await amqp.connect("amqp://host.docker.internal");
        const channel = await connection.createChannel();
        const queue = "task";

        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(JSON.stringify(message));
    } catch (error) {
        console.error("❌ Failed to connect to RabbitMQ:", error);
    }
}
module.exports = { sendMessage };