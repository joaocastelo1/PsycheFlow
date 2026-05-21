'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import { Sessao, Paciente } from '@/types';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, User, FileText, Stethoscope } from 'lucide-react';

export default function SessoesPage() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);

  const [formulario, setFormulario] = useState<Partial<Sessao>>({
    pacienteId: '',
    data: '',
    hora: '',
    duracao: 50,
    conteudo: '',
    notasAnalista: '',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resSessoes, resPacientes] = await Promise.all([
        fetch('/api/sessoes'),
        fetch('/api/pacientes'),
      ]);
      const dataSessoes = await resSessoes.json();
      const dataPacientes = await resPacientes.json();
      setSessoes(dataSessoes);
      setPacientes(dataPacientes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setSessaoSelecionada(null);
    setFormulario({
      pacienteId: '',
      data: '',
      hora: '',
      duracao: 50,
      conteudo: '',
      notasAnalista: '',
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (sessao: Sessao) => {
    setSessaoSelecionada(sessao);
    setFormulario(sessao);
    setModalAberto(true);
  };

  const abrirModalExcluir = (sessao: Sessao) => {
    setSessaoSelecionada(sessao);
    setModalExcluirAberto(true);
  };

  const salvarSessao = async () => {
    try {
      const url = sessaoSelecionada
        ? `/api/sessoes/${sessaoSelecionada.id}`
        : '/api/sessoes';
      const method = sessaoSelecionada ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario),
      });

      if (res.ok) {
        await carregarDados();
        setModalAberto(false);
      }
    } catch (error) {
      console.error('Erro ao salvar sessao:', error);
    }
  };

  const excluirSessao = async () => {
    if (!sessaoSelecionada) return;
    try {
      const res = await fetch(`/api/sessoes/${sessaoSelecionada.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await carregarDados();
        setModalExcluirAberto(false);
      }
    } catch (error) {
      console.error('Erro ao excluir sessao:', error);
    }
  };

  const getNomePaciente = (pacienteId: string) => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente ? `${paciente.nome} ${paciente.sobrenome}` : 'Paciente removido';
  };

  const sessoesFiltradas = sessoes.filter((s) => {
    const nomePaciente = getNomePaciente(s.pacienteId).toLowerCase();
    const termo = busca.toLowerCase();
    return nomePaciente.includes(termo) || s.data.includes(termo);
  });

  if (carregando) {
    return (
      <div>
        <Header title="Sessões" subtitle="Gerencie as sessões clínicas" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Sessões" subtitle={`${sessoes.length} sessão(ões) registrada(s)`} />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar sessão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={abrirModalNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Sessão
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessoesFiltradas.map((sessao) => (
                  <TableRow key={sessao.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                          <User className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{getNomePaciente(sessao.pacienteId)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span>{new Date(sessao.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-zinc-400" />
                        <span>{sessao.hora}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-600">{sessao.duracao} min</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => abrirModalEditar(sessao)}>
                          <Edit2 className="h-4 w-4 text-zinc-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirModalExcluir(sessao)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {sessoesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      Nenhuma sessão encontrada
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
              {sessaoSelecionada ? 'Editar Sessão' : 'Nova Sessão'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="paciente">Paciente *</Label>
              <Select
                value={formulario.pacienteId}
                onValueChange={(value) => setFormulario({ ...formulario, pacienteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id!}>
                      {paciente.nome} {paciente.sobrenome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formulario.data}
                  onChange={(e) => setFormulario({ ...formulario, data: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora">Horário *</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formulario.hora}
                  onChange={(e) => setFormulario({ ...formulario, hora: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duracao">Duração (minutos)</Label>
              <Input
                id="duracao"
                type="number"
                min={30}
                max={120}
                value={formulario.duracao}
                onChange={(e) => setFormulario({ ...formulario, duracao: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo da Sessão</Label>
              <Textarea
                id="conteudo"
                value={formulario.conteudo}
                onChange={(e) => setFormulario({ ...formulario, conteudo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notasAnalista">Notas do Analista</Label>
              <Textarea
                id="notasAnalista"
                value={formulario.notasAnalista}
                onChange={(e) => setFormulario({ ...formulario, notasAnalista: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarSessao}>
              {sessaoSelecionada ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalExcluirAberto} onOpenChange={setModalExcluirAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalExcluirAberto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirSessao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
