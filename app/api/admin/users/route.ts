import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        const users = db.prepare('SELECT id, name, email, phone, gender, role FROM users WHERE role = ?').all('driver');
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, email, phone, gender, password } = await req.json();

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password || phone, 10); // Default password as phone if not provided

        const result = db.prepare(
            'INSERT INTO users (name, email, phone, gender, password, role) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(name, email || null, phone, gender || null, hashedPassword, 'driver');

        return NextResponse.json({ id: result.lastInsertRowid, name, email, phone, gender });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'User with this email or phone already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id, name, email, phone, gender } = await req.json();

        if (!id || !name || !phone) {
            return NextResponse.json({ error: 'ID, Name and phone are required' }, { status: 400 });
        }

        db.prepare(
            'UPDATE users SET name = ?, email = ?, phone = ?, gender = ? WHERE id = ?'
        ).run(name, email || null, phone, gender || null, id);

        return NextResponse.json({ id, name, email, phone, gender });
    } catch (error: any) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return NextResponse.json({ error: 'User with this email or phone already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}
