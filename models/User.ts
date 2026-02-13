import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    name?: string;
    passwordHash: string;
    role: 'superadmin' | 'admin';
    permissions: string[];
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    // Added name field
    name: {
        type: String,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin',
    },
    permissions: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
