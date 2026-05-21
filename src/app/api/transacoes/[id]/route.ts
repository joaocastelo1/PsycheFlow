import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const transacao = db.transacoes.get(id);

  if (!transacao) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
  }

  return NextResponse.json(transacao);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params;
  const transacao = db.transacoes.get(id);

  if (!transacao) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
  }

  try {
    const data = await request.json();
    const transacaoAtualizada = { ...transacao, ...data };
    db.transacoes.set(id, transacaoAtualizada);
    return NextResponse.json(transacaoAtualizada);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar transação' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { id } = await params;
  if (!db.transacoes.has(id)) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 });
  }

  db.transacoes.delete(id);
  return NextResponse.json({ success: true });
}
