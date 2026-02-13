import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this team member.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    role: {
        type: String,
        required: [true, 'Please provide a role for this team member.'],
        maxlength: [60, 'Role cannot be more than 60 characters'],
    },
    image: {
        type: String,
        required: [true, 'Please provide an image URL for this team member.'],
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

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
