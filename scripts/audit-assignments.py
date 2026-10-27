"""Independent SciPy/HiGHS checks for the published assignment practice.

Run from the repository with Python, NumPy and SciPy installed.
"""
import json
from pathlib import Path
from fractions import Fraction as F
import numpy as np
from scipy.optimize import linprog
R={}
def lp(name,c,A,b,expected,x=None,**kw):
 r=linprog(c,A_ub=A,b_ub=b,bounds=kw.pop('bounds',(0,None)),**kw)
 assert r.success,(name,r.message)
 assert abs(r.fun-expected)<1e-7,(name,r.fun,expected)
 if x is not None:assert np.max(abs(r.x-x))<1e-7,(name,r.x,x)
 R[name]={'objective_as_minimized':r.fun,'variables':r.x.tolist()}
 return r
lp('a2p1',[-5,-8],[[3,5],[2,4],[1,0],[0,1]],[50,40,8,10],-81.6,[8,5.2])
A=[[-2,-4],[1,-4],[4,-2],[1,-3]];b=[-22,-10,14,1]
r=linprog([-3,-2],A_ub=A,b_ub=b,bounds=(0,None));assert r.status==3
R['a2p2max']={'status':'unbounded'}
lp('a2p2min',[3,2],A,b,11,[0,5.5])
lp('a2claims',[64,42],[[-16,-12],[1,1],[.5,1.4]],[-450,40,25],1735.9756097560976,[20.121951219512194,10.670731707317074])
lp('a2p4max',[-800,-900],[[2,4],[4,2],[-1,-1]],[30,30,-9],-8500,[5,5])
lp('a2p4min',[800,900],[[2,4],[4,2],[-1,-1]],[30,30,-9],7500,[6,3])
lp('a3mill',[6000,7000],[[-6,-2],[-2,-2],[-4,-10]],[-12,-8,-5],24000,[4,0])
lp('a3farm',[-300,-520],[[1,1],[105,210],[0,1]],[410,52500,100],-142800,[320,90])
lp('a3apex',[-50,-40],[[2,1],[1,2]],[100,80],-2800,[40,20])
for c1 in [0,1000,6000,7000]:
 r=linprog([c1,7000],A_ub=[[-6,-2],[-2,-2],[-4,-10]],b_ub=[-12,-8,-5]);assert abs(r.fun-4*c1)<1e-7
for c1 in [260,300,520]:
 r=linprog([-c1,-520],A_ub=[[1,1],[105,210],[0,1]],b_ub=[410,52500,100]);assert abs(-r.fun-(320*c1+90*520))<1e-7
for c1 in [20,50,80]:
 r=linprog([-c1,-40],A_ub=[[2,1],[1,2]],b_ub=[100,80]);assert abs(-r.fun-(40*c1+20*40))<1e-7
lp('a4byprod',[-400,-800,-300,200],[[2,3,0,0],[3,4,0,0],[0,0,1,0]],[15,25,5],-5000,[3.75,2.5,5,0],A_eq=[[0,2,-1,-1]],b_eq=[0])
lp('a4portfolio',[-.15,-.08,-.06,-.20],[[1,0,0,0],[-1,1,-1,-1],[0,0,-1,0],[-1,0,0,-1]],[15000,0,-10000,-20000],-8600,[0,0,10000,40000],A_eq=[[1]*4],b_eq=[50000])
c=np.array([[7,8,5],[6,10,6],[10,4,5],[3,9,11]]).flatten()
Au=np.zeros((4,12));Ae=np.zeros((3,12))
for i in range(4):Au[i,i*3:(i+1)*3]=1
for j in range(3):Ae[j,j::3]=1
bounds=[(0,None)]*12;bounds[4]=(0,0);bounds[11]=(0,0)
lp('a4transport',c,Au,[5,25,20,25],195,A_eq=Ae,b_eq=[10,20,15],bounds=bounds)
c=-np.array([600,450,300]*3+[0]);Au=np.zeros((3,10));Ae=np.zeros((3,10))
for j in range(3):Au[j,j:9:3]=1
for i,land in enumerate([500,800,700]):Ae[i,i*3:(i+1)*3]=1;Ae[i,9]=-land
lp('a4farm',c,Au,[900,700,1000],-975000,A_eq=Ae,b_eq=[0,0,0],bounds=[(0,None)]*9+[(.6,1)])
c=np.array([120]*4+[180]*4+[15]*4);Ae=np.zeros((4,12))
for t in range(4):
 Ae[t,t]=1;Ae[t,4+t]=1;Ae[t,8+t]=-1
 if t>0:Ae[t,8+t-1]=1
lp('a4inventory',c,None,None,241350,[450,420,450,450,130,0,0,0,0,120,250,0],A_eq=Ae,b_eq=[580,300,320,700],bounds=[(0,450)]*4+[(0,200)]*4+[(0,None)]*3+[(0,0)])
# Exact concave-quadratic certificates for shuttle policies.
qW,qA=F(156,7),F(124,7);pW,pA=F(148,7),F(106,7)
assert qW+qA==40 and qW==54-F(3,2)*pW and qA==48-2*pA
assert pW*qW+pA*qA==F(5176,7)
assert 36-F(4,3)*qW==24-qA
qR,qS,qA=F(73,7),F(83,7),F(124,7)
pR,pS,pA=48-2*qR,30-qS,24-qA/2
assert qR+qS+qA==40 and pR*qR+pS*qS+pA*qA==F(5365,7)
assert 48-4*qR==30-2*qS==24-qA==F(44,7)
assert F(5365,7)-F(5176,7)==27
R['a1shuttle']={'a':432,'b':454,'c':504,'d':float(F(5176,7)),'e':761.5,'f':float(F(5365,7))}
output=Path('.build/assignment-model-audit.json')
output.parent.mkdir(parents=True,exist_ok=True)
output.write_text(json.dumps(R,indent=2)+'\n')
print('PASS: all Assignment2/3/4 LP optima, Assignment2 unboundedness, objective-range endpoint sweeps, and exact Assignment1 certificates.')
