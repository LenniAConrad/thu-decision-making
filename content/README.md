# Content maintenance

`lectures.json` is the editable reader data; `lecture-content.js` is generated. Topic IDs are stable deep links. Each topic includes source file/page references. Source pages are mapped in `source-coverage.json`; source PDFs are deliberately not committed.

When a deck changes, sync Learn outside this repository, inspect the full relevant PDF pages (including figures and tables), update prose and native visuals, and record the new hash and mapping. Do not treat text extraction as authoritative when it includes hidden or overlapping slide text. Chapter 4 page 7, for example, visually contains a blank diet formulation although its PDF text layer contains unrelated investment text.

Keep original model data and all constraints, units and timing. Distinguish a correction, a derived solution, an explicitly added assumption and a genuinely missing source fact. Use ordinary study prose; avoid unexplained lists of formulas. Recreate necessary figures in HTML/SVG, never embed lecture screenshots. Preserve required data tables as accessible HTML.

After edits, regenerate the content bundle, run the tests, inspect new native figures and, when a supported browser is available, check desktop/mobile layout and complete-lecture print output. Add numerical checks when a new worked model presents an independently verifiable result. Source coverage is a page inventory, not a proof of semantic completeness.

`materials.json` is the user-facing inventory of current teaching materials and links to their reader routes. The content bundle includes this inventory.

Topics may add `tables` (`caption`, `headers`, rectangular `rows`), `code` (`title`, `language`, `body`) and `downloads` (`title`, local `href`). The reader includes these in reading, search and printing; local download files must be included by the build allowlist. Keep public attachments free of personal identifiers. Official-key corrections and independently derived answers must remain clearly labeled.
