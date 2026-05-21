import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pacienteId = searchParams.get('pacienteId');

  let sessoes = Array.from(db.sessoes.values()).sort(
    (a, b) => new Date(b.data + ' ' + b.hora).getTime() - new Date(a.data + ' ' + a.hora).getTime()
  );

  if (pacienteId) {
    sessoes = sessoes.filter(s => s.pacienteId === pacienteId);
  }

  return NextResponse.json(sessoes);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const novaSessao = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
    };

    db.sessoes.set(novaSessao.id, novaSessao);
    return NextResponse.json(novaSessao, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 });
  }
}