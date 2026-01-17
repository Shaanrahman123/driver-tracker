import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const stmt = db.prepare('SELECT * FROM attendance WHERE user_id = ? ORDER BY timestamp DESC');
    const logs = stmt.all(session.user.id);

    return NextResponse.json(logs);
}
