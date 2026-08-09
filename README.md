# Portfolio Blog Starter

This is a porfolio site template complete with a blog. Includes:

- MDX and Markdown support
- Optimized for SEO (sitemap, robots, JSON-LD schema)
- RSS Feed
- Dynamic OG images
- Syntax highlighting
- Tailwind v4
- Vercel Speed Insights / Web Analytics
- Geist font

## Demo

https://portfolio-blog-starter.vercel.app

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/solutions/blog&project-name=blog&repository-name=blog)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/solutions/blog blog
```

Then, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/templates) ([Documentation](https://nextjs.org/docs/app/building-your-application/deploying)).

## RPG - Supabase setup

1. Crie um projeto no Supabase e copie `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` (ou use a chave de serviço segura para a rota server-side).
2. No painel SQL do Supabase, rode o arquivo `supabase/init.sql` para criar as tabelas iniciais (`masters`, `players`, `codes`).
3. Adicione os seguintes vars de ambiente localmente (ex.: `.env.local`):

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ... (service role)
```

4. Instale dependências e rode em dev:

```bash
pnpm install
pnpm dev
```

5. Para testar: insira um `code` na tabela `codes` ligado ao `target_id` (uuid) apropriado. Use o código na página inicial para entrar como Mestre ou Jogador.

Observação: esta implementação adiciona apenas a verificação do código e mantém uma sessão simples no `localStorage`. Podemos estender para autenticação completa, geração de códigos pelo Mestre e persistência das fichas (players) conforme desejar.

