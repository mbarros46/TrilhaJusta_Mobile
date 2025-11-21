const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function main() {
  const tokenArg = process.argv[2];
  let token = tokenArg;
  if (!token) {
    // tentar ler COMMIT_HASH? Não — ler do AsyncStorage não é possível aqui.
    console.error('Erro: passe o token Expo como argumento ou use ambiente EXPO_PUSH_TOKEN');
    console.error('Uso: node scripts/send-push.js <EXPO_PUSH_TOKEN>');
    process.exit(1);
  }

  const message = {
    to: token,
    sound: 'default',
    title: 'Teste de Notificação',
    body: 'Esta é uma notificação de teste enviada pelo script local.',
    data: { test: true },
  };

  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  const json = await res.json();
  console.log('Resposta:', json);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
