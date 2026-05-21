'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Transacao, Paciente } from '@/types';
import { Plus, Search, Edit2, Trash2, ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const categoriasReceita = ['Consulta', 'Plano de Sessões', 'Supervisão', 'Outros'];
const categoriasDespesa = ['Aluguel', 'Material', 'Assinatura', 'Marketing', 'Impostos', 'Outros'];

export default function FinanceiroPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [transacaoSelecionada, setTransacaoSelecionada] = useState<Transacao | null>(null);

  const [formulario, setFormulario] = useState<Partial<Transacao>>({
    tipo: 'receita',
    categoria: '',
    descricao: '',
    valor: 0,
    data: '',
    pacienteId: '',
    status: 'pago',
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resTransacoes, resPacientes] = await Promise.all([
        fetch('/api/transacoes'),
        fetch('/api/pacientes'),
      ]);
      if (resTransacoes.ok) {
        const dataTransacoes = await resTransacoes.json();
        setTransacoes(dataTransacoes);
      }
      if (resPacientes.ok) {
        const dataPacientes = await resPacientes.json();
        setPacientes(dataPacientes);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const abrirModalNovo = () => {
    setTransacaoSelecionada(null);
    setFormulario({
      tipo: 'receita',
      categoria: '',
      descricao: '',
      valor: 0,
      data: new Date().toISOString().split('T')[0],
      pacienteId: '',
      status: 'pago',
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (transacao: Transacao) => {
    setTransacaoSelecionada(transacao);
    setFormulario(transacao);
    setModalAberto(true);
  };

  const abrirModalExcluir = (transacao: Transacao) => {
    setTransacaoSelecionada(transacao);
    setModalExcluirAberto(true);
  };

  const salvarTransacao = async () => {
    try {
      const url = transacaoSelecionada
        ? `/api/transacoes/${transacaoSelecionada.id}`
        : '/api/transacoes';
      const method = transacaoSelecionada ? 'PUT' : 'POST';

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
      console.error('Erro ao salvar transacao:', error);
    }
  };

  const excluirTransacao = async () => {
    if (!transacaoSelecionada) return;
    try {
      const res = await fetch(`/api/transacoes/${transacaoSelecionada.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await carregarDados();
        setModalExcluirAberto(false);
      }
    } catch (error) {
      console.error('Erro ao excluir transacao:', error);
    }
  };

  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita' && t.status !== 'cancelado')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa' && t.status !== 'cancelado')
    .reduce((acc, t) => acc + t.valor, 0);

  const transacoesFiltradas = transacoes.filter((t) => {
    const termo = busca.toLowerCase();
    return (
      t.descricao.toLowerCase().includes(termo) ||
      t.categoria.toLowerCase().includes(termo)
    );
  });

  if (carregando) {
    return (
      <div>
        <Header title="Financeiro" subtitle="Gerencie suas finanças" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Financeiro" subtitle={`${transacoes.length} transação(ões) registrada(s)`} />

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Receitas</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {totalReceitas.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Despesas</CardTitle>
              <div className="p-2 rounded-lg bg-red-50">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                R$ {totalDespesas.toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600">Saldo</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalReceitas - totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {(totalReceitas - totalDespesas).toLocaleString('pt-BR')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Buscar transação..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={abrirModalNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transacoesFiltradas.map((transacao) => (
                  <TableRow key={transacao.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {transacao.tipo === 'receita' ? (
                          <ArrowUpCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <ArrowDownCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium text-zinc-900">{transacao.descricao}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-zinc-600">{transacao.categoria}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{new Date(transacao.data).toLocaleDateString('pt-BR')}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {transacao.valor.toLocaleString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        transacao.status === 'pago' ? 'bg-green-50 text-green-700' :
                        transacao.status === 'pendente' ? 'bg-amber-50 text-amber-700' :
                        'bg-red-50 text-red-700'
                      }`}>
                        {transacao.status === 'pago' ? 'Pago' : transacao.status === 'pendente' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => abrirModalEditar(transacao)}>
                          <Edit2 className="h-4 w-4 text-zinc-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirModalExcluir(transacao)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {transacoesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                      Nenhuma transação encontrada
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
              {transacaoSelecionada ? 'Editar Transação' : 'Nova Transação'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Tipo *</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={formulario.tipo === 'receita' ? 'default' : 'outline'}
                  className={`flex-1 ${formulario.tipo === 'receita' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setFormulario({ ...formulario, tipo: 'receita' })}
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Receita
                </Button>
                <Button
                  type="button"
                  variant={formulario.tipo === 'despesa' ? 'default' : 'outline'}
                  className={`flex-1 ${formulario.tipo === 'despesa' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setFormulario({ ...formulario, tipo: 'despesa' })}
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Despesa
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formulario.categoria}
                onValueChange={(value) => setFormulario({ ...formulario, categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(formulario.tipo === 'receita' ? categoriasReceita : categoriasDespesa).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formulario.descricao}
                onChange={(e) => setFormulario({ ...formulario, descricao: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formulario.valor}
                  onChange={(e) => setFormulario({ ...formulario, valor: Number(e.target.value) })}
                  required
                />
              </div>
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
            </div>

            {formulario.tipo === 'receita' && (
              <div className="space-y-2">
                <Label htmlFor="pacienteId">Paciente (opcional)</Label>
                <Select
                  value={formulario.pacienteId || ''}
                  onValueChange={(value) => setFormulario({ ...formulario, pacienteId: value || undefined })}
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
            )}

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formulario.status}
                onValueChange={(value) => setFormulario({ ...formulario, status: value as Transacao['status'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarTransacao}>
              {transacaoSelecionada ? 'Salvar Alterações' : 'Cadastrar'}
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
            Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalExcluirAberto(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={excluirTransacao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
