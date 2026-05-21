# PsycheFlow - Escopo Técnico e Backlog do Produto

## 🏗️ 1. Arquitetura e Escopo Técnico

O projeto **PsycheFlow** será construído visando robustez, escalabilidade e altíssima segurança. Adotaremos as melhores práticas de **Clean Architecture** e princípios **SOLID** para garantir que a regra de negócio central seja independente de frameworks e infraestrutura.

### Estrutura de Clean Architecture
- **Domain Layer (Entidades):** Regras de negócio essenciais e modelos puros (ex: `Paciente`, `Sessao`, `Pagamento`). Sem dependências externas.
- **Application Layer (Casos de Uso):** Orquestração das entidades (ex: `RegistrarNovaSessaoUseCase`, `CalcularFaturamentoMensalUseCase`).
- **Interface Adapters (Controladores e Gateways):** NestJS Controllers para receber requisições HTTP, DTOs validados via **Zod**, e Presenters.
- **Infrastructure Layer (Frameworks e Drivers):** 
  - Banco de Dados: PostgreSQL via Supabase com **Row Level Security (RLS)** ativo.
  - ORM: Prisma ou Drizzle ORM (tipagem estática forte).
  - Criptografia: Serviços de encriptação AES-256 para dados em repouso.
  - Frontend: Next.js 14+ consumindo a API.

### Princípios SOLID Aplicados
- **SRP (Single Responsibility):** Cada Use Case terá uma única responsabilidade. Repositórios apenas lidam com persistência.
- **OCP (Open/Closed):** O sistema de relatórios financeiros será extensível (ex: adicionar exportação para PDF sem alterar a lógica base).
- **LSP (Liskov Substitution):** Contratos de repositórios claros (`IPatientRepository`), permitindo mocks fáceis nos testes com Jest.
- **ISP (Interface Segregation):** Interfaces pequenas e específicas para diferentes serviços do domínio.
- **DIP (Dependency Inversion):** O framework (NestJS) injetará as dependências da infraestrutura nos Casos de Uso através de injeção de dependência nativa.

---

## 📋 2. Histórias de Usuário (User Stories) e Critérios de Aceite

Abaixo está o backlog detalhado, formatado para importação direta em ferramentas ágeis como GitHub Project Boards, Jira ou Trello.

### 🛡️ Épico 1: Autenticação Segura e Privacidade

#### [US-01] Login Seguro com MFA
**Como** psicólogo psicanalista,
**Quero** autenticar-me no sistema exigindo um código MFA (Multi-Factor Authentication) além da senha,
**Para que** apenas eu tenha acesso à minha conta, cumprindo normas rigorosas de segurança.

* **Critérios de Aceite:**
  - [ ] O sistema deve permitir o login usando e-mail e senha.
  - [ ] Após o login inicial, o sistema deve solicitar um código de 6 dígitos (TOTP) de um app autenticador (ex: Google Authenticator).
  - [ ] O token JWT gerado deve expirar em um tempo curto (ex: 1 hora) e utilizar Refresh Tokens seguros (HttpOnly cookies).
  - [ ] A interface deve exibir feedbacks de erro claros sem expor o motivo exato (ex: "Credenciais inválidas").

#### [US-02] Criptografia de Dados em Repouso (At-Rest) e RLS
**Como** engenheiro de segurança do sistema,
**Quero** que as "Notas do Analista" e "Prontuários" sejam criptografados via AES-256 no banco e isolados por psicólogo,
**Para que** o vazamento do banco de dados não exponha o sigilo dos pacientes.

* **Critérios de Aceite:**
  - [ ] O backend deve criptografar o campo `analyst_notes` antes de salvar no PostgreSQL.
  - [ ] O backend deve descriptografar o campo `analyst_notes` apenas no momento do envio para o frontend autenticado.
  - [ ] O Supabase/PostgreSQL deve possuir políticas de Row Level Security (RLS) garantindo que `user_id` da requisição é o único que pode ler/escrever na tabela `patients` e `sessions`.
  - [ ] Os dados trafegados entre Front e Back devem ocorrer exclusivamente via HTTPS/TLS.

---

### 👤 Épico 2: Gestão de Pacientes e Anamnese Psicanalítica

#### [US-03] Cadastro e Listagem de Pacientes
**Como** psicólogo,
**Quero** cadastrar, editar e listar meus pacientes de forma intuitiva,
**Para que** eu possa organizar minha clínica digitalmente.

* **Critérios de Aceite:**
  - [ ] O formulário deve conter: Nome, Data de Nascimento, Telefone, Email e Status (Ativo/Inativo).
  - [ ] O frontend deve validar os dados usando Zod antes do envio, garantindo a integridade dos dados inseridos.
  - [ ] A lista de pacientes deve possuir paginação e busca por nome.
  - [ ] O carregamento da lista deve utilizar animações de Skeleton Screens para suavizar a espera, utilizando Framer Motion e componentes base do Shadcn.

