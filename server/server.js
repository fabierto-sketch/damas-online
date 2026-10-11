
const express=require('express'),http=require('http'),crypto=require('crypto');
const {Server}=require('socket.io');const G=require('./game');
const app=express(),server=http.createServer(app),io=new Server(server),rooms=new Map(),PORT=process.env.PORT||3000;
app.use(express.static('public'));app.get('/health',(_,r)=>r.json({ok:true}));
const modes=['portuguesas','brasileiras','simples'],clean=s=>String(s||'Jogador').replace(/[<>]/g,'').trim().slice(0,24)||'Jogador';
function view(r){return{id:r.id,mode:r.mode,board:r.board,turn:r.turn,players:r.players.map(p=>p?{name:p.name,connected:p.connected}:null),started:r.players.filter(Boolean).length===2,over:r.over,winner:r.winner,reason:r.reason}}
function send(r){io.to(r.id).emit('state',view(r))}
io.on('connection',s=>{
s.on('create-room',(d={},cb=()=>{})=>{let id;do{id=crypto.randomBytes(4).toString('hex').toUpperCase()}while(rooms.has(id));const r={id,mode:modes.includes(d.mode)?d.mode:'portuguesas',board:G.initialBoard(),turn:'w',players:[{id:s.id,name:clean(d.name),connected:true,side:'w'},null],over:false,winner:null};rooms.set(id,r);s.join(id);s.data.room=id;s.data.side='w';cb({ok:true,id,side:'w'});send(r)});
s.on('join-room',(d={},cb=()=>{})=>{const id=String(d.id||'').toUpperCase().replace(/[^A-Z0-9]/g,''),r=rooms.get(id);if(!r)return cb({ok:false,error:'Sala não encontrada.'});if(r.players.some(p=>p&&p.id===s.id))return cb({ok:true,id,side:s.data.side});let i=r.players.findIndex(p=>!p||!p.connected);if(i<0)return cb({ok:false,error:'A sala já tem dois jogadores.'});const side=i===0?'w':'b';r.players[i]={id:s.id,name:clean(d.name),connected:true,side};s.join(id);s.data.room=id;s.data.side=side;cb({ok:true,id,side});send(r)});
s.on('move',(d={},cb=()=>{})=>{const r=rooms.get(s.data.room),p=r?.players.find(x=>x&&x.id===s.id);if(!r||!p||r.over||p.side!==r.turn)return cb({ok:false,error:'Não podes jogar agora.'});if(!Array.isArray(d.from)||!Array.isArray(d.to))return cb({ok:false,error:'Jogada inválida.'});const m=G.findMove(r.board,p.side,r.mode,d.from,d.to);if(!m)return cb({ok:false,error:'Jogada não permitida pelas regras desta modalidade.'});r.board=G.apply(r.board,m);r.turn=p.side==='w'?'b':'w';const st=G.status(r.board,r.turn,r.mode);r.over=st.over;r.winner=st.winner;r.reason=st.reason;cb({ok:true});send(r)});
s.on('chat',d=>{const r=rooms.get(s.data.room),p=r?.players.find(x=>x&&x.id===s.id),text=String(d?.text||'').trim().slice(0,400);if(p&&text)io.to(r.id).emit('chat',{name:p.name,text,time:new Date().toISOString()})});
s.on('restart',(_,cb=()=>{})=>{const r=rooms.get(s.data.room);if(!r)return cb({ok:false});r.board=G.initialBoard();r.turn='w';r.over=false;r.winner=null;r.reason=null;send(r);cb({ok:true})});
s.on('rtc-signal',d=>{const r=rooms.get(s.data.room);if(r)s.to(r.id).emit('rtc-signal',d)});
s.on('disconnect',()=>{const r=rooms.get(s.data.room);if(!r)return;const p=r.players.find(x=>x&&x.id===s.id);if(p)p.connected=false;send(r);setTimeout(()=>{if(rooms.has(r.id)&&r.players.every(x=>!x||!x.connected))rooms.delete(r.id)},1800000).unref()})
});
server.listen(PORT,'0.0.0.0',()=>console.log('DAMAS ONLINE na porta '+PORT));
