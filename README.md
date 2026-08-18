# Ficha Trekking — PWA de Treino

PWA instalável, offline-first, para acompanhar a ficha de treino de preparação
para trilhas de carga alta. Os dados vivem no próprio aparelho (IndexedDB) e,
se você configurar o Supabase, sobem para a nuvem e sincronizam entre
dispositivos — **o app continua funcionando 100% offline nos dois casos**.

## O que faz

- **Ver a ficha** — os 7 dias da semana (Seg–Dom) com exercícios, séries, reps,
  descanso e dicas de execução.
- **Registrar carga por série** — um campo de kg por série, com salvamento
  automático. Aceita decimais (vírgula ou ponto).
- **Marcar exercício como concluído** — checkbox por exercício e progresso do
  dia (ex.: `4/7`). O que foi marcado **fica visível a semana inteira** e zera
  sozinho na virada de segunda-feira.
- **Histórico por exercício** — cargas registradas em treinos anteriores, com o
  recorde (melhor carga) em destaque.
- **Timer de descanso** — contagem regressiva com o tempo de cada exercício,
  alerta sonoro (WebAudio) e vibração ao terminar. Pausar, +15s e fechar.
- **Link de vídeo** — botão que abre a busca de execução no YouTube.
- **Offline + instalável** — funciona 100% sem internet após a primeira carga e
  é instalável na tela inicial (iOS e Android).
- **Backup e sync na nuvem (opcional)** — login por link mágico no e-mail e
  sincronização offline-first com o Supabase (ver abaixo).

## Stack

- **Vite + React + TypeScript**
- **vite-plugin-pwa** (service worker, manifest, precache offline)
- **IndexedDB** via **idb** para o histórico de cargas
- **Supabase** (Postgres + Auth) opcional para backup e sync entre aparelhos
- **CSS puro** com a identidade visual da ficha: Barlow Condensed nos títulos,
  Inter no corpo, JetBrains Mono nos números, paleta clara com acento azul e
  tags coloridas por padrão de movimento (bilateral = azul, unilateral = verde,
  core = âmbar, condicionamento = vinho). As fontes são auto-hospedadas
  (`@fontsource`) para funcionar offline.

## Rodando

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # typecheck + build de produção (gera dist/ com o PWA)
npm run preview    # serve o build de produção localmente
npm run gen-icons  # regenera os ícones PNG a partir de public/icon.svg
```

Para testar a instalação/offline no celular, sirva o `dist/` por HTTPS (ou
`localhost`) e use "Adicionar à tela inicial".

## Estrutura

```
src/
  data/ficha.ts          # a ficha fixa (seed) + índices e helpers
  db/db.ts               # camada IndexedDB (sessões semanais + fila de sync)
  sync/supabase.ts       # cliente Supabase e conversão registro <-> linha
  sync/sync.ts           # motor de sincronização (push/pull, LWW, auth)
  hooks/useSessao.ts     # carrega/cria a sessão da semana e persiste as cargas
  hooks/useSync.ts       # estado da sincronização para a UI
  timer/                 # timer de descanso (contexto + áudio/vibração)
  components/            # Home, DiaView, ExercicioItem, HistoricoView, ContaBar
supabase/schema.sql      # tabela, índice, trigger e RLS para rodar no Supabase
  router.ts              # roteamento por hash (#/ , #/dia/:id , #/hist/:id)
  types.ts               # tipos de domínio (Exercicio, Dia, SessaoRegistro)
```

### Modelo de dados gravado

```ts
interface SessaoRegistro {
  id: string            // `${diaId}-${semana}`, ex.: 'seg-2026-07-13'
  diaId: string         // 'seg'
  data: string          // '2026-07-15' — dia do último registro
  semana: string        // '2026-07-13' — segunda-feira da semana
  cargas: { [exercicioId: string]: (number | null)[] } // uma entrada por série
  concluidos: string[]  // ids de exercícios marcados como feitos
  atualizadoEm: string  // ISO timestamp — critério de conflito no sync
  pendente: 0 | 1       // 1 = ainda não enviado para a nuvem
}
```

**Uma sessão por dia-da-semana por semana.** É isso que faz o progresso durar a
semana toda e reiniciar na segunda: a chave carrega a segunda-feira da semana,
então virou a semana, virou registro novo — sem botão de reset e sem apagar
nada (as semanas anteriores continuam no histórico).

A ficha em si é fixa e definida no código (`src/data/ficha.ts`); a UI não edita
a estrutura da ficha, apenas registra cargas e conclusões.

> Nota: o plano define SEG–SEX e DOM. O Sábado foi incluído como dia de descanso
> para completar a semana (Seg–Dom = 7 cards), coerente com a lógica de chegar
> ao domingo recuperado.

## Backup e sync na nuvem (Supabase)

Opcional. Sem as variáveis de ambiente o app roda exatamente como antes: tudo
local, sem tela de login.

### 1. Criar o projeto

1. Crie um projeto em [supabase.com](https://supabase.com) (o plano free basta).
2. Abra **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql).
   Ele cria a tabela `sessoes`, o índice do cursor, o trigger de `servidor_em` e
   as políticas de RLS (cada pessoa só enxerga as próprias linhas).
3. Em **Authentication → Providers**, deixe **Email** ligado com *magic link*.
   Em **URL Configuration**, adicione a URL do app
   (`https://moacyr.github.io/Treino-App/`) em *Site URL* e *Redirect URLs*.

### 2. Configurar o app

Local:

```bash
cp .env.example .env.local
# preencha com Project Settings → API
```

Deploy (GitHub Pages): em **Settings → Secrets and variables → Actions →
Variables**, crie `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. O workflow já
passa as duas para o build.

> A chave `anon` é pública por natureza — quem protege os dados é o RLS, não o
> segredo da chave. Por isso ela vai como *variable*, não como *secret*.

### 3. Usar

No rodapé da Home aparece o cartão de conta: informe o e-mail, receba o link e
abra-o **no mesmo aparelho**. A partir daí o mesmo e-mail em outro celular ou no
desktop puxa o mesmo histórico.

### Como o sync funciona

- **Offline-first**: toda edição grava primeiro no IndexedDB e marca a sessão
  como `pendente`. A UI nunca espera a rede.
- **Push**: as pendentes sobem em um `upsert` por `(user_id, id)`. Só saem da
  fila se o `atualizadoEm` não mudou durante o envio — editar no meio do upload
  não perde a edição.
- **Pull**: busca as linhas com `servidor_em > cursor` (cursor guardado no
  IndexedDB). O carimbo é do relógio do **servidor**, via trigger, então o
  relógio errado de um aparelho não faz o sync pular registros.
- **Conflito**: *last-write-wins* por `atualizadoEm`. O remoto só sobrescreve o
  local se for mais novo. Como cada sessão é de um dia da semana, na prática o
  conflito só existe se você treinar o mesmo dia em dois aparelhos.
- **Quando roda**: ao abrir o app, ao logar, ao voltar a ficar online, ao trazer
  o app para frente e 2s depois de cada edição (debounce).
- **Troca de conta**: logar com outro e-mail no mesmo aparelho limpa o banco
  local antes de baixar, para não misturar históricos.
