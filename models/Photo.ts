import mongoose from 'mongoose';

export interface IPhoto extends mongoose.Document {
    src: string;
    title: string;
    photographer: string;
    order: number;
    createdAt: Date;
}

/* PhotoSchema will correspond to a collection in your MongoDB database. */
const PhotoSchema = new mongoose.Schema<IPhoto>({
    src: {
        type: String,
        required: [true, 'Please provide an image source URL.'],
    },
    title: {
        type: String,
        required: [true, 'Please provide a title for the photo.'],
        maxlength: [60, 'Title cannot be more than 60 characters'],
    },
    photographer: {
        type: String,
        required: [true, 'Please specify the photographer.'],
    },
    order: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

export default mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
