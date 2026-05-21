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
  const sessao = db.sessoes.get(id);

  if (!sessao) {
    return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
  }

  return NextResponse.json(sessao);
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
  const sessao = db.sessoes.get(id);

  if (!sessao) {
    return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
  }

  try {
    const data = await request.json();
    const sessaoAtualizada = { ...sessao, ...data };
    db.sessoes.set(id, sessaoAtualizada);
    return NextResponse.json(sessaoAtualizada);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar sessão' }, { status: 500 });
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
  if (!db.sessoes.has(id)) {
    return NextResponse.json({ error: 'Sessão não encontrada' }, { status: 404 });
  }

  db.sessoes.delete(id);
  return NextResponse.json({ success: true });
}