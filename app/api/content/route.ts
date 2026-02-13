import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Content from '@/models/Content';
import { verifyToken } from '@/lib/auth';

async function checkPermission(req: Request) {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return false;
    const payload = await verifyToken(token);
    return !!payload; // Any admin can edit content (or restrict to superadmin if needed)
}

export async function GET(req: Request) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const key = url.searchParams.get('key');

        if (key) {
            const content = await Content.findOne({ key });
            return NextResponse.json({ success: true, data: content?.value });
        }

        const allContent = await Content.find({});
        const contentMap = allContent.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, any>);

        return NextResponse.json({ success: true, data: contentMap });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        // Expect body to be { key: 'foo', value: 'bar' } OR { settings: { key: val, ... } }

        if (body.key && body.value !== undefined) {
            await Content.findOneAndUpdate(
                { key: body.key },
                { value: body.value, updatedAt: new Date() },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
    }
}
