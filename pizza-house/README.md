# Pizza House — site institucional

Site oficial da **Pizza House**, pizzaria artesanal em Divinópolis — MG.
Página única, com foco em conversão pelo WhatsApp: hero, nossa história, diferenciais, cardápio interativo,
tamanhos e preços, Combo Casal, galeria com lightbox, avaliações, reservas, localização e rodapé.

**Stack:** Next.js 16 (exportação estática) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide Icons

---

## Como rodar

Requer Node.js 20 ou mais recente.

```bash
npm install
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # gera o site estático final na pasta out/
npm run start      # serve a pasta out/ localmente para conferência
```

## Pacote pronto (.zip)

```bash
npm run pacote     # gera dist/pizza-house-site.zip
```

O pacote usa caminhos relativos e fontes embutidas: abre com **duplo clique em `index.html`** (sem servidor)
e também pode ser enviado direto para a hospedagem. Para incluir o domínio definitivo no SEO:
`NEXT_PUBLIC_SITE_URL=https://www.seudominio.com.br npm run pacote`.

## Publicação

O build gera HTML/CSS/JS estáticos em `out/`, que podem ir para qualquer hospedagem:

- **Vercel / Netlify / Cloudflare Pages:** importe o repositório, defina a pasta raiz como `pizza-house`,
  comando `npm run build` e diretório de saída `out`.
- **Hospedagem tradicional (Hostinger, cPanel etc.) ou Netlify Drop:** envie o conteúdo do pacote
  (`npm run pacote`) ou da pasta `out/` para a pasta pública (`public_html`).

**Importante:** defina a variável de ambiente `NEXT_PUBLIC_SITE_URL` com o domínio final
(ex.: `https://www.seudominio.com.br`) antes do build. Ela é usada no SEO, no sitemap e na imagem de compartilhamento.
Na Vercel, Netlify e Cloudflare Pages o endereço do projeto é detectado automaticamente se a variável não for definida.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Telefone, WhatsApp, endereço, horários, reservas, Instagram, nota do Google | `src/config/site.ts` |
| Sabores, descrições, fotos, tamanhos, preços e Combo Casal | `src/data/menu.ts` |
| Fotos da galeria e legendas | `src/data/gallery.ts` |
| Depoimentos de clientes (somente reais) | `src/data/testimonials.ts` |
| Mensagens automáticas do WhatsApp | `src/lib/whatsapp.ts` |
| Cores, fontes e animações globais | `src/app/globals.css` |

Todos os botões de pedido abrem `https://wa.me/553732147992` com uma mensagem pronta
(ex.: *"Olá! Vim pelo site da Pizza House e gostaria de pedir uma pizza de Calabresa…"*).
O site não simula pedidos: tudo é finalizado no WhatsApp da pizzaria.

## Pendências — informações a confirmar ou preencher

1. **Endereço** — "R. Ibirité, 230 — Bom Pastor" foi lido do card do Google publicado no Instagram da pizzaria.
   Confirme em `src/config/site.ts` (deixe vazio para ocultar). O CEP também pode ser adicionado lá.
2. **Instagram oficial** — preencha `social.instagram` e `social.instagramHandle`. Enquanto estiver vazio, os links ficam ocultos.
3. **Domínio** — variável `NEXT_PUBLIC_SITE_URL` (veja acima). Sem ela, o site funciona normalmente, mas as tags que
   exigem endereço completo (link canônico, sitemap, imagem de compartilhamento) ficam de fora.
4. **Descrições dos sabores** — seguem a receita tradicional de cada pizza; revise os ingredientes em `src/data/menu.ts`.
5. **Fotos dos sabores sem foto própria** — Calabresa, Quatro Queijos, 5 Queijos, Costela Premium, Pepperoni e KitKat
   usam ilustrações. Envie as fotos para substituí-las (veja abaixo).
6. **Fotos em alta resolução** — as fotos atuais foram recortadas de uma captura de tela do Instagram
   (cerca de 390 px de largura). As originais deixam o site ainda mais nítido.
7. **Depoimentos** — adicione avaliações reais em `src/data/testimonials.ts`.
8. **Mapa / avaliações** — opcionalmente cole o link de incorporação oficial do Google Maps e o link do perfil no
   Google em `maps.embedUrl` e `maps.reviewsUrl`.

## Fotos e imagens

```
assets/originals/   materiais enviados (montagem do Instagram + peça de marca)
assets/photos/      fotos individuais recortadas e limpas (sem ícones e textos do Instagram)
public/images/      versões otimizadas (AVIF + WebP, 1x e 2x) geradas automaticamente
```

- `npm run photos` — refaz os recortes a partir de `assets/originals/` (requer Python 3 com pillow, numpy e opencv-python-headless)
- `npm run images` — otimiza as fotos de `assets/photos/`, gera a imagem de compartilhamento, os ícones e as ilustrações

**Para trocar ou adicionar uma foto:** salve o arquivo em `assets/photos/` (ex.: `calabresa.jpg`), adicione o nome na lista
`PHOTOS` de `scripts/optimize-images.mjs`, rode `npm run images` e use o nome no cardápio
(`image: "calabresa"` no lugar de `illustration`).

## Marca

- `public/brand/logo.svg` e `logo-dark.svg` — logotipo vetorizado a partir da arte original (claro e escuro)
- `src/app/icon.svg`, `favicon.ico`, `apple-icon.png`, `public/brand/icon-*.png` — favicon e ícones do app
- `public/og-image.jpg` — imagem exibida ao compartilhar o link (WhatsApp, Instagram, Facebook)

## Qualidade e SEO

- Dados estruturados Schema.org `Restaurant` (endereço, telefone, horários, cardápio) apenas com informações confirmadas
- Metadados Open Graph/Twitter, `sitemap.xml`, `robots.txt`, manifest e geotags de Divinópolis
- Imagens com AVIF/WebP, `srcset`, carregamento sob demanda e placeholder borrado; CSS crítico embutido
- Animações respeitam a preferência "reduzir movimento" do sistema; o mapa do Google só carrega após o clique
- Acessibilidade: navegação por teclado, foco visível, menu e lightbox com foco preso, textos alternativos
- Lighthouse (build local com gzip): Acessibilidade 100 · Boas práticas 100 · SEO 100 · Desempenho 91 (desktop) / 81 (mobile simulado)
