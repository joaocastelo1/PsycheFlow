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
  const paciente = db.pacientes.get(id);

  if (!paciente) {
    return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
  }

  return NextResponse.json(paciente);
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
  const paciente = db.pacientes.get(id);

  if (!paciente) {
    return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
  }

  try {
    const data = await request.json();
    const pacienteAtualizado = { ...paciente, ...data };
    db.pacientes.set(id, pacienteAtualizado);
    return NextResponse.json(pacienteAtualizado);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar paciente' }, { status: 500 });
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
  if (!db.pacientes.has(id)) {
    return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 });
  }

  db.pacientes.delete(id);
  return NextResponse.json({ success: true });
}