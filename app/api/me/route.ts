import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];

    if (!token) {
        return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const payload = await verifyToken(token) as any;
        if (!payload) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ username: payload.username });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                username: user.username,
                name: user.name,
                role: user.role,
                permissions: user.permissions || []
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
