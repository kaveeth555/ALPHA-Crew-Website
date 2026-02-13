import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: Request) {
    await dbConnect();

    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token) as any;
    if (!payload?.id) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    try {
        const { username, name } = await req.json();

        if (!username || username.length < 3) {
            return NextResponse.json({ success: false, error: 'Username must be at least 3 characters' }, { status: 400 });
        }

        // Check if username is taken by ANOTHER user
        const existing = await User.findOne({ username, _id: { $ne: payload.id } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Username already taken' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            payload.id,
            { username, name },
            { new: true }
        ).select('-passwordHash');

        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }
}
