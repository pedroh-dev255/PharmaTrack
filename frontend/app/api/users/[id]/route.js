import { NextResponse } from "next/server";
import { proxy } from "../../_proxy";

function getHeaders(token) {
    return {
        "Content-Type": "application/json",
        appToken: process.env.APP_TOKEN,
        Authorization: `Bearer ${token}`,
    };
}

// PUT /api/users/:id
export async function PUT(request, { params }) {
    try {
        const token = request.cookies.get("token")?.value;
        const body = await request.json();

        const res = await proxy(
            request,
            `${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`,
            {
                method: "PUT",
                headers: getHeaders(token),
                body: JSON.stringify(body),
            }
        );

        const data = await res.json();

        return NextResponse.json(data, {
            status: res.status,
        });

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
