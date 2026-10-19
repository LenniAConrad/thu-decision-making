# THU Introduction to Decision Making

A student-built study companion for **Introduction to Decision Making (70160513-1)** at Tsinghua University, based on the lecture materials by **Prof. Hai Jiang**, Department of Industrial Engineering.

**[Open the study website](https://lenniaconrad.github.io/thu-decision-making/)** · [Read the lectures](https://lenniaconrad.github.io/thu-decision-making/lectures.html)

The reader follows the white, purple and teal design of the Intro to AI and EEE companions. It contains 36 topics in five reading sections: foundations and airline pricing; LP formulation and geometry; sensitivity analysis; computer solution; and modeling examples. The five source decks cover four numbered chapters; the repeated Chapter 2 material is consolidated.

- Reflowed explanations, equations, worked examples and native HTML/SVG graphs. No embedded slides or copied teaching images.
- Experiments for break-even, airline fares, feasible production, objective coefficients and labor availability.
- Search, direct links, whole-lecture reading and printing, keyboard navigation, and controls retained within the current browser tab.
- Session-only reading state. No account, analytics, completion dashboard or permanent progress record.
- Lecturer portrait and official profile links, with image provenance in `assets/ATTRIBUTIONS.json`.

## Source basis and corrections

The Learn sync was checked on 19 October 2026 and completed with zero errors and no changed files. This version uses `chapter01.pdf`, `chapter02-part 1.pdf`, `chapter02 - part 2.pdf`, `chapter03-2.pdf` and `chapter04-2.pdf`: **188 pages** in total. Original course files remain outside this repository. Personal submissions, student identifiers, course contacts and another student's defense presentation are not included.

`content/source-coverage.json` maps every source page to a topic or explicitly identifies title/administrative context. Source hashes identify the versions used. This inventory is an audit trail, not a guarantee that all spoken lectures, future materials or exam questions are represented. The reader’s “Lecture references” disclosures identify source pages.

Notable clarifications are stated where they matter:

- Total cost adds fixed and variable cost; Chapter 1 contains a sign typo.
- The intended pottery clay row is `4x1 + 3x2 <= 120`. Several slides and the COPT screenshot instead contain `4x2 + 3x2`; the screenshot's 1,600 result is for that mistyped model.
- At the feasible pottery point (5,10), clay usage is 50, not the printed 70.
- The second factory's labor RHS has an ambiguous handwritten correction. The reader derives a parameterized result rather than claiming a single interpretation.
- A technology coefficient of 1.33 is distinguished from the rounded value of 4/3.
- Blank Chapter 4 formulation pages are completed with derived models; boundary assumptions and the DEA convention are explicit.
- The final uncertain-investment slide gives incomplete probabilities for project B. The reader does not invent the missing outcome.

Explanatory derivations and worked results are author additions based on the stated model data. This is an independent study aid, not an official university publication.

## Develop and verify

Requires Node.js 18 or later (CI uses Node 22).

```sh
npm ci
npm test
npm run build
python3 -m http.server 8000 --directory .build/site
```

Edit `content/lectures.json`, then regenerate its browser bundle:

```sh
node scripts/build-lecture-content.cjs
```

`npm test` checks every route, rendered math, search, keyboard-addressable controls, home experiment, state restoration, print preparation/restoration, local links, numerical models and page mapping. Independent SciPy/HiGHS checks were also used for the aircraft and production-scheduling worked results. Native SVG diagrams were rendered with Inkscape for visual inspection.

The DOM tests do not replace a browser rendering engine. Browser layout and actual print-dialog rendering were not visually tested in this environment because no browser surface was available.

Only an explicit allowlist of runtime files is copied into `.build/site`. GitHub Actions runs the checks and publishes successful `main` builds to GitHub Pages. Source PDFs, local review images and test dependencies are not deployed.

## Credits

Course material: Prof. Hai Jiang, Tsinghua University. [Official profile](https://www.ie.tsinghua.edu.cn/eng/info/1051/1023.htm). Mathematical typesetting: [KaTeX](https://katex.org/), distributed with its license. Lecturer portrait rights remain with the original owner. No blanket license is asserted over third-party course material.
