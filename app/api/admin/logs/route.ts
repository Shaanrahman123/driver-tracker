import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Join with users table
    const stmt = db.prepare(`
    SELECT attendance.*, users.name as user_name, users.email as user_email 
    FROM attendance 
    JOIN users ON attendance.user_id = users.id 
    ORDER BY timestamp DESC
  `);
    const logs = stmt.all();

    return NextResponse.json(logs);
}
