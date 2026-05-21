import { Paciente, Sessao, Transacao, User } from '@/types';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const users: Map<string, User & { senha: string }> = new Map();
const pacientes: Map<string, Paciente> = new Map();
const sessoes: Map<string, Sessao> = new Map();
const transacoes: Map<string, Transacao> = new Map();

export async function seedData() {
  if (users.size === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User & { senha: string } = {
      id: uuidv4(),
      email: 'admin@psiclinica.com.br',
      nome: 'Administrador',
      sobrenome: 'Sistema',
      cro: '12345-SP',
      telefone: '(11) 99999-9999',
      createdAt: new Date(),
      senha: hashedPassword,
    };
    users.set(adminUser.id, adminUser);

    const pacientesExemplo: (Paciente & { id: string })[] = [
      {
        id: uuidv4(),
        nome: 'Maria',
        sobrenome: 'Silva Santos',
        dataNascimento: '1990-05-15',
        cpf: '123.456.789-00',
        telefone: '(11) 98765-4321',
        email: 'maria.silva@email.com',
        endereco: 'Rua das Flores, 123 - São Paulo, SP',
        profissao: 'Advogada',
        estadoCivil: 'Casada',
        motivoConsulta: 'Ansiedade e dificuldades no trabalho',
        historico: 'Paciente em acompanhamento há 6 meses. Apresenta quadro de ansiedade generalizada com crises ocasionais.',
        observacoes: 'Responde bem aosetting psicanalítico clássico.',
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        nome: 'João',
        sobrenome: 'Oliveira Costa',
        dataNascimento: '1985-08-22',
        cpf: '987.654.321-00',
        telefone: '(21) 97654-3210',
        email: 'joao.costa@email.com',
        endereco: 'Av. Atlântica, 456 - Rio de Janeiro, RJ',
        profissao: 'Professor',
        estadoCivil: 'Solteiro',
        motivoConsulta: 'Depressão e insônia',
        historico: 'Paciente apresenta quadro depressivo há 2 anos, com dificuldade de sono.',
        observacoes: 'Faz uso de medicação psiquiátrica complementar.',
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        nome: 'Ana',
        sobrenome: 'Ferreira Lima',
        dataNascimento: '1995-12-03',
        cpf: '456.789.123-00',
        telefone: '(31) 99876-5432',
        email: 'ana.lima@email.com',
        endereco: 'Rua das Acácias, 789 - Belo Horizonte, MG',
        profissao: 'Médica',
        estadoCivil: 'Casada',
        motivoConsulta: 'Conflitos conjugais e baixa autoestima',
        historico: 'Encaminhada pelo psiquiatra. Relata dificuldades nos relacionamentos.',
        observacoes: 'Excelente capacidade de insight.',
        createdAt: new Date(),
      },
    ];

    pacientesExemplo.forEach((p) => pacientes.set(p.id, p));

    if (pacientesExemplo.length > 0) {
      const sessoesExemplo: Sessao[] = [
        {
          id: uuidv4(),
          pacienteId: pacientesExemplo[0].id,
          data: '2026-05-15',
          hora: '09:00',
          duracao: 50,
          conteudo: 'Paciente chegou agitada. Relatou dificuldades no trabalho com um colega específico. Exploréi a transferência em relação à figura de autoridade.',
          notasAnalista: 'Paciente apresenta resistência em falar sobre a mãe. Atransferência está claramente direcionada a mim.',
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          pacienteId: pacientesExemplo[0].id,
          data: '2026-05-17',
          hora: '09:00',
          duracao: 50,
          conteudo: 'Continuidade da análise do conflito no trabalho. Paciente trouxe um sonho onde estava perdida em uma floresta escura.',
          notasAnalista: 'O sonho indica ansiedade reprimida. explorar a simbolização da floresta.',
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          pacienteId: pacientesExemplo[1].id,
          data: '2026-05-16',
          hora: '10:00',
          duracao: 50,
          conteudo: 'Sessão focada na insônia. Paciente menciona pensamentos ruminativos ao deitar. Perguntei sobre a rotina.',
          notasAnalista: 'Pensamentos catastrophicos típicos de quadro depressivo.',
          createdAt: new Date(),
        },
      ];

      sessoesExemplo.forEach((s) => sessoes.set(s.id!, s));
    }

    const transacoesExemplo: Transacao[] = [
      {
        id: uuidv4(),
        tipo: 'receita',
        categoria: 'Consulta',
        descricao: 'Sessão - Maria Silva',
        valor: 250,
        data: '2026-05-15',
        pacienteId: pacientesExemplo[0].id,
        status: 'pago',
      },
      {
        id: uuidv4(),
        tipo: 'receita',
        categoria: 'Consulta',
        descricao: 'Sessão - João Costa',
        valor: 250,
        data: '2026-05-16',
        pacienteId: pacientesExemplo[1].id,
        status: 'pago',
      },
      {
        id: uuidv4(),
        tipo: 'despesa',
        categoria: 'Aluguel',
        descricao: 'Aluguel do consultório - Maio',
        valor: 3500,
        data: '2026-05-01',
        status: 'pago',
      },
      {
        id: uuidv4(),
        tipo: 'receita',
        categoria: 'Consulta',
        descricao: 'Sessão - Maria Silva',
        valor: 250,
        data: '2026-05-17',
        pacienteId: pacientesExemplo[0].id,
        status: 'pendente',
      },
    ];

    transacoesExemplo.forEach((t) => transacoes.set(t.id!, t));
  }
}

export const db = {
  users,
  pacientes,
  sessoes,
  transacoes,
};