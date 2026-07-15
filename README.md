# Ficha Trekking — PWA de Treino

PWA instalável, offline-first, para acompanhar a ficha de treino de preparação
para trilhas de carga alta. Uso pessoal, sem login e sem backend — **todos os
dados ficam no próprio aparelho** (IndexedDB).

## O que faz

- **Ver a ficha** — os 7 dias da semana (Seg–Dom) com exercícios, séries, reps,
  descanso e dicas de execução.
- **Registrar carga por série** — um campo de kg por série, com salvamento
  automático. Aceita decimais (vírgula ou ponto).
- **Marcar exercício como concluído** — checkbox por exercício e progresso do
  dia (ex.: `4/7`).
- **Histórico por exercício** — cargas registradas em treinos anteriores, com o
  recorde (melhor carga) em destaque.
- **Timer de descanso** — contagem regressiva com o tempo de cada exercício,
  alerta sonoro (WebAudio) e vibração ao terminar. Pausar, +15s e fechar.
- **Link de vídeo** — botão que abre a busca de execução no YouTube.
- **Offline + instalável** — funciona 100% sem internet após a primeira carga e
  é instalável na tela inicial (iOS e Android).

## Stack

- **Vite + React + TypeScript**
- **vite-plugin-pwa** (service worker, manifest, precache offline)
- **IndexedDB** via **idb** para o histórico de cargas
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
  db/db.ts               # camada IndexedDB (sessões por dia/data)
  hooks/useSessao.ts     # carrega/cria a sessão de hoje e persiste as cargas
  timer/                 # timer de descanso (contexto + áudio/vibração)
  components/            # Home, DiaView, ExercicioItem, HistoricoView, timer bar
  router.ts              # roteamento por hash (#/ , #/dia/:id , #/hist/:id)
  types.ts               # tipos de domínio (Exercicio, Dia, SessaoRegistro)
```

### Modelo de dados gravado

```ts
interface SessaoRegistro {
  id: string        // `${diaId}-${dataISO}`
  diaId: string     // 'seg'
  data: string      // '2026-07-15'
  cargas: { [exercicioId: string]: (number | null)[] } // uma entrada por série
  concluidos: string[]  // ids de exercícios marcados como feitos
}
```

A ficha em si é fixa e definida no código (`src/data/ficha.ts`); a UI não edita
a estrutura da ficha, apenas registra cargas e conclusões.

> Nota: o plano define SEG–SEX e DOM. O Sábado foi incluído como dia de descanso
> para completar a semana (Seg–Dom = 7 cards), coerente com a lógica de chegar
> ao domingo recuperado.
