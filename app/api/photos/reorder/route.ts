import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import { verifyToken } from '@/lib/auth';

// Helper to check permissions (requires authentication)
async function checkAuth(req: Request) {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return false;
    const payload = await verifyToken(token);
    return !!payload;
}

export async function PUT(req: Request) {
    await dbConnect();

    if (!await checkAuth(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { orderedIds } = await req.json(); // Expect array of IDs in order

        if (!Array.isArray(orderedIds)) {
            return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
        }

        // Perform bulk updates
        const bulkOps = orderedIds.map((id: string, index: number) => ({
            updateOne: {
                filter: { _id: id },
                update: { order: index },
            },
        }));

        if (bulkOps.length > 0) {
            await Photo.bulkWrite(bulkOps);
        }

        return NextResponse.json({ success: true, message: 'Reordered successfully' });
    } catch (error) {
        console.error('Reorder error:', error);
        return NextResponse.json({ success: false, error: 'Failed to reorder' }, { status: 500 });
    }
}
