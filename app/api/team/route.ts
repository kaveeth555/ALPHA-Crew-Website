import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { verifyToken } from '@/lib/auth';

// Helper to check permissions (admin or superadmin can manage team)
async function checkPermission(req: Request) {
    const token = req.headers.get('cookie')?.split('admin_token=')[1]?.split(';')[0];
    if (!token) return false;
    const payload = await verifyToken(token) as any;
    // Allow both admin and superadmin to manage team, or restrict if needed.
    // For now, assuming any authenticated admin can manage team.
    return !!payload;
}

export async function GET(req: Request) {
    await dbConnect();

    try {
        // Sort by 'order' ascending, then 'createdAt' descending
        const team = await TeamMember.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: team });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch team members' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const newMember = await TeamMember.create(body);
        return NextResponse.json({ success: true, data: newMember });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
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

        await TeamMember.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete team member' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    await dbConnect();
    if (!await checkPermission(req)) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { _id, ...updateData } = body;

        if (!_id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

        const updatedMember = await TeamMember.findByIdAndUpdate(_id, updateData, { new: true });
        return NextResponse.json({ success: true, data: updatedMember });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update team member' }, { status: 500 });
    }
}
