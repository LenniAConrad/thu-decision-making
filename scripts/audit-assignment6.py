"""Independent HiGHS checks of the Assignment 6 parametric optima and duals."""
import numpy as np
from scipy.optimize import linprog

def concrete(b):
    if b<2:return (15,b),150+35*b,35
    if b<4:return (17-b,b),170+25*b,25
    if b<6:return (21-2*b,b),210+15*b,15
    if b<8:return (27-3*b,b),270+5*b,5
    return (3,8),310,0

def agency(b):
    if b<4:return (0,b),13*b,13
    if b<10:return ((4*b-16)/3,(16-b)/3),5*b+32,5
    if b<12:return ((3*b-14)/2,(14-b)/2),4*b+42,4
    if b<13:return (2*b-13,13-b),b+78,1
    return (13,0),91,0

cases=[('concrete',[10,35],[[1,0],[1,1],[1,2],[1,3],[1,4],[0,1]],[15,17,21,27,35],concrete,[2,4,6,8]),('agency',[7,13],[[1,4],[1,3],[1,2],[1,1]],[16,14,13],agency,[4,10,12,13])]
for name,c,A,rhs,expected,breaks in cases:
    tested=0
    # Broad sweep plus both sides of each kink; never require a unique dual at a kink.
    values=list(np.linspace(0,40,321))+[k+d for k in breaks for d in [-1e-4,1e-4]]
    for b in values:
        res=linprog(-np.array(c),A_ub=A,b_ub=rhs+[b],bounds=(0,None),method='highs')
        assert res.success,(name,b,res.message)
        point,value,slope=expected(b)
        assert np.allclose(res.x,point,atol=1e-7),(name,b,res.x,point)
        assert abs(-res.fun-value)<1e-7,(name,b,res.fun,value)
        if b>0 and all(abs(b-k)>1e-8 for k in breaks):
            assert abs(-res.ineqlin.marginals[-1]-slope)<1e-7,(name,b,res.ineqlin.marginals)
        tested+=1
    print(f'PASS {name}: {tested} RHS values, optimal quantities/objectives and interior shadow prices.')
