import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword, verifyToken } from '@/lib/auth';

// Helper to check permissions
async function checkPermission(req: Request) {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return false;
    const payload = await verifyToken(token) as any;
    return payload?.role === 'superadmin';
}

export async function GET(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { username, name, password, role, permissions } = await req.json();

        const existing = await User.findOne({ username });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Username taken' }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);

        const newUser = await User.create({
            username,
            name,
            passwordHash,
            role,
            permissions,
        });

        return NextResponse.json({ success: true, data: { username: newUser.username, name: newUser.name, role: newUser.role } });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        await User.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { id, username, name, password, role, permissions } = await req.json();

        if (!id) return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });

        const updateData: any = { username, name, role, permissions };

        // Only hash and update password if provided and not empty
        if (password && password.trim() !== '') {
            updateData.passwordHash = await hashPassword(password);
        }

        // Check if username is being changed to one that already exists
        const existing = await User.findOne({ username, _id: { $ne: id } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Username taken' }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(id, updateData, { new: true });

        if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
    }
}
