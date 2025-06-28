# 🔥 Solução para Erro do Firebase

## 🚨 **Problema Identificado**

O erro que você está enfrentando é causado por **variáveis de ambiente não configuradas** no Netlify. O Firebase está tentando usar valores placeholder como `your_firebase_api_key_here` em vez das credenciais reais.

### **Erros Específicos:**

- `auth/api-key-not-valid.-please-pass-a-valid-api-key`
- `GET https://identitytoolkit.googleapis.com/v1/projects?key=your_firebase_api_key_here 400 (Bad Request)`

---

## ✅ **Solução Passo a Passo**

### **1. Obter Credenciais do Firebase**

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** (ícone de engrenagem)
4. Clique em **Configurações do SDK**
5. Copie as credenciais da seção **Configuração do SDK**

### **2. Configurar Variáveis no Netlify**

#### **Opção A: Via Dashboard do Netlify (Recomendado)**

1. Acesse o [Netlify Dashboard](https://app.netlify.com/)
2. Selecione seu site
3. Vá em **Site settings** → **Environment variables**
4. Adicione as seguintes variáveis:

```
REACT_APP_FIREBASE_API_KEY=sua_api_key_real
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
REACT_APP_GOOGLE_CLIENT_ID=seu_google_client_id
```

#### **Opção B: Via netlify.toml**

1. Edite o arquivo `netlify.toml`
2. Substitua os valores placeholder pelas credenciais reais:

```toml
[context.production.environment]
  REACT_APP_FIREBASE_API_KEY = "sua_api_key_real"
  REACT_APP_FIREBASE_AUTH_DOMAIN = "seu_projeto.firebaseapp.com"
  REACT_APP_FIREBASE_PROJECT_ID = "seu_projeto_id"
  REACT_APP_FIREBASE_STORAGE_BUCKET = "seu_projeto.appspot.com"
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID = "seu_sender_id"
  REACT_APP_FIREBASE_APP_ID = "seu_app_id"
  REACT_APP_FIREBASE_MEASUREMENT_ID = "seu_measurement_id"
  REACT_APP_GOOGLE_CLIENT_ID = "seu_google_client_id"
```

### **3. Configurar Domínio Autorizado no Firebase**

1. No Firebase Console, vá em **Authentication** → **Settings**
2. Na seção **Authorized domains**, adicione:
   - `economiza-ai.netlify.app`
   - `localhost` (para desenvolvimento local)

### **4. Configurar Google OAuth (se necessário)**

1. No Firebase Console, vá em **Authentication** → **Sign-in method**
2. Habilite **Google**
3. Configure o **Web SDK configuration**
4. Adicione o domínio do Netlify como autorizado

### **5. Re-deploy no Netlify**

1. Após configurar as variáveis, faça um novo deploy:
   ```bash
   git add .
   git commit -m "Fix: Configure Firebase environment variables"
   git push
   ```

---

## 🔧 **Configuração Local (Desenvolvimento)**

### **1. Criar arquivo .env.local**

```bash
# Na raiz do projeto
cp env.example .env.local
```

### **2. Editar .env.local**

```env
REACT_APP_FIREBASE_API_KEY=sua_api_key_real
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
REACT_APP_GOOGLE_CLIENT_ID=seu_google_client_id
```

### **3. Reiniciar o servidor de desenvolvimento**

```bash
npm start
```

---

## 🔍 **Verificação da Configuração**

### **1. Verificar se as variáveis estão carregadas**

Adicione este código temporariamente no `src/config/firebase.js`:

```javascript
// Verificação temporária - remova após resolver
console.log('Firebase Config Status:', {
  isConfigured: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  hasApiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  hasProjectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  config: process.env.REACT_APP_ENV || 'Development',
});
```

### **2. Verificar no Console do Navegador**

- Abra o DevTools (F12)
- Vá na aba Console
- Procure por mensagens de erro do Firebase
- Verifique se as variáveis estão sendo carregadas corretamente

---

## 🚨 **Problemas Comuns e Soluções**

### **1. API Key inválida**

- **Causa**: API key incorreta ou expirada
- **Solução**: Gerar nova API key no Firebase Console

### **2. Domínio não autorizado**

- **Causa**: Domínio do Netlify não está na lista de domínios autorizados
- **Solução**: Adicionar `economiza-ai.netlify.app` no Firebase Console

### **3. Variáveis não carregadas**

- **Causa**: Variáveis de ambiente não configuradas no Netlify
- **Solução**: Configurar variáveis no dashboard do Netlify

### **4. Service Worker com MIME type incorreto**

- **Causa**: Arquivo `sw.js` não está sendo servido corretamente
- **Solução**: Verificar configuração do Netlify para arquivos estáticos

---

## 📋 **Checklist de Verificação**

- [ ] Credenciais do Firebase obtidas
- [ ] Variáveis de ambiente configuradas no Netlify
- [ ] Domínio autorizado no Firebase
- [ ] Google OAuth configurado (se necessário)
- [ ] Novo deploy realizado
- [ ] Teste de login funcionando
- [ ] Service Worker funcionando

---

## 🔗 **Links Úteis**

- [Firebase Console](https://console.firebase.google.com/)
- [Netlify Dashboard](https://app.netlify.com/)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/get-started/)

---

_⚠️ **Importante**: Nunca commite credenciais reais no Git. Use sempre variáveis de ambiente para credenciais sensíveis._
