import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
    key: string;
    value: any;
    updatedAt: Date;
}

const ContentSchema = new Schema<IContent>({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: Schema.Types.Mixed, // Allows storing text, JSON objects, etc.
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);
