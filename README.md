# THU Introduction to Decision Making

A student-built study companion for **Introduction to Decision Making (70160513-1)** at Tsinghua University, based on the lecture materials by **Associate Professor Hai Jiang**, Department of Industrial Engineering.

**[Open the study website](https://lenniaconrad.github.io/thu-decision-making/)** · [Read the lectures](https://lenniaconrad.github.io/thu-decision-making/lectures.html) · [Practice with hints](https://lenniaconrad.github.io/thu-decision-making/practice.html)

The reader follows the white, purple and teal design of the Intro to AI and EEE companions. It contains 55 topics in six reading sections: foundations and airline pricing; LP formulation and geometry; sensitivity analysis; computer solution; modeling examples; and assignment practice. The course materials index links all four chapters, the COPT practical tutorial, all five problem sets, and the available official answer keys. Repeated Chapter 2 material is consolidated.

- Reflowed explanations, equations, worked examples and native HTML/SVG graphs. No embedded slides or copied teaching images.
- Experiments for break-even, airline fares, feasible production, objective coefficients and labor availability.
- Search (including Homework/Assignment aliases), direct links, whole-section reading and printing, keyboard navigation, and controls retained within the current browser tab.
- Accessible source-data tables, selectable LP/command/Python examples, downloadable COPT scripts, and native feasible-region graphs for the graphical assignments.
- Practice for every lecture section: 24 exercises covering all five homework sets plus solver examples, three progressive hints each, a private working area, hidden comparison solutions, checklists and graphical comparisons where relevant.
- Session-only reading and practice state. No account, analytics, completion dashboard or permanent progress record. Working notes stay in the current browser tab; nothing is submitted.
- Lecturer portrait and official profile links, with image provenance in `assets/ATTRIBUTIONS.json`.

## Source basis and corrections

The synchronized course folder was inventoried on 27 October 2026. The current teaching sources contain **195 lecture PDF pages**, **12 COPT tutorial slides**, and **28 assignment/answer-key pages** (235 pages/slides in total). The updated Chapter 3 file is `chapter03-2--5beb6393ab.pdf`; the earlier 22-page deck remains in the audit inventory as superseded. All 14 inventoried file hashes match the local synchronized sources. Original course PDFs and the PPTX remain outside this repository. Personal submissions, student identifiers, course contacts and another student's defense presentation are not included.

`content/source-coverage.json` maps every source page to a topic or explicitly identifies title/administrative context. Source hashes identify the versions used. `content/lecture-audit.json` records the 27 October visible-page audit and its corrections. Topic and section labels separate visible lecture statements from worked derivations and added modeling assumptions. This inventory is an audit trail, not a guarantee that all spoken lectures, future materials or exam questions are represented. The reader’s “Lecture references” disclosures identify source pages.

Notable clarifications are stated where they matter:

- The visible Chapter 1 total-cost formula correctly adds fixed and variable cost. An earlier reader warning mistook a PDF text-layer artifact for a slide typo; that warning has been removed.
- The intended pottery clay row is `4x1 + 3x2 <= 120`. The revised Chapter 3 still contains the older mistyped COPT screenshot and its 1,600 result. The separate COPT 8.0.7 tutorial corrects the row and gives (24,8), objective 1,360.
- At the feasible pottery point (5,10), clay usage is 50, not the printed 70.
- At fare $38, the observed airline total is printed as 60 while its two type counts sum to 65. These source entries are retained with the inconsistency stated; the fitted demand curves are not refitted.
- Willow Valley uses 2 labor hours per bowl, not 1. Its earlier reader transcription and derived results have been corrected. The overwritten labor RHS is retained as a parameter rather than asserted as certain.
- A technology coefficient of 1.33 is distinguished from the rounded value of 4/3.
- All ten Chapter 4 formulation pages are visibly blank. The reader separates visible problem data from explicitly derived models, with inventory/timing assumptions and the DEA convention stated.
- The final uncertain-investment slide gives incomplete probabilities for project B. The reader does not invent the missing outcome.
- The Assignment 2 answer key swaps the coordinates of a nonoptimal claims-staffing corner and rounds the optimum cost down incorrectly; the reader shows direct-substitution corrections.
- In the Assignment 3 farm answer, $520 corn profit makes all-corn optimal but not uniquely optimal; uniqueness needs a strict increase.
- Assignment 3 Excel sensitivity values are explicitly derived expectations, not fabricated Excel reports. Assignment 4 and 5 worked solutions are labeled as derived, with their modeling conventions stated.
- The new benchmark discussion is a dated course snapshot, not a current solver recommendation.

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
node scripts/build-practice-content.cjs
```

`npm test` checks every route, rendered math, search (including native tables and mathematical notation), keyboard-addressable controls, home experiment, state restoration, print preparation/restoration, asynchronous print dialogs, failed print calls and extreme experiment settings, local links, numerical models and page mapping. The independent `scripts/audit-models.py` audit uses NumPy and SciPy/HiGHS to solve 22 source-based models and sweep the sensitivity boundaries. It checks the worked numerical results separately from the browser calculations. Run it with `python3 scripts/audit-models.py` when those optional Python dependencies are installed. `python3 scripts/audit-assignments.py` independently checks the Assignment 1–4 numerical results, unboundedness, and sensitivity endpoints. The downloadable COPT pottery and Assignment 5 programs were run with COPT 8.0.7; their results were checked against the worked models. Native SVG diagrams were rendered with Inkscape for visual inspection.

Practice questions live in `content/practice.json`; `practice-index.js` contains only lightweight reader links, while `practice-content.js` loads full exercises on the practice page. Homework wording is restated from the course files; added hints and solver exercises are labeled. Official answer keys are distinguished from independently derived answers, and expected Excel values do not pretend an actual workbook was run.

The DOM tests cover all 55 topics and 24 practice exercises, source tables, code blocks, downloads, material-index routes, privacy exclusions, and source-page coverage, visible-source fidelity regressions, and lecture audit coverage, as well as the existing controls and print lifecycle. Practice tests exercise progressive hints, hidden solutions, graphs, comparison checks, notes, reset, session restoration, blocked storage, invalid routes and lecture entry points. They do not replace a browser rendering engine. Browser layout and actual print-dialog rendering were not visually tested in this environment because no browser surface was available.

Only an explicit allowlist of runtime files is copied into `.build/site`. Built HTML references content-hashed script/style URLs so a refreshed page loads the corrected course content rather than reusing an older cached bundle. GitHub Actions runs the checks and publishes successful `main` builds to GitHub Pages. Source PDFs, local review images and test dependencies are not deployed.

## Credits

Course material: Associate Professor Hai Jiang, Tsinghua University. [Official profile](https://www.ie.tsinghua.edu.cn/eng/info/1051/1023.htm). Mathematical typesetting: [KaTeX](https://katex.org/), distributed with its license. Lecturer portrait rights remain with the original owner. No blanket license is asserted over third-party course material.
