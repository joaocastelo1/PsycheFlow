import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  nome: z.string().min(2),
  sobrenome: z.string().min(2),
  cro: z.string().min(3),
  telefone: z.string().optional(),
  createdAt: z.date(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const pacienteSchema = z.object({
  id: z.string().uuid().optional(),
  nome: z.string().min(2, 'Nome é obrigatório'),
  sobrenome: z.string().min(2, 'Sobrenome é obrigatório'),
  dataNascimento: z.string(),
  cpf: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  endereco: z.string().optional(),
  profissao: z.string().optional(),
  estadoCivil: z.string().optional(),
  motivoConsulta: z.string().optional(),
  historico: z.string().optional(),
  observacoes: z.string().optional(),
  createdAt: z.date().optional(),
});

export const sessaoSchema = z.object({
  id: z.string().uuid().optional(),
  pacienteId: z.string().uuid('Selecione um paciente'),
  data: z.string().min(1, 'Data é obrigatória'),
  hora: z.string().min(1, 'Hora é obrigatória'),
  duracao: z.number().min(30).max(120),
  conteudo: z.string().optional(),
  notasAnalista: z.string().optional(),
  createdAt: z.date().optional(),
});

export const transacaoSchema = z.object({
  id: z.string().uuid().optional(),
  tipo: z.enum(['receita', 'despesa']),
  categoria: z.string(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  valor: z.number().positive('Valor deve ser positivo'),
  data: z.string().min(1, 'Data é obrigatória'),
  pacienteId: z.string().uuid().optional(),
  status: z.enum(['pago', 'pendente', 'cancelado']).default('pago'),
});

export type User = z.infer<typeof userSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Paciente = z.infer<typeof pacienteSchema>;
export type Sessao = z.infer<typeof sessaoSchema>;
export type Transacao = z.infer<typeof transacaoSchema>;