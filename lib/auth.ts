import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = "secret-key-change-me";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (err) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function createSession(userData: any) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    const session = await encrypt({ user: userData, expires });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
        expires,
        httpOnly: true,
        path: '/',
        sameSite: 'lax' // Adjust as needed
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.set('session', '', { expires: new Date(0), path: '/' });
}
