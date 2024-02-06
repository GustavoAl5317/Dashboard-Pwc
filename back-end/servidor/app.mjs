import express from 'express';
import https from 'https';
import WebSocket from 'ws';
import queryInformix from './queryDatabase/queryInformix.mjs';
import cors from 'cors';
import fs from 'fs';

const port = 443;
const app = express();

let informixData = [];

// Middleware para permitir solicitações CORS
app.use(cors());

// Configuração para leitura de certificado e chave privada
const options = {
  key: fs.readFileSync('./.cert/key.pem'),
  cert: fs.readFileSync('./.cert/cert.pem')
};

// Servidor HTTPS a partir da aplicação Express
const server = https.createServer(options, app);

// Crie o servidor WebSocket associado ao servidor HTTPS
const wss = new WebSocket.Server({ server });

// Adicione uma função para realizar a consulta ao Informix e atualizar os dados
async function updateInformixData() {
  try {
    const result = await queryInformix();
    informixData = result;

    // Enviar atualizações para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(informixData), (error) => {
          if (error) {
            console.error('Erro ao enviar dados para o cliente:', error);
          }
        });
      }
    });
  } catch (error) {
    console.error('Erro na consulta ao Informix:', error);
  }
}

// Inicie a função de consulta ao Informix e atualização dos dados
setInterval(updateInformixData, 5000);

// Lidando com desconexões de clientes WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado.');

  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado.');
  });
});

// Rota para retornar os dados armazenados em informixData


// Inicie o servidor HTTPS na porta especificada
server.listen(port, () => {
  console.log(`Servidor HTTPS rodando na porta ${port}`);
});
