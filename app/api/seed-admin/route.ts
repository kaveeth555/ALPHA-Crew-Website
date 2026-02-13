import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST() {
    await dbConnect();
    try {
        const passwordHash = await hashPassword('admin123'); // Generate hash once

        let user = await User.findOne({ username: 'admin' });

        if (user) {
            // Update existing
            user.passwordHash = passwordHash;
            user.role = 'superadmin';
            // Ensure permissions are full for superadmin
            user.permissions = ['manage_users', 'manage_content', 'manage_gallery'];
            user.name = 'Kaveeth Manodhya';
            await user.save();
            return NextResponse.json({
                success: true,
                message: 'Superadmin password reset to admin123.'
            });
        } else {
            // Create new
            user = await User.create({
                username: 'admin',
                name: 'Kaveeth Manodhya',
                passwordHash,
                role: 'superadmin',
                permissions: ['manage_users', 'manage_content', 'manage_gallery'],
            });
            return NextResponse.json({
                success: true,
                message: 'Superadmin created successfully.',
                user: { username: user.username, role: user.role }
            });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Seed failed' }, { status: 500 });
    }
}
