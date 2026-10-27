import mongoose from 'mongoose';

// Languages the portfolio is published in; stored so replies can use the sender's language.
export const SUPPORTED_LOCALES = Object.freeze(['en', 'tr', 'es', 'de']);

export const MESSAGE_LIMITS = Object.freeze({
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { max: 150 },
  message: { min: 10, max: 5000 },
});

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: MESSAGE_LIMITS.name.min,
      maxlength: MESSAGE_LIMITS.name.max,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: MESSAGE_LIMITS.email.max,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: MESSAGE_LIMITS.subject.max,
      default: '',
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: MESSAGE_LIMITS.message.min,
      maxlength: MESSAGE_LIMITS.message.max,
    },
    locale: {
      type: String,
      enum: SUPPORTED_LOCALES,
      default: 'en',
    },
  },
  { timestamps: true, versionKey: false },
);

messageSchema.index({ createdAt: -1 });

export default mongoose.model('Message', messageSchema);
