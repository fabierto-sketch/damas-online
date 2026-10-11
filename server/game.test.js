const test=require('node:test'),assert=require('node:assert/strict'),G=require('./game');
test('tabuleiro inicial tem 12 peças por lado',()=>{const b=G.initialBoard();assert.equal(b.flat().filter(x=>x==='w').length,12);assert.equal(b.flat().filter(x=>x==='b').length,12)});
test('existe pelo menos uma jogada inicial',()=>assert.ok(G.legal(G.initialBoard(),'w','portuguesas').length>0));
test('jogada válida move peça',()=>{const b=G.initialBoard(),m=G.findMove(b,'w','portuguesas',[5,0],[4,1]);assert.ok(m);assert.equal(G.apply(b,m)[4][1],'w')});
