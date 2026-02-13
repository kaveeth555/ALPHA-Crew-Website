import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();

    try {
        const photos = await Photo.find({}).sort({ order: 1, createdAt: -1 }).lean(); // Sort by Order then Newest

        // Transform _id to string to ensure serializability
        const serializedPhotos = photos.map(photo => ({
            ...photo,
            _id: (photo._id as any).toString(),
        }));

        return NextResponse.json({ success: true, data: serializedPhotos });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();

    try {
        const body = await req.json();
        const photo = await Photo.create(body);

        // Convert to object and stringify _id for consistency
        const photoObj = photo.toObject();
        photoObj._id = photoObj._id.toString();

        return NextResponse.json({ success: true, data: photoObj }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
