import { NextResponse } from 'next/server';
import { proxy } from "../_proxy";

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const res = await proxy(
      request,
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
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
    
    // Lê o corpo da resposta apenas UMA VEZ
    const data = await res.json();
    
    if (!res.ok) {  
      // Usa a variável 'data' que já foi extraída acima
      return NextResponse.json(
        { success: false, message: data.message || "Erro ao realizar logout" },
        { status: res.status }
      );
    }
    
    const response = NextResponse.json({ 
      success: true, 
      message: data.message || "Logout realizado com sucesso" 
    });

    // Limpa os cookies
    response.cookies.set('token', '', {
      httpOnly: false,
      expires: new Date(0),
      path: '/',
    });
    
    response.cookies.set('userData', '', {
      httpOnly: false,
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (err) {
    console.error("Erro no logout:", err);
    return NextResponse.json(
      { success: false, message: "Erro ao conectar ao servidor" },
      { status: 500 }
    );
  }
}