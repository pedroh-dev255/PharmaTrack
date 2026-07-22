import { NextResponse } from 'next/server';
import { proxy } from "../_proxy";

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    const res = await proxy(
        request,
      `${process.env.NEXT_PUBLIC_API_URL}/user/data`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'appToken': process.env.APP_TOKEN,
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      }
    );

    const data = await res.json();
    
    return NextResponse.json(
      { success: true, message: "Dados Carregados", data },
      { status: 200 }
    );
  }catch(error){
    console.error("Erro no logout:", err);
    return NextResponse.json(
      { success: false, message: "Erro ao conectar ao servidor" },
      { status: 500 }
    );
  }

}