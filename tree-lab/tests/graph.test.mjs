import assert from 'node:assert/strict';
import {properties,inspect,problem} from '../dist/graph.mjs';
assert.deepEqual(properties(4,[[0,1],[1,2],[2,3]]).values,[true,true,true,true,true,true]);
assert.deepEqual(properties(4,[[0,1],[1,2],[0,2]]).values,[false,false,true,false,true,true]);
assert.deepEqual(properties(4,[]).values,[false,true,false,false,true,false]);
assert.equal(properties(4,[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).values[5],null);
// Independent DFS oracle: count simple paths, capped at two.
function paths(n,edges,a,b,seen=new Set([a])){if(a===b)return 1;let count=0;for(const [u,v] of edges){const w=u===a?v:v===a?u:-1;if(w<0||seen.has(w))continue;count+=paths(n,edges,w,b,new Set([...seen,w]));if(count>1)return 2;}return count;}
let checked=0;
for(let n=4;n<=5;n++){const pairs=[];for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)pairs.push([a,b]);for(let mask=0;mask<2**pairs.length;mask++){const e=pairs.filter((_,i)=>mask&(1<<i));const p=properties(n,e);const connected=es=>pairs.every(([a,b])=>paths(n,es,a,b)>0);const cycle=es=>es.some(([a,b],i)=>paths(n,es.filter((_,j)=>j!==i),a,b)>0);const missing=pairs.filter((_,i)=>!(mask&(1<<i)));assert.deepEqual(p.values,[connected(e),!cycle(e),e.length===n-1,pairs.every(([a,b])=>paths(n,e,a,b)===1),e.every((_,i)=>!connected(e.filter((_,j)=>i!==j))),missing.length?missing.every(x=>cycle([...e,x])):null]);checked++;}}
for(let n=4;n<=10;n++)for(let t=0;t<4;t++)for(let k=0;k<30;k++){const e=problem(n,t),p=inspect(n,e);assert.equal(new Set(e.map(String)).size,e.length);assert(e.every(([a,b])=>a<b&&a>=0&&b<n));assert(!properties(n,e).tree);if(t===0)assert(p.connected&&p.cyclic);if(t===1)assert(!p.connected&&!p.cyclic);if(t===2)assert(!p.connected&&p.cyclic);if(t===3)assert(!p.connected&&p.cyclic&&e.length===n-1);}
console.log(`PASS: ${checked} graphs exhaustively checked; 840 generated problems checked.`);
