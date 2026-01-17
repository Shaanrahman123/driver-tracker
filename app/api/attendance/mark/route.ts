import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { latitude, longitude, address, image, type } = await request.json();

        // Save image
        let imageUrl = '';
        if (image) {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const filename = `${Date.now()}_${session.user.id}.jpg`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, filename);

            await fs.promises.writeFile(filePath, base64Data, 'base64');
            imageUrl = `/uploads/${filename}`;
        }

        const date = new Date().toISOString().split('T')[0];
        const timestamp = Date.now();

        const stmt = db.prepare('INSERT INTO attendance (user_id, date, timestamp, latitude, longitude, address, image, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(session.user.id, date, timestamp, latitude, longitude, address, imageUrl, type || 'clock_in');

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
