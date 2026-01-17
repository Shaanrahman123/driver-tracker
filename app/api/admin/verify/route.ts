import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, verified } = await request.json(); // id is attendance id

    const stmt = db.prepare('UPDATE attendance SET verified = ? WHERE id = ?');
    stmt.run(verified ? 1 : 0, id);

    return NextResponse.json({ success: true });
}
