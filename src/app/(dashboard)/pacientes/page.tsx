'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Paciente } from '@/types';
import { Plus, Search, Edit2, Trash2, User, Phone, Mail, Calendar, Briefcase, Heart, FileText, Eye, EyeOff } from 'lucide-react';

const estadoCivilOptions = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'outro', label: 'Outro' },
];

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [mostrarNotas, setMostrarNotas] = useState(false);

  const [formulario, setFormulario] = useState<Partial<Paciente>>({
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    cpf: '',
    telefone: '',
    email: '',
    endereco: '',
    profissao: '',
    estadoCivil: '',
    motivoConsulta: '',
    historico: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes');
      const data = await res.json();
      setPacientes(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setPacienteSelecionado(null);
    setFormulario({
      nome: '',
      sobrenome: '',
      dataNascimento: '',
      cpf: '',
      telefone: '',
      email: '',
      endereco: '',
      profissao: '',
      estadoCivil: '',
      motivoConsulta: '',
      historico: '',
      observacoes: '',
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setFormulario(paciente);
    setModalAberto(true);
  };

  const abrirModalExcluir = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setModalExcluirAberto(true);
  };

  const salvarPaciente = async () => {
    try {
      const url = pacienteSelecionado
        ? `/api/pacientes/${pacienteSelecionado.id}`
        : '/api/pacientes';
      const method = pacienteSelecionado ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      });

      if (res.ok) {
        await carregarPacientes();
        setModalAberto(false);
      }
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const excluirPaciente = async () => {
    if (!pacienteSelecionado) return;
    try {
      const res = await fetch(`/api/pacientes/${pacienteSelecionado.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await carregarPacientes();
        setModalExcluirAberto(false);
      }
    } catch (error) {
      console.error('Erro ao excluir paciente:', error);
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const termo = busca.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      p.sobrenome.toLowerCase().includes(termo) ||
      p.email?.toLowerCase().includes(termo)
    );
  });

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return '';
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return `${idade} anos`;
  };

  if (carregando) {
    return (
      <div>
        <Header title="Pacientes" subtitle="Gerencie seus pacientes" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Pacientes" subtitle={`${pacientes.length} paciente(s) cadastrado(s)`} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar paciente..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={abrirModalNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Paciente
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Profissão</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pacientesFiltrados.map((paciente) => (
                  <TableRow key={paciente.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {paciente.nome} {paciente.sobrenome}
                          </p>
                          <p className="text-sm text-zinc-500">{paciente.motivoConsulta || 'Sem motivo registrado'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {paciente.telefone && (
                          <p className="flex items-center gap-2 text-sm text-zinc-600">
                            <Phone className="h-3 w-3" />
                            {paciente.telefone}
                          </p>
                        )}
                        {paciente.email && (
                          <p className="flex items-center gap-2 text-sm text-zinc-600">
                            <Mail className="h-3 w-3" />
                            {paciente.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm">{paciente.profissao || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm">{calcularIdade(paciente.dataNascimento)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPacienteSelecionado(paciente);
                            setFormulario(paciente);
                            setMostrarNotas(false);
                          }}
                          title="Ver detalhes"
                        >
                          <FileText className="h-4 w-4 text-zinc-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirModalEditar(paciente)}
                        >
                          <Edit2 className="h-4 w-4 text-zinc-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirModalExcluir(paciente)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {pacientesFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      Nenhum paciente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {pacienteSelecionado ? 'Editar Paciente' : 'Novo Paciente'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formulario.nome}
                  onChange={(e) => setFormulario({ ...formulario, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  value={formulario.sobrenome}
                  onChange={(e) => setFormulario({ ...formulario, sobrenome: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formulario.dataNascimento}
                  onChange={(e) => setFormulario({ ...formulario, dataNascimento: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formulario.cpf}
                  onChange={(e) => setFormulario({ ...formulario, cpf: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formulario.telefone}
                  onChange={(e) => setFormulario({ ...formulario, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formulario.email}
                  onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formulario.endereco}
                onChange={(e) => setFormulario({ ...formulario, endereco: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={formulario.profissao}
                  onChange={(e) => setFormulario({ ...formulario, profissao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estadoCivil">Estado Civil</Label>
                <Select
                  value={formulario.estadoCivil}
                  onValueChange={(value) => setFormulario({ ...formulario, estadoCivil: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadoCivilOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivoConsulta">Motivo da Consulta</Label>
              <Textarea
                id="motivoConsulta"
                value={formulario.motivoConsulta}
                onChange={(e) => setFormulario({ ...formulario, motivoConsulta: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="historico">Histórico</Label>
              <Textarea
                id="historico"
                value={formulario.historico}
                onChange={(e) => setFormulario({ ...formulario, historico: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formulario.observacoes}
                onChange={(e) => setFormulario({ ...formulario, observacoes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarPaciente}>
              {pacienteSelecionado ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pacienteSelecionado && !modalAberto && !modalExcluirAberto && !!formulario.nome} onOpenChange={() => setFormulario({})} >
        <AnimatePresence>
          {pacienteSelecionado && formulario.nome && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <User className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <span>{formulario.nome} {formulario.sobrenome}</span>
                    <p className="text-sm font-normal text-zinc-500">{calcularIdade(formulario.dataNascimento || '')} - {formulario.profissao}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500 flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Telefone
                    </p>
                    <p className="font-medium">{formulario.telefone || '-'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-zinc-500 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </p>
                    <p className="font-medium">{formulario.email || '-'}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-zinc-500 flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Estado Civil
                  </p>
                  <p className="font-medium capitalize">{formulario.estadoCivil || '-'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">Motivo da Consulta</p>
                  <p className="text-zinc-700">{formulario.motivoConsulta || 'Não registrado'}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-zinc-500">Histórico</p>
                  <p className="text-zinc-700">{formulario.historico || 'Não registrado'}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-zinc-500">Observações</p>
                    <button
                      onClick={() => setMostrarNotas(!mostrarNotas)}
                      className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                    >
                      {mostrarNotas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {mostrarNotas ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  {mostrarNotas ? (
                    <p className="text-zinc-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      {formulario.observacoes || 'Não registrado'}
                    </p>
                  ) : (
                    <p className="text-zinc-400 italic">Clique em "Mostrar" para ver as observações</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setPacienteSelecionado(null); setFormulario({}); }}>
                  Fechar
                </Button>
                <Button onClick={() => { setModalAberto(true); }}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      <Dialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Tem certeza que deseja excluir o paciente <strong>{pacienteSelecionado?.nome} {pacienteSelecionado?.sobrenome}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalExcluirAberto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirPaciente}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}