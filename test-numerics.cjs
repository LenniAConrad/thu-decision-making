const assert=require('node:assert/strict'),m=require('./decision-math.js');
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
near(m.breakEven(10000,8,23),2000/3);assert.equal(m.breakEven(10000,23,23),null);
for(const [p,q,r] of [[60,30,1800],[24,130,3120],[25,125,3125],[45,45,2025],[90,0,0]]){near(m.airline(p).sales,q);near(m.airline(p).revenue,r);}
let best={p:0,r:0};for(let i=0;i<=9000;i++){let p=i/100,r=m.airline(p).revenue;if(r>best.r)best={p,r};}near(best.p,25);near(best.r,3125);
for(const [labor,x,y,z] of [[0,0,0,0],[20,20,0,800],[30,30,0,1200],[40,24,8,1360],[60,12,24,1680],[80,0,40,2000],[100,0,40,2000]]){const v=m.pottery(labor);near(v.x,x);near(v.y,y);near(v.value,z);}
for(let l=1;l<101;l++){const r=m.pottery(l);assert.ok(r.x+2*r.y<=l+1e-9);assert.ok(4*r.x+3*r.y<=120+1e-9);near(r.value,l<=30?40*l:l<=80?720+16*l:2000);}
assert.equal(m.pottery(40,120,25,50).best.length,2);near(m.pottery(40,120,70,20).value,2100);near(m.pottery(40,80).value,1120);
near(1800+32*28+22*72,4280);near(45*45+20*80,3625);
// Independent two-equation solution and inactive constraint for aircraft example.
const x=(105*4.9-7.5*90)/(4*4.9-7.5*6.2),y=(4*90-105*6.2)/(4*4.9-7.5*6.2);near(x,1605/269);near(y,2910/269);assert.ok(9.1*x+4.1*y<110);near(650*x+910*y,3691350/269);
// Verify temporal feasibility and all costs of the published production schedule.
const demand=[105,170,230,180,150,250],overtime=[0,0,25,20,30,50];let inv=0,holding=0;for(let t=0;t<6;t++){inv+=160+overtime[t]-demand[t];assert.ok(inv>=0);if(t<5)holding+=10*inv;}near(inv,0);near(6*160*190+125*260+holding,216300);
// Blend proportions and scarce component totals.
const blends=[[1500,900,600],[1200,1500,300],[1800,300,900]];const totals=[0,0,0];for(const row of blends){near(row.reduce((a,b)=>a+b),3000);row.forEach((v,i)=>totals[i]+=v);}assert.deepEqual(totals,[4500,2700,1800]);near(3000*(23+20+18)-(4500*12+2700*10+1800*14),76800);
console.log('PASS: pricing, break-even, LP vertices and sensitivity, aircraft solution, production balances and blend data.');
