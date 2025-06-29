# 🔧 Configuração das Variáveis de Ambiente no Netlify

## 🚨 **Problema Resolvido**

Removemos as variáveis de ambiente hardcoded do arquivo `netlify.toml` que estavam causando o erro de API key inválida. Agora você precisa configurar as variáveis no dashboard do Netlify.

---

## 📋 **Passo a Passo para Configurar no Netlify**

### **1. Acessar o Dashboard do Netlify**

1. Vá para [app.netlify.com](https://app.netlify.com/)
2. Faça login na sua conta
3. Selecione o site do Economiza AI

### **2. Configurar Variáveis de Ambiente**

1. No menu lateral, clique em **Site settings**
2. Clique em **Environment variables**
3. Clique em **Add a variable** para cada variável

### **3. Adicionar as Variáveis do Firebase**

Adicione as seguintes variáveis uma por uma:

```
REACT_APP_FIREBASE_API_KEY=sua_api_key_real_do_firebase
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### **4. Obter as Credenciais do Firebase**

Se você ainda não tem as credenciais:

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Clique no ícone de engrenagem ⚙️ (Configurações do Projeto)
4. Vá em **Configurações do SDK**
5. Copie as credenciais da seção **Configuração do SDK**

### **5. Configurar Domínios Autorizados**

1. No Firebase Console, vá em **Authentication**
2. Clique em **Settings** (aba)
3. Em **Authorized domains**, adicione:
   - `economiza-ai.netlify.app`
   - `localhost` (para desenvolvimento local)

### **6. Fazer Novo Deploy**

1. No Netlify, vá em **Deploys**
2. Clique em **Trigger deploy** → **Deploy site**
3. Aguarde o deploy completar

---

## 🔍 **Como Verificar se Está Funcionando**

### **1. Verificar no Console do Navegador**

1. Abra o site no navegador
2. Pressione F12 para abrir o DevTools
3. Vá na aba **Console**
4. Procure por mensagens como:
   - ✅ Firebase inicializado com sucesso!
   - ✅ Firebase Config Status: { isConfigured: true }

### **2. Testar o Login**

1. Clique em "Login com Google"
2. Se aparecer o popup do Google, está funcionando
3. Se der erro, verifique o console para detalhes

---

## 🚨 **Erros Comuns e Soluções**

### **Erro: "auth/api-key-not-valid"**

- **Causa**: API key incorreta ou não configurada
- **Solução**: Verificar se a variável `REACT_APP_FIREBASE_API_KEY` está correta no Netlify

### **Erro: "auth/unauthorized-domain"**

- **Causa**: Domínio não autorizado no Firebase
- **Solução**: Adicionar o domínio do Netlify no Firebase Console

### **Erro: "auth/popup-blocked"**

- **Causa**: Popup bloqueado pelo navegador
- **Solução**: Permitir popups para o site

### **Erro: "Firebase não configurado"**

- **Causa**: Variáveis de ambiente não carregadas
- **Solução**: Verificar se todas as variáveis estão configuradas no Netlify

---

## 📝 **Exemplo de Configuração Completa**

No Netlify Dashboard, suas variáveis devem ficar assim:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
REACT_APP_FIREBASE_AUTH_DOMAIN=economiza-ai.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=economiza-ai
REACT_APP_FIREBASE_STORAGE_BUCKET=economiza-ai.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

---

## 🔗 **Links Úteis**

- [Netlify Dashboard](https://app.netlify.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

---

## ✅ **Checklist de Verificação**

- [ ] Variáveis configuradas no Netlify Dashboard
- [ ] Credenciais do Firebase obtidas corretamente
- [ ] Domínios autorizados no Firebase Console
- [ ] Novo deploy realizado
- [ ] Console do navegador sem erros
- [ ] Login com Google funcionando