#### [US-04] Registro de Anamnese Estruturada
**Como** psicólogo,
**Quero** registrar a anamnese inicial de um paciente em campos específicos,
**Para que** eu possa consultar o histórico basal e queixas principais sempre que necessário.

* **Critérios de Aceite:**
  - [ ] O perfil do paciente deve possuir uma aba "Anamnese".
  - [ ] O formulário deve suportar campos de texto para "Queixa Principal", "Histórico Familiar" e "Primeiras Impressões".
  - [ ] O salvamento deve refletir um alerta de sucesso toast moderno (Shadcn/ui) no canto inferior direito da tela.

---

### 📝 Épico 3: Diário de Sessões (Prontuário Eletrônico)

#### [US-05] Registro de Sessão com Salvamento Automático
**Como** psicólogo,
**Quero** digitar as falas de livre associação do paciente e ter o texto salvo automaticamente de tempos em tempos,
**Para que** eu não perca informações cruciais caso feche a aba sem querer ou haja queda de internet.

* **Critérios de Aceite:**
  - [ ] A interface da sessão deve ter uma área principal para o "Relato da Sessão" e exibir a data/hora atual de forma clara.
  - [ ] O frontend deve disparar um auto-save via *debounce* (ex: 3 segundos após parar de digitar).
  - [ ] Deve haver um indicador visual discreto mostrando os estados "Salvando..." e "Salvo na nuvem".
  - [ ] Transições de entrada/saída da tela de sessão devem ser suaves (fade-in via Framer Motion) para manter o foco do usuário.

#### [US-06] Notas do Analista (Visibilidade Controlada)
**Como** psicólogo,
**Quero** uma seção separada para "Notas do Analista" (minhas impressões teóricas e contratransferenciais),
**Para que** eu possa separá-las do relato literal do paciente e mantê-las sob camada extra de privacidade.

* **Critérios de Aceite:**
  - [ ] O campo de "Notas do Analista" deve estar visualmente segregado na tela da sessão (ex: um painel lateral ou acordeão com cor diferenciada em tom índigo/violeta).
  - [ ] O conteúdo destas notas deve passar pela criptografia At-Rest exigida na [US-02].
  - [ ] Deve haver a opção de ocultar/revelar visualmente as notas (ícone de olho) para evitar leitura acidental caso alguém esteja perto da tela (blur context).

---

### 💰 Épico 4: Controle Financeiro

#### [US-07] Lançamento Financeiro por Sessão
**Como** psicólogo,
**Quero** associar um valor financeiro a cada sessão realizada e registrar se foi pago ou não,
**Para que** o sistema alimente meu fluxo de caixa automaticamente.

* **Critérios de Aceite:**
  - [ ] Ao finalizar uma sessão, deve haver campos para `Valor Cobrado` e `Status de Pagamento` (Pendente, Pago).
  - [ ] O frontend deve aceitar máscaras monetárias adequadas à moeda local.
  - [ ] O registro financeiro deve ser vinculado à sessão e ao paciente correspondente de forma relacional no banco de dados.

#### [US-08] Dashboard de Faturamento e Inadimplência
**Como** psicólogo,
**Quero** visualizar um painel resumo com meus ganhos do mês e valores pendentes (inadimplentes),
**Para que** eu tenha controle rápido sobre a saúde financeira da minha clínica.

* **Critérios de Aceite:**
  - [ ] O painel principal (Dashboard) deve exibir *Cards* minimalistas com: Faturamento Total no Mês, Recebido, Pendente.
  - [ ] Deve haver uma tabela listando rapidamente quais pacientes possuem sessões com pagamento "Pendente".
  - [ ] As regras de cálculo de faturamento (Casos de Uso) devem possuir cobertura de Teste Unitário (Jest) de 100% garantindo a precisão absoluta dos valores.

---

## 🧪 3. Estratégia de Qualidade e Testes (QA)

Para garantir um padrão de nível corporativo que se destaque nos processos seletivos:
- **Testes Unitários:** Serão aplicados na *Application Layer* e *Domain Layer* (ex: garantindo que as regras financeiras de cálculo e lógicas de validação de acesso ao prontuário estão perfeitamente corretas). Utilizaremos **Jest** no NestJS.
- **Testes de Integração:** Aplicados no Frontend utilizando a **React Testing Library** para garantir que componentes cruciais (como o formulário de evolução e o salvamento automático) funcionem e exibam os estados de erro/sucesso corretamente.
- **Testes E2E (End-to-End):** Implementação de fluxo crítico com **Playwright** ou **Cypress** para simular o comportamento real do usuário: **Login Seguro -> Selecionar Paciente -> Criar Nota de Sessão -> Validar Auto-save e Criptografia**.
