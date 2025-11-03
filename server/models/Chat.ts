import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  text: string;
  isUser: boolean;
  createdAt: Date;
}

export interface IChat extends Document {
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}


const MessageSchema: Schema = new Schema<IMessage>({
  text: { type: String, required: true },
  isUser: { type: Boolean, required: true },
  createdAt: { type: Date, default: () => new Date() },
});


const ChatSchema: Schema = new Schema<IChat>(
  {
    title: { type: String, default: "New Chat" },
    messages: { type: [MessageSchema], default: [] },
  },
  { timestamps: true }
);


// Index for faster sorting by newest
ChatSchema.index({ updatedAt: -1 });

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);