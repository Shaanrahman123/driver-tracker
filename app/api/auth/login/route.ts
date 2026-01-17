import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { email, password, phone } = await request.json();

        let user: any;

        if (phone) {
            // Member login via phone
            const stmt = db.prepare('SELECT * FROM users WHERE phone = ?');
            user = stmt.get(phone);

            if (!user) {
                return NextResponse.json({ error: 'No member found with this phone number' }, { status: 404 });
            }
            // In a real app, we'd send OTP here. 
            // But per request "direct if created by admin", we log in.
        } else if (email && password) {
            // Admin login via email/password
            const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
            user = stmt.get(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }
        } else {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        await createSession({ id: user.id, email: user.email, name: user.name, role: user.role });

        return NextResponse.json({ success: true, role: user.role });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
