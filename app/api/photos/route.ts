import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12'); // Default to 12
    const skip = (page - 1) * limit;

    try {
        const total = await Photo.countDocuments({});
        const photos = await Photo.find({})
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Transform _id to string to ensure serializability
        const serializedPhotos = photos.map(photo => ({
            ...photo,
            _id: (photo._id as any).toString(),
        }));

        return NextResponse.json({
            success: true,
            data: serializedPhotos,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                hasMore: skip + photos.length < total
            }
        });
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
