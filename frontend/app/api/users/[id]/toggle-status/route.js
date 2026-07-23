import { NextResponse } from "next/server";
import { proxy } from "../../../_proxy";

function getHeaders(token) {
    return {
        "Content-Type": "application/json",
        appToken: process.env.APP_TOKEN,
        Authorization: `Bearer ${token}`,
    };
}

// PATCH /api/users/:id/toggle-status
export async function PATCH(request, { params }) {
    try {
        const token = request.cookies.get("token")?.value;
         const { id } = await params;
        const res = await proxy(
            request,
            `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/toggle-status`,
            {
                method: "put",
                headers: getHeaders(token),
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