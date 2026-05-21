import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { Users, CalendarDays, Wallet, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getSession();
  const user = db.users.get(session!.userId);

  const pacientes = Array.from(db.pacientes.values());
  const sessoes = Array.from(db.sessoes.values());
  const transacoes = Array.from(db.transacoes.values());

  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita' && t.status === 'pago')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + t.valor, 0);

  const sessoesMes = sessoes.filter(s => {
    const dataSessao = new Date(s.data);
    const agora = new Date();
    return dataSessao.getMonth() === agora.getMonth() && dataSessao.getFullYear() === agora.getFullYear();
  }).length;

  const sessoesPendentes = transacoes.filter(t => t.status === 'pendente').length;

  const estatisticas = [
    {
      title: 'Total de Pacientes',
      value: pacientes.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Sessões este Mês',
      value: sessoesMes,
      icon: CalendarDays,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      title: 'Receitas do Mês',
      value: `R$ ${totalReceitas.toLocaleString('pt-BR')}`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Faturas Pendentes',
      value: sessoesPendentes,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div>
      <Header title="Dashboard" subtitle={`Bem-vindo(a), ${user?.nome}`} />
      
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {estatisticas.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-zinc-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-zinc-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary-600" />
                Últimas Sessões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessoes.slice(0, 5).map((sessao) => {
                  const paciente = pacientes.find(p => p.id === sessao.pacienteId);
                  return (
                    <div
                      key={sessao.id}
                      className="flex items-center justify-between border-b border-zinc-100 pb-3 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">
                          {paciente?.nome} {paciente?.sobrenome}
                        </p>
                        <p className="text-sm text-zinc-500">
                          {new Date(sessao.data).toLocaleDateString('pt-BR')} às {sessao.hora}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-zinc-600">{sessao.duracao} min</span>
                      </div>
                    </div>
                  );
                })}
                {sessoes.length === 0 && (
                  <p className="text-center text-zinc-500 py-4">Nenhuma sessão registrada</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary-600" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <span className="text-zinc-600">Total de Receitas</span>
                <span className="text-lg font-semibold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                <span className="text-zinc-600">Total de Despesas</span>
                <span className="text-lg font-semibold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-zinc-900">Balanço do Mês</span>
                <span className={`text-lg font-bold ${totalReceitas - totalDespesas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {(totalReceitas - totalDespesas).toLocaleString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}