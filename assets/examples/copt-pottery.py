"""Pottery LP from the COPT course tutorial. Requires coptpy."""
import coptpy as cp
from coptpy import COPT

env = cp.Envr()
model = env.createModel("pottery")
x1 = model.addVar(lb=0, name="x1")
x2 = model.addVar(lb=0, name="x2")
model.addConstr(x1 + 2*x2 <= 40, name="labor")
model.addConstr(4*x1 + 3*x2 <= 120, name="clay")
model.setObjective(40*x1 + 50*x2, sense=COPT.MAXIMIZE)
model.setParam(COPT.Param.TimeLimit, 10.0)
model.solve()
if model.status != COPT.OPTIMAL:
    raise RuntimeError(f"No optimal solution: status {model.status}")
print(f"Objective: {model.objval:g}")
for var in model.getVars():
    print(f"{var.name}: value={var.x:g}, reduced_cost={var.RC:g}")
for con in model.getConstrs():
    print(f"{con.name}: dual={con.pi:g}")
