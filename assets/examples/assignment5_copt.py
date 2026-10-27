"""Decision Making, Problem Set 5. Run: python assignment5_copt.py.

Dependency: python -m pip install coptpy
Writes solver_results.json next to this script.
"""
import json
from pathlib import Path
import coptpy as cp
from coptpy import COPT


def model(env, name):
    m = env.createModel(name)
    m.setParam(COPT.Param.Logging, 0)
    return m


def solve(m):
    m.solve()
    if m.status != COPT.OPTIMAL:
        raise RuntimeError(f"{m.name}: status {m.status}")


def problem1(env):
    names = list("ABCDEF")
    X = [[4, 15, 8], [15, 4, 2], [27, 5, 5],
         [15, 7, 6], [8, 13, 12], [13, 4, 3]]
    Y = [[60, 12], [39, 6], [24, 13],
         [16, 7], [51, 14], [44, 10]]
    results = {}
    for o, name in enumerate(names):
        # Input-oriented CCR envelopment model (constant returns).
        m = model(env, "DEA_" + name)
        theta = m.addVar(lb=0, name="theta")
        lam = [m.addVar(lb=0, name="lambda_" + j) for j in names]
        for i in range(3):
            m.addConstr(cp.quicksum(X[j][i]*lam[j] for j in range(6))
                        <= theta*X[o][i])
        for r in range(2):
            m.addConstr(cp.quicksum(Y[j][r]*lam[j] for j in range(6))
                        >= Y[o][r])
        m.setObjective(theta, COPT.MINIMIZE)
        solve(m)
        score = theta.x
        peers = [v.x for v in lam]
        # Solve the multiplier dual as a numerical cross-check.
        d = model(env, "DEA_dual_" + name)
        u = [d.addVar(lb=0, name=f"u{r+1}") for r in range(2)]
        v = [d.addVar(lb=0, name=f"v{i+1}") for i in range(3)]
        d.addConstr(cp.quicksum(v[i]*X[o][i] for i in range(3)) == 1)
        for j in range(6):
            d.addConstr(cp.quicksum(u[r]*Y[j][r] for r in range(2))
                        <= cp.quicksum(v[i]*X[j][i] for i in range(3)))
        d.setObjective(cp.quicksum(u[r]*Y[o][r] for r in range(2)),
                       COPT.MAXIMIZE)
        solve(d)
        assert abs(score-d.objval) < 1e-7
        results[name] = {
            "efficiency": score,
            "lambda": dict(zip(names, peers)),
            "output_weights": [w.x for w in u],
            "input_weights": [w.x for w in v],
            "input_slack": [score*X[o][i]-sum(
                peers[j]*X[j][i] for j in range(6)) for i in range(3)],
            "output_surplus": [sum(peers[j]*Y[j][r] for j in range(6))
                               - Y[o][r] for r in range(2)]}
    return results


def problem2(env):
    m = model(env, "Allen_investment")
    names = ["municipal_bonds", "CDs", "treasury_bills", "stock_fund"]
    x = [m.addVar(lb=0, name=n) for n in names]
    returns = [0.085, 0.05, 0.065, 0.13]
    m.addConstr(cp.quicksum(x) == 70000)
    m.addConstr(x[0] <= 14000)
    m.addConstr(x[1] <= x[0]+x[2]+x[3])
    m.addConstr(x[1]+x[2] >= 21000)
    m.addConstr(x[1]+x[2] >= 1.2*(x[0]+x[3]))
    m.setObjective(cp.quicksum(returns[i]*x[i] for i in range(4)),
                   COPT.MAXIMIZE)
    solve(m)
    return {"annual_return": m.objval,
            "allocation": dict(zip(names, [v.x for v in x]))}


def problem3(env):
    m = model(env, "Biofuel_blending")
    feeds, grades = list("ABC"), ["Premium", "Standard"]
    available, cost = [4000, 5000, 3500], [42, 36, 30]
    cetane, sulfur = [65, 52, 45], [0.08, 0.15, 0.25]
    price, min_qty = [72, 58], [3000, 4000]
    min_cetane, max_sulfur = [58, 50], [0.11, 0.18]
    # Sulfur values are in percentage points throughout.
    x = {(i, g): m.addVar(lb=0, name=f"{feeds[i]}_{grades[g]}")
         for i in range(3) for g in range(2)}
    for i in range(3):
        m.addConstr(cp.quicksum(x[i, g] for g in range(2))
                    <= available[i])
    for g in range(2):
        m.addConstr(cp.quicksum(x[i, g] for i in range(3))
                    >= min_qty[g])
        m.addConstr(cp.quicksum((cetane[i]-min_cetane[g])*x[i, g]
                               for i in range(3)) >= 0)
        m.addConstr(cp.quicksum((sulfur[i]-max_sulfur[g])*x[i, g]
                               for i in range(3)) <= 0)
    m.setObjective(cp.quicksum((price[g]-cost[i])*x[i, g]
                              for i in range(3) for g in range(2)),
                   COPT.MAXIMIZE)
    solve(m)
    blends = {}
    for g, grade in enumerate(grades):
        qty = sum(x[i, g].x for i in range(3))
        blends[grade] = {
            "allocation": {feeds[i]: x[i, g].x for i in range(3)},
            "quantity": qty,
            "cetane": sum(cetane[i]*x[i, g].x for i in range(3))/qty,
            "sulfur_percent": sum(sulfur[i]*x[i, g].x
                                  for i in range(3))/qty}
    return {"net_profit": m.objval, "blends": blends}


def problem4(env):
    m = model(env, "Transshipment")
    plants, hubs, customers = ["P1", "P2"], ["T1", "T2"], ["C1", "C2", "C3"]
    supply, capacity, demand = [800, 1000], [900, 850], [500, 650, 450]
    a_cost, b_cost = [[5, 7], [6, 4]], [[8, 10, 12], [11, 7, 9]]
    a = {(p, h): m.addVar(lb=0, name=f"{plants[p]}_{hubs[h]}")
         for p in range(2) for h in range(2)}
    b = {(h, c): m.addVar(lb=0, name=f"{hubs[h]}_{customers[c]}")
         for h in range(2) for c in range(3)}
    for p in range(2):
        m.addConstr(cp.quicksum(a[p, h] for h in range(2)) <= supply[p])
    for h in range(2):
        incoming = cp.quicksum(a[p, h] for p in range(2))
        m.addConstr(incoming <= capacity[h])
        m.addConstr(incoming == cp.quicksum(b[h, c] for c in range(3)))
    for c in range(3):
        m.addConstr(cp.quicksum(b[h, c] for h in range(2)) == demand[c])
    m.setObjective(cp.quicksum(a_cost[p][h]*a[p, h]
                              for p in range(2) for h in range(2))
                   + cp.quicksum(b_cost[h][c]*b[h, c]
                                 for h in range(2) for c in range(3)),
                   COPT.MINIMIZE)
    solve(m)
    return {"shipping_cost": m.objval,
            "plant_to_hub": {f"{plants[p]}->{hubs[h]}": a[p, h].x
                             for p in range(2) for h in range(2)},
            "hub_to_market": {f"{hubs[h]}->{customers[c]}": b[h, c].x
                              for h in range(2) for c in range(3)}}


def main():
    env = cp.Envr()
    results = {"problem1": problem1(env), "problem2": problem2(env),
               "problem3": problem3(env), "problem4": problem4(env)}
    text = json.dumps(results, indent=2)
    Path(__file__).with_name("solver_results.json").write_text(text+"\n")
    print(text)


if __name__ == "__main__":
    main()
