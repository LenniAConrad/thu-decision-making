"""Independent source-data audit. Run with Python, NumPy and SciPy installed.

Models are transcribed from lecture inputs, separately from the browser models.
This is an optional numerical audit; npm test remains dependency-light.
"""
import numpy as np
from scipy.optimize import linprog
checks=[]
def solve(name,c,A,b,E=None,e=None,bounds=None,expected=None):
 r=linprog(c,A_ub=A,b_ub=b,A_eq=E,b_eq=e,bounds=bounds,method='highs')
 assert r.success,(name,r.message)
 if expected is not None:assert abs(r.fun-expected)<1e-6,(name,r.fun,expected)
 assert np.max(np.abs(np.array(E)@r.x-e))<1e-7 if E is not None else True
 checks.append(name);print(name,'objective',round(r.fun,8),'variables',np.round(r.x,6).tolist())
 return r
solve('pottery',[-40,-50],[[1,2],[4,3]],[40,120],expected=-1360)
solve('fertilizer',[6,3],[[-2,-4],[-4,-3]],[-16,-24],expected=24)
solve('hot dogs',[3,5],[[-1,0],[0,-1],[-1,2]],[-500,-200,0],[[1,1]],[1000],expected=3400)
solve('furniture',[-300,-500],[[1,0],[0,2],[3,2]],[4,12,18],expected=-3600)
solve('graphical exercise',[-4,-5],[[1,2],[6,6],[1,0]],[10,36,4],expected=-28)
solve('new cups',[-40,-50,-30],[[1,2,1.2],[4,3,2]],[40,120],expected=-1360)
solve('aircraft',[-650,-910],[[4,7.5],[6.2,4.9],[9.1,4.1]],[105,90,110],expected=-3691350/269)
solve('shirts',[-90,-125,-45,-65],[[.1,.25,.08,.21],[3,3,1,1],[36,48,25,35],[1,1,0,0],[0,0,1,1]],[72,1200,25000,500,500])
solve('investment allocation',[-.085,-.05,-.065,-.13],[[1,0,0,0],[-1,1,-1,-1],[0,-1,-1,0],[1.2,-1,-1,1.2]],[14000,0,-21000,0],[[1,1,1,1]],[70000])
solve('advertising',[-20000,-12000,-9000],[[15000,6000,4000],[1,0,0],[0,1,0],[0,0,1],[1,1,1]],[100000,4,10,7,15])
# 3 warehouses x 3 destinations. Supply upper bounds, exact demand.
A=np.zeros((3,9));E=np.zeros((3,9))
for i in range(3):A[i,3*i:3*i+3]=1;E[i,i::3]=1
solve('transport',[16,18,11,14,12,13,13,15,17],A,[300,200,200],E,[150,250,200])
# Rows: grades, columns: component. The constraints include all six proportions.
A=[];b=[]
for i,s in enumerate([4500,2700,3500]):
 row=np.zeros(9);row[i::3]=1;A.append(row);b.append(s)
for j in range(3):
 row=np.zeros(9);row[j*3:j*3+3]=-1;A.append(row);b.append(-3000)
for j,i,share,sign in [(0,0,.5,-1),(0,1,.3,1),(1,0,.4,-1),(1,2,.25,1),(2,0,.6,-1),(2,1,.1,-1)]:
 row=np.zeros(9);row[j*3:j*3+3]=-sign*share;row[j*3+i]+=sign;A.append(row);b.append(0)
solve('blend',[12-23,10-23,14-23,12-20,10-20,14-20,12-18,10-18,14-18],A,b,expected=-76800)
# All dietary coefficients transcribed from the displayed table.
data=np.array([[90,0,0,6,20,3,5,.18],[110,2,0,4,48,4,2,.22],[100,2,0,2,12,5,3,.10],[90,2,0,3,8,6,4,.12],[75,5,270,1,30,7,0,.10],[35,3,8,0,0,2,0,.09],[65,0,0,1,52,1,1,.40],[100,4,12,0,250,9,0,.16],[120,0,0,0,3,1,0,.50],[65,1,0,1,26,3,3,.07]])
signs=np.array([-1,1,1,-1,-1,-1,-1]);solve('diet',data[:,7],signs[:,None]*data[:,:7].T,signs*np.array([420,20,30,5,400,20,12]))
# hM,fM,cM,hB,fB,cB: recipes and total cans.
solve('pet food',[-.8]*3+[-.96]*3,[[1,0,0,1,0,0],[0,1,0,0,1,0],[0,0,1,0,0,1],[1]*6,[.5,-.5,.5,0,0,0],[0,0,0,-.5,.5,.5]],[600,800,1000,2250,0,0],expected=-1992)
# Two-stage projects A1..4, yearly D1..5, B, C.
E=np.zeros((5,11));E[0,[0,4]]=1;E[1,[1,5,10]]=1;E[1,4]=-1.06;E[2,[2,6,9]]=1;E[2,0]=-1.15;E[2,5]=-1.06;E[3,[3,7]]=1;E[3,1]=-1.15;E[3,6]=-1.06;E[4,8]=1;E[4,2]=-1.15;E[4,10]=-1.4;E[4,7]=-1.06
c=np.zeros(11);c[[3,8,9]]=[-1.15,-1.06,-1.25];solve('cash flow',c,None,None,E,[100,0,0,0,0],bounds=[(0,None)]*9+[(0,40),(0,30)])
# Inventory balance and overtime limits, independently solved over six weeks.
c=np.array([190.]*6+[260.]*6+[10.]*5+[0.]);E=np.zeros((6,18))
for t in range(6):
 E[t,t]=E[t,6+t]=1;E[t,12+t]=-1
 if t:E[t,11+t]=1
solve('production schedule',c,None,None,E,[105,170,230,180,150,250],bounds=[(0,160)]*6+[(0,50)]*6+[(0,None)]*5+[(0,0)],expected=216300)
# DEA weights [three outputs, three inputs], normalized separately for each school.
inputs=np.array([[.06,260,11.3],[.05,320,10.5],[.08,340,12],[.06,460,13.1]])
outputs=np.array([[86,75,71],[82,72,67],[81,79,80],[81,73,69]])
for i,name in enumerate(['Alton','Beeks','Carey','Delancey']):
 r=solve('DEA '+name,np.r_[-outputs[i],np.zeros(3)],np.c_[outputs,-inputs],np.zeros(4),[np.r_[np.zeros(3),inputs[i]]],[1])
 assert -r.fun<=1+1e-7
 if name=='Delancey':assert -r.fun<1-1e-4
# Both parameter ranges: compare the article’s piecewise values to a fresh LP.
for L in [0,1,20,29,30,31,40,60,79,80,81,100]:
 r=linprog([-40,-50],A_ub=[[1,2],[4,3]],b_ub=[L,120],method='highs')
 expected=40*L if L<=30 else 720+16*L if L<=80 else 2000
 assert r.success and abs(-r.fun-expected)<1e-7
for C in [0,1,30,59,60,61,80,120,159,160,161,200]:
 r=linprog([-40,-50],A_ub=[[1,2],[4,3]],b_ub=[40,C],method='highs')
 expected=50*C/3 if C<=60 else 640+6*C if C<=160 else 1600
 assert r.success and abs(-r.fun-expected)<1e-7
for N in [0,16,31,32,33,60]:
 for P in [0,11,12,24,60]:
  r=linprog([6,3],A_ub=[[-2,-4],[-4,-3]],b_ub=[-N,-P],method='highs')
  assert r.success and abs(r.fun-max(.75*N,P))<1e-7
print('Independent LP audit passed:',len(checks),'models plus resource/requirement boundary sweeps')
