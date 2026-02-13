import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyToken, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
    await dbConnect();

    // 1. Verify Authentication
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token) as any;
    if (!payload?.id) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    try {
        const { currentPassword, newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        const user = await User.findById(payload.id);
        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        // 2. Verify Old Password
        const isValid = await verifyPassword(currentPassword, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 });
        }

        // 3. Update Password
        user.passwordHash = await hashPassword(newPassword);
        await user.save();

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update password' }, { status: 500 });
    }
}
