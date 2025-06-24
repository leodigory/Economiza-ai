# <img src="public/logo192.png" alt="Logo Economiza AI" width="48" style="vertical-align:middle;"> Economiza AI

**Economiza AI** é um aplicativo moderno de lista de compras inteligente, criado para ajudar você a economizar de verdade! Com recursos avançados, comparação de preços, histórico visual e automações, o app transforma sua experiência de compras em algo prático, eficiente e econômico.

---

## 🚀 Objetivo do Projeto

> **Facilitar e otimizar o processo de compras, permitindo ao usuário comparar preços, registrar históricos, receber sugestões automáticas e, principalmente, economizar!**

- Visualize mercados próximos e favoritos
- Crie listas de compras inteligentes
- Compare preços automaticamente
- Salve históricos e analise sua evolução
- Use recursos mobile como leitor de código de barras e OCR (em desenvolvimento)

---

## 🔎 Fluxo Visual do Usuário

```mermaid
graph TD
  A[Home: Lista de Mercados] --> B[Seleciona Mercado]
  B --> C[Cria/Abre Lista de Compras]
  C --> D[Adiciona Itens (código de barras, foto, manual)]
  D --> E[Marca/Desmarca Itens (check)]
  E --> F[Adiciona Valor Pago (manual ou foto)]
  F --> G[Finaliza Lista]
  G --> H[Histórico de Compras]
  H --> I[Adiciona Foto da Nota Fiscal]
  I --> J[Verificação Automática de Preços]
```

---

## 🖼️ Exemplos Visuais

| Home (Mercados) | Lista de Compras | Histórico |
|---|---|---|
| ![Home](public/logo192.png) | ![Lista](public/logo512.png) | ![Histórico](public/logo192.png) |

> **Dica:** Substitua as imagens acima por prints reais do app para um README ainda mais profissional!

---

## ✨ Funcionalidades Principais

- **Lista de compras inteligente** com sugestões automáticas
- **Comparação de preços** com histórico visual
- **Barra de progresso animada**
- **Leitor de código de barras** e OCR (em desenvolvimento)
- **Dashboard com estatísticas**
- **Modo escuro/claro**
- **Compartilhamento de listas**
- **Gerenciamento de usuários/admins**
- **Acessibilidade e responsividade total**

---

## 💡 Como Usar

1. **Inicie uma nova lista**: escolha o mercado ou adicione um personalizado
2. **Adicione itens**: manualmente, por código de barras ou foto
3. **Marque itens** conforme pega nas gôndolas
4. **Adicione valores pagos** (manual ou OCR)
5. **Finalize a lista** e salve no histórico
6. **Compare preços** e veja dicas de economia

---

## 🛠️ Tecnologias Utilizadas

- React 18
- CSS3 moderno
- Firebase/Firestore
- APIs de sugestões
- OCR e leitura de código de barras (em desenvolvimento)
- Netlify (deploy)

---

## 🔒 Segurança e Boas Práticas

- Dados sensíveis via variáveis de ambiente
- Firestore com regras de segurança
- Sem tracking de terceiros

---

## 📈 Diferenciais

- Visual moderno e intuitivo
- Fluxo de uso pensado para economia real
- Histórico visual e comparativo
- Facilidade de uso em qualquer dispositivo

---

## 📲 Deploy e Teste

1. Faça o clone do projeto
2. Configure as variáveis de ambiente (veja exemplo abaixo)
3. Rode `npm install` e `npm start`
4. Para deploy, use Netlify ou Vercel

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
REACT_APP_GOOGLE_CLIENT_ID=...
```

---

## 👨‍💻 Contribua!

Sugestões, issues e PRs são bem-vindos! Ajude a tornar o Economiza AI ainda melhor.

---

> **Economiza AI** — Sua economia começa antes mesmo de sair de casa!
