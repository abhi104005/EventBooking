const amqp = require("amqplib")

async function sendMessage(message) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queue = "task";

    await channel.assertQueue(queue,{durable:true});
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(JSON.stringify(message));
}
module.exports = {sendMessage};