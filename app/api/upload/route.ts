import { NextResponse } from 'next/server';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        // Create unique filename
        const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Write file to public/uploads
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the relative URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ success: false, error: 'Upload failed.' }, { status: 500 });
    }
}
