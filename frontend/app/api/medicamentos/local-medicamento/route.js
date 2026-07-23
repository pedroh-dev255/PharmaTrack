import { NextResponse } from "next/server";
import { proxy } from "../../_proxy";

// GET /api/medicamentos/local-medicamento
export async function GET(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get("token")?.value;

        const res = await proxy(
            request,
            `${process.env.NEXT_PUBLIC_API_URL}/med/locais`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'appToken': process.env.APP_TOKEN,
                    "x-client-ip": ip
                },
                cache: "no-store",
            }
        );

        const data = await res.json();
        //console.log(data)
        return NextResponse.json(data);

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Erro interno."
            },
            {
                status: 500
            }
        );
    }
}