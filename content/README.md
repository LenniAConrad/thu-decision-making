# Content maintenance

`lectures.json` is the editable reader data; `lecture-content.js` is generated. Topic IDs are stable deep links. Each topic includes source file/page references. Source pages are mapped in `source-coverage.json`; source PDFs are deliberately not committed.

When a deck changes, sync Learn outside this repository, inspect the full relevant PDF pages (including figures and tables), update prose and native visuals, and record the new hash and mapping. Do not treat text extraction as authoritative when it includes hidden or overlapping slide text. Chapter 4 page 7, for example, visually contains a blank diet formulation although its PDF text layer contains unrelated investment text.

Keep original model data and all constraints, units and timing. Distinguish a correction, a derived solution, an explicitly added assumption and a genuinely missing source fact. Use ordinary study prose; avoid unexplained lists of formulas. Recreate necessary figures in HTML/SVG, never embed lecture screenshots. Preserve required data tables as accessible HTML.

After edits, regenerate the content bundle, run the tests, inspect new native figures and, when a supported browser is available, check desktop/mobile layout and complete-lecture print output. Add numerical checks when a new worked model presents an independently verifiable result. Source coverage is a page inventory, not a proof of semantic completeness.

`materials.json` is the user-facing inventory of current teaching materials and links to their reader routes. The content bundle includes this inventory.

Topics may add `tables` (`caption`, `headers`, rectangular `rows`), `code` (`title`, `language`, `body`) and `downloads` (`title`, local `href`). The reader includes these in reading, search and printing; local download files must be included by the build allowlist. Keep public attachments free of personal identifiers. Official-key corrections and independently derived answers must remain clearly labeled.

`lecture-audit.json` records the visible-source fidelity audit. Preserve the distinction between a true slide inconsistency and a PDF extraction artifact: the latter must not be attributed to the lecturer as an error. Verify changed source coefficients visually and update independent numerical checks when their derived results change.

`practice.json` separates question-only `prompt`, `tables`, `tasks` from progressive `hints` and the hidden `solution`. Each exercise names its lecture/topic mappings, assignment parts, sources, solution origin and comparison checklist. Keep every question self-contained, avoid answer leakage, and label exercises created for this companion. Generate both practice bundles with `node scripts/build-practice-content.cjs`. Use `solution.visual` to reuse a specific native comparison figure; never put a solved graph into the initial question.

Write inline mathematics with explicit `\( ... \)` delimiters and display equations on their own `$$ ... $$` lines. Use TeX subscripts and powers, such as `c_f`, `x_1` and `p^2`, inside those delimiters. The reader and practice renderer typeset this marked content with KaTeX in prose, tables, questions, hints and feedback; ordinary dollar prices and code stay literal. Do not rely on automatic guessing of math from prose. `test-inline-math.cjs` checks the cost-variable example and scans all readings and revealed practice content for raw delimiters and rendering errors.

Define each symbol at its first use in a lesson, including units and the meaning of subscripts, superscripts and abbreviations. Explain when a letter is a label rather than a variable, and call out local notation changes (for example, the subscript v in unit variable cost versus standalone v for volume). Do not assume the reader opened preceding topics.

Mathematical reading topics provide a local `notation` table (symbol, meaning, units/role), displayed through the “Symbols and units” disclosure near the start. Practice exercises carry problem-specific copies containing definitions only. Update both if a symbol changes; keep this reference separate from worked answers.

Every displayed equation has an `equationWords` entry keyed by its exact TeX. This is the same expression with descriptive names replacing variables, not a separate paragraph about the result. Preserve numbers, signs, bounds, fraction structure and model context. The reader pairs the symbolic and word versions with ⇔ and the label “Same formula in words”; practice uses the same format without revealing hidden solutions. Update this entry whenever the source equation changes.
