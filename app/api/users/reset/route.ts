import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    await dbConnect();

    // 1. Verify Super Admin Permission
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token) as any;
    if (payload?.role !== 'superadmin') {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
        }

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        // 2. Set Default Password
        // Default password for reset: "alpha123"
        const defaultPassword = 'alpha123';
        user.passwordHash = await hashPassword(defaultPassword);
        await user.save();

        return NextResponse.json({ success: true, message: 'Password reset to default (alpha123)' });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to reset password' }, { status: 500 });
    }
}
