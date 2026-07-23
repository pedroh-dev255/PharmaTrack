// app/api/medicamentos/route.js
import { NextResponse } from "next/server";
import { proxy } from "../_proxy";

// GET - Listar medicamentos com filtros e paginação
export async function GET(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get("token")?.value;
        
        // Construir URL com parâmetros
        const { searchParams } = new URL(request.url);
        const params = new URLSearchParams();
        
        // Adicionar todos os parâmetros recebidos
        searchParams.forEach((value, key) => {
            params.append(key, value);
        });

        const queryString = params.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/med/medicamentos${queryString ? `?${queryString}` : ''}`;

        const res = await proxy(
            request,
            url,
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
        
        // Verificar se a resposta foi bem sucedida
        if (data.success === false) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Erro ao buscar medicamentos"
                },
                { status: res.status || 400 }
            );
        }

        // Formatar dados para o frontend
        const medicamentos = data.medicamentos || data.data || [];
        const total = data.total || medicamentos.length;
        const totalPages = data.totalPages || Math.ceil(total / 10);
        const hasMore = data.hasMore || false;

        return NextResponse.json({
            success: true,
            medicamentos,
            total,
            totalPages,
            hasMore,
            currentPage: data.currentPage || 1,
            limit: data.limit || 10
        });

    } catch (error) {
        console.error('Erro ao listar medicamentos:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Erro interno ao listar medicamentos."
            },
            {
                status: 500
            }
        );
    }
}

// POST - Criar novo medicamento
export async function POST(request) {
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0] ||
        request.headers.get("x-real-ip") || "unknown";

    try {
        const token = request.cookies.get("token")?.value;
        const body = await request.json();

        const res = await proxy(
            request,
            `${process.env.NEXT_PUBLIC_API_URL}/med/medicamentos`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'appToken': process.env.APP_TOKEN,
                    "x-client-ip": ip
                },
                body: JSON.stringify(body),
                cache: "no-store",
            }
        );

        const data = await res.json();

        if (data.success === false) {
            return NextResponse.json(
                {
                    success: false,
                    message: data.message || "Erro ao criar medicamento"
                },
                { status: res.status || 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: data.message || "Medicamento criado com sucesso",
            id: data.id || data.data?.id
        });

    } catch (error) {
        console.error('Erro ao criar medicamento:', error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Erro interno ao criar medicamento."
            },
            {
                status: 500
            }
        );
    }
}
