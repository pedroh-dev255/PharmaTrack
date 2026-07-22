import { NextResponse } from 'next/server';
import { proxy } from "../../_proxy";

export async function POST(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 });
        }

        const body = await request.json();

        const res = await proxy(request, `${process.env.NEXT_PUBLIC_API_URL}/notifications/send-to-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'appToken': process.env.APP_TOKEN,
                "x-client-ip": ip
            },
            body: JSON.stringify(body),
            cache: 'no-store',
        });

        const data = await res.json();

        if (res.status === 403) {
            return NextResponse.json(
                { success: false, message: "Acesso negado: Apenas administradores podem enviar notificações" },
                { status: 403 }
            );
        }

        if (!data.success) {
            return NextResponse.json(
                { success: false, message: data.message || "Erro ao enviar notificação" },
                { status: res.status || 400 }
            );
        }

        return NextResponse.json({ success: true, message: data.message });
    } catch (err) {
        console.error('API send-to-user error', err);
        return NextResponse.json({ success: false, message: err.message || "Erro interno do servidor" }, { status: 500 });
    }
}
