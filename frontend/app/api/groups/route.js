import { NextResponse } from 'next/server';
import { proxy } from "../_proxy";

export async function GET(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false }, { status: 401 });
        }

        const res = await proxy(request, `${process.env.NEXT_PUBLIC_API_URL}/groups`, {
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

        if (data.success !== true) {
            return NextResponse.json(
                { success: false, message: data.message || "Erro ao buscar grupos" },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true, groups: data.groups || [] });
    } catch (err) {
        console.error('API groups error', err);
        return NextResponse.json({ success: false, message: err.message || "Erro interno do servidor" }, { status: 500 });
    }
}
