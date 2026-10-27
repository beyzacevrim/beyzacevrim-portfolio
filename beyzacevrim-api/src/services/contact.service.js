import Message from '../models/Message.js';

export async function createMessage({ name, email, subject, message, locale }) {
  const doc = await Message.create({ name, email, subject, message, locale });
  return { id: doc.id, createdAt: doc.createdAt };
}
