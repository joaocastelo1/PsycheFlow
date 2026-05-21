import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const transacoes = Array.from(db.transacoes.values()).sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return NextResponse.json(transacoes);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const novaTransacao = {
      id: uuidv4(),
      ...data,
    };

    db.transacoes.set(novaTransacao.id, novaTransacao);
    return NextResponse.json(novaTransacao, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar transação' }, { status: 500 });
  }
}
