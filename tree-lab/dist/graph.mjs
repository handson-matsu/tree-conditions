export function inspect(n, edges) {
  const adj = Array.from({length:n},()=>[]);
  for(const [a,b] of edges){adj[a].push(b);adj[b].push(a);}
  const seen=new Set(); let components=0;
  function visit(v){seen.add(v);for(const w of adj[v])if(!seen.has(w))visit(w);}
  for(let v=0;v<n;v++)if(!seen.has(v)){components++;visit(v);}
  return {connected:components===1, cyclic:edges.length>n-components,components};
}
export function properties(n,edges){
  const base=inspect(n,edges);
  const missing=[];
  for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)if(!edges.some(([u,v])=>u===a&&v===b))missing.push([a,b]);
  const tree=base.connected&&!base.cyclic;
  return {tree,values:[base.connected,!base.cyclic,edges.length===n-1,tree,
    edges.every((_,i)=>!inspect(n,edges.filter((_,j)=>i!==j)).connected),
    missing.length?missing.every(e=>inspect(n,[...edges,e]).cyclic):null]};
}
export function problem(n,type,rng=Math.random){
  const labels=Array.from({length:n},(_,i)=>i);
  for(let i=n-1;i>0;i--){const j=Math.floor(rng()*(i+1));[labels[i],labels[j]]=[labels[j],labels[i]];}
  let e=[];
  if(type===0){for(let i=1;i<n;i++)e.push([i,Math.floor(rng()*i)]);for(let a=0;a<n&&e.length<n+1;a++)for(let b=a+1;b<n&&e.length<n+1;b++)if(!e.some(([u,v])=>Math.min(u,v)===a&&Math.max(u,v)===b))e.push([a,b]);}
  if(type===1){for(let i=1;i<n-1;i++)e.push([i,Math.floor(rng()*i)]);}
  if(type===2){e=[[0,1],[1,2],[0,2]];for(let i=4;i<n-1;i++)e.push([i-1,i]);}
  if(type===3){e=[[0,1],[1,2],[0,2]];for(let i=3;i<n-1;i++)e.push([i,Math.floor(rng()*i)]);}
  return e.map(([a,b])=>[labels[a],labels[b]].sort((a,b)=>a-b));
}
