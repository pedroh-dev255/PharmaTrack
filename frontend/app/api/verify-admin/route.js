import { NextResponse } from 'next/server';
import { proxy } from "../_proxy";

export async function GET(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, isAdmin: false }, { status: 401 });
        }

        const res = await proxy(request, `${process.env.NEXT_PUBLIC_API_URL}/verify-admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'appToken': process.env.APP_TOKEN,
                "x-client-ip": ip
            },
            cache: 'no-store',
        });

        const data = await res.json();

        // Se receber 403 (Acesso negado), significa que não é admin
        if (res.status === 403) {
            return NextResponse.json({ success: true, isAdmin: false });
        }

        // Se receber erro, trata como não admin
        if (!data.success) {
            return NextResponse.json({ success: true, isAdmin: false });
        }

        return NextResponse.json({ success: true, isAdmin: true });
    } catch (err) {
        console.error('API verify-admin error', err);
        return NextResponse.json({ success: true, isAdmin: false }, { status: 200 });
    }
}
