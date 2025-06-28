#!/usr/bin/env node

/**
 * Script para configurar Firebase
 * Uso: node setup-firebase.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔥 Configuração do Firebase - Economiza AI');
console.log('==========================================\n');

// Verificar se o arquivo .env.local existe
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Criando arquivo .env.local...');

  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ Arquivo .env.local criado a partir do env.example');
  } else {
    console.log('❌ Arquivo env.example não encontrado');
    process.exit(1);
  }
} else {
  console.log('✅ Arquivo .env.local já existe');
}

console.log('\n📋 Próximos passos:');
console.log('1. Edite o arquivo .env.local com suas credenciais do Firebase');
console.log(
  '2. Obtenha as credenciais em: https://console.firebase.google.com/'
);
console.log('3. Configure as variáveis no Netlify Dashboard');
console.log(
  '4. Adicione o domínio economiza-ai.netlify.app no Firebase Console'
);

console.log('\n🔗 Links úteis:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Netlify Dashboard: https://app.netlify.com/');
console.log('- Documentação: SOLUCAO_FIREBASE.md');

console.log('\n📝 Variáveis necessárias:');
console.log('REACT_APP_FIREBASE_API_KEY=sua_api_key');
console.log('REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com');
console.log('REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id');
console.log('REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com');
console.log('REACT_APP_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id');
console.log('REACT_APP_FIREBASE_APP_ID=seu_app_id');
console.log('REACT_APP_FIREBASE_MEASUREMENT_ID=seu_measurement_id');
console.log('REACT_APP_GOOGLE_CLIENT_ID=seu_google_client_id');

console.log('\n⚠️  IMPORTANTE:');
console.log('- Nunca commite o arquivo .env.local no Git');
console.log('- Use sempre variáveis de ambiente para credenciais');
console.log('- Configure as variáveis no Netlify para produção');

console.log('\n🎯 Para mais detalhes, consulte: SOLUCAO_FIREBASE.md');
