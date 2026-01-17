import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { name, email, password, phone } = await request.json();

        // Simple validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)');
        const info = stmt.run(name, email, hashedPassword, phone || '');

        return NextResponse.json({ success: true, userId: info.lastInsertRowid });
    } catch (error: any) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
