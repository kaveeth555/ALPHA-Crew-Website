import dbConnect from '@/lib/db';
import Photo from '@/models/Photo';
import { NextResponse } from 'next/server';

const ORIGINAL_PHOTOS = [
    { src: "/photo-1.jpg", title: "Photo 1", photographer: "Alpha Crew", order: 1 },
    { src: "/photo-2.jpeg", title: "Photo 2", photographer: "Alpha Crew", order: 2 },
    { src: "/photo-3.jpg", title: "Photo 3", photographer: "Alpha Crew", order: 3 },
    { src: "/photo-4.jpeg", title: "Photo 4", photographer: "Alpha Crew", order: 4 },
    { src: "/photo-5.jpg", title: "Photo 5", photographer: "Alpha Crew", order: 5 },
    { src: "/photo-6.jpeg", title: "Photo 6", photographer: "Alpha Crew", order: 6 },
    { src: "/photo-7.jpg", title: "Photo 7", photographer: "Alpha Crew", order: 7 },
    { src: "/photo-8.jpg", title: "Photo 8", photographer: "Alpha Crew", order: 8 },
    { src: "/photo-9.jpg", title: "Photo 9", photographer: "Alpha Crew", order: 9 },
    { src: "/photo-10.jpg", title: "Photo 10", photographer: "Alpha Crew", order: 10 },
    { src: "/photo-11.jpg", title: "Photo 11", photographer: "Alpha Crew", order: 11 },
    { src: "/photo-12.jpg", title: "Photo 12", photographer: "Alpha Crew", order: 12 },
];

export async function POST() {
    await dbConnect();
    try {
        // Optional: Clear existing if you want a hard reset, or just append
        // await Photo.deleteMany({}); 

        await Photo.insertMany(ORIGINAL_PHOTOS);
        return NextResponse.json({ success: true, message: "Photos seeded successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
