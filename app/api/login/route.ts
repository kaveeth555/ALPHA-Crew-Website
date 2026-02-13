import { NextResponse } from 'next/server';
import { signToken, verifyPassword } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, password } = await req.json(); // Expect username now

        console.log(`[Login Attempt] Username: ${username}, Password Length: ${password?.length}`);

        const user = await User.findOne({ username });

        if (!user) {
            console.log('[Login Failed] User not found');
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        console.log(`[Login] User found: ${user.username}, Role: ${user.role}, Hash: ${user.passwordHash.substring(0, 10)}...`);

        const isValid = await verifyPassword(password, user.passwordHash);

        console.log(`[Login] Password valid: ${isValid}`);

        if (!isValid) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // 2. Sign Token with Role
        const token = await signToken({
            username: user.username,
            name: user.name,
            role: user.role,
            permissions: Array.from(user.permissions || []),
            id: user._id.toString()
        });

        const response = NextResponse.json({ success: true, role: user.role });

        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Login failed' }, { status: 500 });
    }
}
