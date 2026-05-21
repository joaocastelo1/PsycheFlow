import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db, seedData } from '@/lib/db';
import { createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await seedData();
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    let userFound = null;
    for (const user of Array.from(db.users.values())) {
      if (user.email === email) {
        userFound = user;
        break;
      }
    }

    if (!userFound) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const senhaValida = await bcrypt.compare(senha, userFound.senha);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = await createToken(userFound.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: userFound.id,
        nome: userFound.nome,
        sobrenome: userFound.sobrenome,
        email: userFound.email,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}