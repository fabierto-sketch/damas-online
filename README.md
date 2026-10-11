# Damas Online
Jogo web para dois jogadores, com três variantes, salas privadas, chat e videochamada opcional.

## Executar
Requer Node.js 20+. Na pasta do projeto:
1. `npm install`
2. `npm start`
3. Abrir `http://localhost:3000`
4. Criar sala e enviar o link/código ao segundo jogador.

Testes: `npm test`.

## Alojamento
Carregue os ficheiros para um repositório GitHub (preferencialmente privado) e crie um Web Service Node.js num serviço que suporte WebSockets, como Render. Build command `npm install`; start command `npm start`. O servidor utiliza `process.env.PORT`. Os planos gratuitos podem adormecer após inatividade; verifique os limites atuais do fornecedor.

## Modalidades implementadas
- Portuguesas: captura máxima obrigatória; em empate, preferência por capturar mais damas.
- Brasileiras: captura máxima obrigatória; capturas empatadas permitidas.
- Simples: variante casual com damas de movimento curto e captura de peças simples apenas para a frente.

Estas são as regras desta implementação e não uma certificação oficial. Antes de competição, confirmar os regulamentos atualizados da federação competente. As regras são validadas no servidor.

## Limitações
Salas e partidas ficam na memória; reinício do servidor perde as partidas. Não há contas nem histórico persistente. Videochamada usa WebRTC e STUN; algumas redes exigem TURN. HTTPS é necessário para câmara/microfone fora de localhost. O servidor não grava áudio ou vídeo.
