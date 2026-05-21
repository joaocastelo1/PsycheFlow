import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const pacientes = Array.from(db.pacientes.values()).sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  return NextResponse.json(pacientes);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const novoPaciente = {
      id: uuidv4(),
      ...data,
      createdAt: new Date(),
    };

    db.pacientes.set(novoPaciente.id, novoPaciente);
    return NextResponse.json(novoPaciente, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar paciente' }, { status: 500 });
  }
}