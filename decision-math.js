/* Numerical models used by the plots and experiments. */
const DecisionMath=(()=>{
 const demand=p=>Math.max(0,90-p)+Math.max(0,160-4*p);
 const airline=p=>{const q=demand(p),sales=Math.min(130,q);return {demand:q,sales,revenue:p*sales};};
 function pottery(labor=40,clay=120,c1=40,c2=50){
  const candidates=[[0,0],[0,Math.min(labor/2,clay/3)],[Math.min(labor,clay/4),0]];
  const x=(2*clay-3*labor)/5,y=(4*labor-clay)/5;if(x>=0&&y>=0)candidates.push([x,y]);
  const vertices=candidates.filter((p,i)=>!candidates.slice(0,i).some(q=>Math.abs(p[0]-q[0])<1e-9&&Math.abs(p[1]-q[1])<1e-9));
  const values=vertices.map(([x,y])=>c1*x+c2*y),value=Math.max(...values),best=vertices.filter((_,i)=>Math.abs(values[i]-value)<1e-8);
  return {vertices,best,x:best[0][0],y:best[0][1],value};
 }
 const breakEven=(fixed,cost,price)=>price>cost?fixed/(price-cost):null;
 return {demand,airline,pottery,breakEven};
})();
if(typeof module!=='undefined')module.exports=DecisionMath;
