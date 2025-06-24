# 🔥 Configuração do Firebase para Netlify

## ⚠️ Problema: Página em Branco

Se você está vendo uma página em branco no Netlify, é porque as variáveis de ambiente do Firebase não estão configuradas.

## 🛠️ Solução: Configurar Firebase

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Adicionar projeto"
3. Digite o nome: `economiza-ai`
4. Siga os passos de configuração

### 2. Configurar Web App

1. No Firebase Console, clique em "Web" (</>)
2. Registre o app com nome: `Economiza AI`
3. **Copie as configurações** que aparecem

### 3. Configurar Variáveis no Netlify

1. Acesse seu projeto no [Netlify Dashboard](https://app.netlify.com)
2. Vá em **Site settings** → **Environment variables**
3. Adicione as seguintes variáveis:

```
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
REACT_APP_FIREBASE_APP_ID=seu_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 4. Configurar Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste"
4. Selecione a localização mais próxima

### 5. Configurar Autenticação

1. No Firebase Console, vá em **Authentication**
2. Clique em "Começar"
3. Habilite o provedor **Google**
4. Configure o domínio do Netlify como autorizado

### 6. Regras do Firestore

Adicione estas regras no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Regras específicas para stores
    match /stores/{storeId} {
      allow read: if true; // Qualquer um pode ler
      allow write: if request.auth != null; // Só usuários logados podem escrever
    }

    // Regras para listas de compras
    match /shoppingLists/{listId} {
      allow read, write: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🔄 Rebuild no Netlify

1. Após configurar as variáveis, vá em **Deploys**
2. Clique em **Trigger deploy** → **Deploy site**
3. Aguarde o build completar

## ✅ Verificação

Após o deploy, você deve ver:

- ✅ Página carrega normalmente
- ✅ Login com Google funciona
- ✅ Lista de compras salva no Firebase
- ✅ Histórico funciona

## 🐛 Debug

Se ainda houver problemas:

1. **Verifique o console do navegador** (F12)
2. **Verifique os logs do Netlify** em Deploys
3. **Confirme as variáveis** estão corretas
4. **Teste localmente** com `npm start`

## 📞 Suporte

Se precisar de ajuda:

- Verifique os logs do Netlify
- Confirme as configurações do Firebase
- Teste em modo local primeiro
