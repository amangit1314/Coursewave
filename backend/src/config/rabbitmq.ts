import * as amqp from "amqplib";

let channel: any = null;

export async function connectRabbitMQ() {
  const conn = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost");
  channel = await conn.createChannel();
  await channel.assertQueue("notificationQueue", { durable: true });
  console.log("RabbitMQ connected and notificationQueue asserted.");
}

export async function publishNotification(eventData: any) {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized. Call connectRabbitMQ first.");
  }
  channel.sendToQueue("notificationQueue", Buffer.from(JSON.stringify(eventData)), { persistent: true });
}
