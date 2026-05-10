# LP Nutrition PWA

**Plano de Alimentação Semanal — LP · Lateral Direito · 17 Anos**

App instalável (PWA) gerado a partir do plano original de nutrição esportiva.

---

## Estrutura do projeto

```
/
├── index.html           ← app principal (HTML + CSS + JS preservados)
├── manifest.json        ← configuração PWA
├── service-worker.js    ← cache offline
├── assets/
│   └── icons/           ← ícones PWA em 8 tamanhos
└── README.md
```

---

## Como publicar no GitHub Pages

### 1. Cria o repositório

```bash
git init
git add .
git commit -m "LP Nutrition PWA"
```

- Vai a github.com → **New repository**
- Nome sugerido: `lp-nutrition` (ou qualquer nome)
- Visibilidade: **Public** (obrigatório para GitHub Pages grátis)

### 2. Faz o push

```bash
git remote add origin https://github.com/SEU_USUARIO/lp-nutrition.git
git branch -M main
git push -u origin main
```

### 3. Ativa o GitHub Pages

- No repositório → **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main** / folder: **/ (root)**
- Clica **Save**

Após ~1 minuto, o app fica disponível em:
```
https://SEU_USUARIO.github.io/lp-nutrition/
```

---

## Como instalar no Android

1. Abre o link do GitHub Pages no **Chrome**
2. Aguarda 2–3 segundos — aparece o banner na parte inferior: **"INSTALAR APP"**
3. Toca em **Instalar**
4. Confirma na caixa de diálogo do sistema
5. O app aparece na tela inicial como um aplicativo normal

> Se o banner não aparecer: toca no menu (⋮) do Chrome → **"Adicionar à tela inicial"**

---

## Como instalar no PC (Windows/Mac/Linux)

1. Abre o link no **Chrome** ou **Edge**
2. Na barra de endereço, aparece um ícone de instalação (⊕) no lado direito
3. Clica → **Instalar**
4. O app abre em janela própria, sem barra do navegador

---

## Como funciona offline

O service worker cacheia automaticamente:
- O `index.html` completo
- O `manifest.json`
- Os ícones
- As fontes do Google (após a primeira visita)

Após a primeira abertura com internet, o app funciona **100% offline**.

---

## Como atualizar o app (versões futuras)

Quando fizeres alterações no HTML:

1. Edita o arquivo
2. No `service-worker.js`, muda o nome do cache:
   ```js
   const CACHE_NAME = 'lp-nutrition-v2'; // incrementa o número
   ```
3. Faz commit e push normalmente

Os utilizadores verão automaticamente o toast **"NOVA VERSÃO"** na próxima abertura com internet — basta tocar em **Atualizar**.

---

## Notas técnicas

- Não depende de nenhum backend ou servidor
- Funciona com qualquer hosting estático (GitHub Pages, Netlify, Vercel)
- Testado em Chrome 120+, Edge 120+, Firefox 121+, Safari 17+
- Instalação como app suportada em Android (Chrome) e Windows/Mac (Chrome/Edge)
- Safari iOS: suporte parcial (sem banner automático, mas funciona via "Adicionar à tela de início" manual)
