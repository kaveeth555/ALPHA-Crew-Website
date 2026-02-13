import dbConnect from '@/lib/db';
import Photo, { IPhoto } from '@/models/Photo';
import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await req.json();
        const photo = await Photo.findByIdAndUpdate<IPhoto>(id, body, {
            new: true,
            runValidators: true,
        });

        if (!photo) {
            return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: photo });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const { id } = await params;

    try {
        const deletedPhoto = await Photo.deleteOne({ _id: id });

        if (!deletedPhoto) {
            return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
