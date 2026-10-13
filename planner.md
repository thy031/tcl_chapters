# 10-Week Tcl/Tk Course Programme

**Working title:** Practical Tcl/Tk for Scripting and Tool Glue  
**Duration:** 10 weeks (~6–8 hours of study per week)  
**Level:** Master Y1 / VLSI-adjacent scripting (no prior Tcl required)

**In one sentence (kid version):** Tcl is a little language that tells the computer what to do; Tk is the part that makes buttons and windows — together they’re LEGO instructions for tool glue.

---

## Source texts

| Short name | File | What it is | Role in this course |
| --- | --- | --- | --- |
| **Columbia Part I** | `tcl-columbiauni.pdf` (118 pages) | Later-edition *Practical Programming in Tcl and Tk* (Brent Welch), **Part I — Tcl Basics** only | Primary text for Weeks 1–6. Cleaner chapter split and a CGI working example. |
| **Tk Book draft** | `tkbook.pdf` (455 pages) | Welch, *Practical Programming in Tcl and Tk*, **DRAFT 13 Jan 1995**, Tcl 7.4 / Tk 4.0 | Primary text for Weeks 7–10 (Tk and C API). Secondary for Weeks 1–6 where the draft chapters differ. |

The two PDFs are the **same book family**, not two independent curricula. Columbia Part I is a later, reorganized Tcl-only extract (Ch. 1–9). The Tk Book draft is an earlier full manuscript (Ch. 1–30) that still contains Tk, events, resources, and the C libraries.

Use Columbia Part I when both cover the same Tcl topic. Use the Tk Book draft for Tk, events, and C, and whenever you need the older chapter layout (lists/arrays together, `eval`, UNIX `exec`).

Columbia Part I numbering does **not** match the 1995 draft. Do not assign “Chapter 3” without saying which PDF.

---

## Course operating guidelines

Follow these rules for every week. They are the operating contract for the programme.

1. **Read before you code.** Finish the required reading, then type every boxed example into `tclsh` or `wish`. Do not only read — interactive execution builds muscle memory.
2. **One interpreter, two books.** Syntax is the same idea in both PDFs. Command names and a few APIs differ by edition (Tcl 7.x / Tk 4.0 in the draft vs a later Part I). If an example fails, compare the same topic in the other PDF before assuming you are wrong.
3. **Substitution before features.** Evaluation follows three steps: Argument Grouping → Value Substitution → Command Invocation. When a script misbehaves, draw those three steps on paper (`{}`, `""`, `[]`, `$`, `\`) before adding more commands.
4. **Braces vs quotes.** Default to `{...}` for code bodies (`if`, `while`, `proc`, `expr`) to defer substitution until execution time. Use `"..."` only when you need immediate variable or command substitution. Most Tcl bugs in this course come from getting this wrong.
5. **Lists are not an extra type.** A list is a string that obeys command-like syntax (whitespace separators and grouping). Build lists with `list`, `lappend`, and `concat`; never concatenate by hand and hope.
6. **Arrays for application state.** Prefer a single named array (often global or module-scoped) over a pile of scalar globals. That is the book’s recommended style for applications and Tk.
7. **Catch errors at the glue layer.** File I/O, `exec`, and pipelines fail. Wrap I/O and process calls in `catch`; close channels you open.
8. **Tk isolation.** Weeks 1–6 stay in `tclsh`. Weeks 7–10 use `wish`. Master geometry managers and event bindings before jumping to canvas.
9. **Draft caveats.** `tkbook.pdf` is an unedited 1995 draft (Tcl 7.4 / Tk 4.0). Treat it as a teaching manuscript: prefer concepts and patterns over copy-paste of deprecated options.
10. **Workload.** Each week: reading (2–3 h), lab (3–4 h), short write-up (1 h). The Week 10 capstone is a small but complete script, not a research project.
11. **EDA / tool-glue mapping (without leaving the books).** Map book skills as analogies only: `exec` and log scanning ≈ driving tool binaries and parsing reports; lists/arrays ≈ netlists, pin maps, cell properties; Tk ≈ simple reviewers. Do not invent Synopsys/Cadence commands that are not in these PDFs.
12. **Assessment honesty.** Weekly formative labs are 40%. Checkpoint A (Week 6) and Checkpoint B (Week 10) are the summative checkpoints. No unpublished APIs; only commands taught in the assigned chapters.

---

## The 10 weeks as a story (kid map)

| Week | Kid version | Grown-up focus |
| --- | --- | --- |
| 1 | Say hello, make variables, tiny loops. Learn how Tcl “reads” a line. | Mental model, grouping, substitution |
| 2 | Play with words: find patterns, fix messy text. | Strings, `format`/`scan`, glob & regexp |
| 3 | Make lists (shopping lists) and arrays (name → thing). | Lists & associative arrays |
| 4 | If/then, loops, little helpers, and “who owns this variable?” | Control flow, `proc`, scope |
| 5 | Open files, run other programs — glue tools together. | `eval`, `exec`, files, channels |
| 6 | **Big test A:** one small real program (no windows yet). | Libraries, introspection, Checkpoint A |
| 7 | Open a window; stack buttons and boxes with `pack`. | Tk fundamentals & geometry |
| 8 | Click → something happens. | Events, buttons, menus, forms |
| 9 | Either a text viewer or a simple drawing canvas. | Dialogs, text **or** canvas |
| 10 | **Big test B:** a tiny window app + a peek at C extensions. | Callbacks, C-API map, Checkpoint B |

---

## Learning outcomes (end of Week 10)

A student who completes the programme can:

- Predict the string result of nested substitutions (`{}`, `""`, `[]`, `$`, `\`) through the single-pass evaluation rule.
- Implement modular procedures with correct scope (`global`, `upvar`, `uplevel`) and manage state with associative arrays.
- Parse text with `regexp` / `regsub`, `format` / `scan`, and manipulate lists without corrupting quotes or braces.
- Drive the host OS: `exec` pipelines, `file` / `glob`, channel I/O (`open`, `gets`, `read`, `puts`, `fileevent`), and safe errors (`catch`, `error`).
- Package scripts as auto-loaded libraries (module naming, `tclIndex`, `auto_path` / `unknown` ideas).
- Build a Tk UI with `pack` (or `place`), bindings, focus/grabs, and a simple text or canvas view.
- Outline how a C command extension fits (`Tcl_AppInit`, `Tcl_CreateCommand`, result, eval from C) at a reading level.

---

## Weekly programme

### Week 1 — Tcl mental model, syntax, and core commands

**Kid goal:** Say hello and learn how Tcl reads a line.  
**Goal:** Run the interpreter and master command syntax, grouping, and substitution.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 1 *Tcl Fundamentals*; Ch. 2 *Getting started* | Ch. 1 *Tcl Fundamentals* (Getting Started through Comments, argv, reference tables) |
| Optional | — | Ch. 1 reference: backslash sequences, arithmetic operators, core commands, predefined variables |

#### Core content

- **Interpreter pipeline:** Every statement is a command. Three steps: (1) argument grouping, (2) value substitution, (3) command invocation. Commands end at newline or `;`.
- **Grouping:**
  - `{...}` — groups words; disables `$`, `[]`, and most `\` substitution; braces nest.
  - `"..."` — groups words; still allows `$`, `[]`, and `\`.
  - **Single-pass rule:** Grouping is decided *before* substitution. Substituted values are **not** re-parsed or regrouped.
- **Substitution:**
  - `$var` / `${var}` — variable value.
  - `[...]` — evaluate nested script; replace with its string result.
  - `\` — escape specials (`\$`, `\[`, `\{`, `\"`, `\\`) or insert `\n`, `\t`, `\r`, octal/hex/Unicode escapes; `\` before newline continues the line.
- **Core commands:** `puts` (optional stream / `-nonewline`), `set`, `expr` (C-like ops and math functions; `tcl_precision`), `incr`, `while`, `proc`.
- **Comments & argv:** `#` only where a command name is expected (line start or after `;`). Predefined: `argc`, `argv`, `argv0`.

#### Lab & deliverable

- Interactive `tclsh`: `puts` / `set` / `expr`; a `while` + `incr` running sum; a two-argument `proc`. Break scripts on purpose (missing space before `{`, `#` mid-argument) and fix them.
- **Deliverable:** `week01_basics.tcl` with a top comment on the 3-step model and five substitution/grouping examples (two intentional bugs + fixes).

---

### Week 2 — Strings, formatting, and pattern matching

**Kid goal:** Play with words — find patterns, fix messy text.  
**Goal:** Treat all data as strings; match instead of ad-hoc parsing.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 4 *string processing* | Ch. 2 *Strings and Pattern Matching* |
| Cross-check | — | `format`, `scan`, `append`, `string match`, `regexp`, `regsub` |

#### Core content

- **`string` subcommands:** `length`, `index`, `range`, `first` / `last`, `compare`, `equal`, `tolower` / `toupper` / `totitle`, `trim` / `trimleft` / `trimright`, `match`, `is` (classes), `map`.
- **Mutation & formatting:** `append`; `format` (sprintf-style); `scan` (sscanf-style, including character sets like `%[a-z]`).
- **Glob (`string match`):** `*`, `?`, `[abc]`, `[a-z]`, `\x`.
- **Regex:** `. ^ $ * + ? () | [] [^]`; `regexp` (`-nocase`, `-indices`); `regsub` (`-all`, `-nocase`; `&` / `\1`…`\9` in replacement).

#### Lab & deliverable

1. Normalize messy whitespace to single spaces.  
2. Parse a tool-log line (e.g. `ERROR (LVS-402): Short detected at net N12 on layer MET1`) with `scan` or `regexp` → code, net, layer.  
3. Rewrite paths or assignments with `regsub`.

- **Deliverable:** `week02_strings.tcl` plus 5–10 sample inputs and expected output.

---

### Week 3 — Lists and arrays (Tcl data structures)

**Kid goal:** Shopping lists and labeled boxes (name → thing).  
**Goal:** Lists for sequences, arrays for maps — stop using string concat as a data structure.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 5 *Lists*; Ch. 8 *Arrays* | Ch. 3 *Tcl Data Structures* |
| Extra in draft | — | `unset`, `info`, environment variables, `trace` |

#### Core content

- **Lists:** `list`, `lappend`, `concat`, `llength`, `lindex`, `lrange`, `linsert`, `lreplace`, `lsearch` (`-exact`/`-glob`/`-regexp`), `lsort`, `split`, `join`.
- **Arrays:** `set arr(key) val`; `$arr($i)`; `array exists|get|set|names|size`; search handles (`startsearch` / `nextelement` / `anymore` / `donesearch`); `env` (`$::env(PATH)`).
- **Introspection (as covered):** `unset`; `info exists`; optional `trace variable` (`r`/`w`/`u`).

#### Lab & deliverable

- Represent a small table (e.g. instances: `inst_name`, `cell_type`, `x_loc`, `y_loc`) as both a list-of-lists and an array keyed by `inst_name,attribute`. Procs: `record_add`, `record_get`, `record_dump`.
- **Deliverable:** `week03_data.tcl` with those procs (optional notes comparing the two representations).

---

### Week 4 — Control flow, procedures, and scope

**Kid goal:** If/then, loops, helpers, and “who owns this variable?”  
**Goal:** Structured scripts that hide state correctly.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 6 *Control structure*; Ch. 7 *Procedures* | Ch. 4 *Control Flow Commands*; Ch. 5 *Procedures and Scope* |
| Extra in draft | — | `rename`, `uplevel`, passing arrays by name |

#### Core content

- **Control:** `if` / `elseif` / `else`; `switch` (`-exact`/`-glob`/`-regexp`, fall-through `-`, `default`); `while`; `for`; `foreach` (including multi-var / multi-list); `break` / `continue`.
- **Errors:** `catch` (0 ok / 1 error); `error` (`errorInfo`, `errorCode`); `return` with `-code` (`ok`, `error`, `return`, `break`, `continue`).
- **Procs & scope:** defaults and `args`; locals isolated; `global`; `upvar` (call-by-name, `#0` = global); `uplevel`; `rename` (empty name deletes).

#### Lab & deliverable

- CLI mini-tool with a global state array, `upvar` for in/out list or array, `catch` around a failing file/op, and (where taught) `uplevel` for a tiny control helper.
- **Deliverable:** `week04_procs.tcl` with comments listing every `global` / `upvar` and why.

---

### Week 5 — `eval`, files, and program glue

**Kid goal:** Open files and run other programs — glue tools together.  
**Goal:** Scripts that read files and drive other programs — the core “tool command language” use case.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 9 *File I/O and running other programs* | Ch. 6 *Eval*; Ch. 7 *Working with UNIX* |
| Must-do examples | open / read / write / close; `cd` / `pwd`; `glob`; pipelines | `eval` + `list`; `subst`; `exec`; `puts` / `gets` / `read`; seek/tell; `exit` / `pid` |

#### Core content

- **`eval` / `subst`:** Second-round evaluation; build with `list` (`eval [list cmd $a $b]`), never bare string concat of untrusted args; `subst` options `-nobackslashes` / `-nocommands` / `-novariables`.
- **`exec`:** pipelines `|` / `|&`; redirections `<` `<<` `>` `>>` `2>` `>&` `@`; trailing `&` for background; non-zero / stderr → Tcl error.
- **Filesystem:** `file` (`exists`, `isdirectory`, `isfile`, permissions, `size`, times, `dirname`/`tail`/`extension`/`rootname`, `stat`…); `glob` (`-nocomplain`); `pwd` / `cd`.
- **Channels:** `open` (modes / `|pipeline`); `gets`; `read`; `puts`; `flush`; `seek` / `tell`; `eof`; `close` (pipeline close can error); `pid`; `exit`.

#### Lab & deliverable

- “Run and capture”: `exec` or `open "|..."`; write stdout/stderr to files; recursive `FindFile`-style walk (`glob` + `file isdirectory` / `dirname` / `tail`) as in Columbia Ch. 9.
- **Deliverable:** `week05_glue.tcl` + README: one wrapped command and how non-zero status was handled with `catch`.

---

### Week 6 — Reflection, libraries, and Checkpoint A

**Kid goal:** Big test A — one small real program, no windows yet.  
**Goal:** Inspect running state, structure a library, finish a non-Tk application.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Ch. 3 *Guestbook CGI sample* (architecture; CGI optional) | Ch. 8 *Reflection and Debugging*; Ch. 9 *Script Libraries* |

#### Core content

- **`info`:** args/body/default/procs/vars/locals/globals/exists; commands, cmdcount, level, script, library, tclversion, patchlevel.
- **History (interactive):** `history`, `redo`, `substitute`.
- **Libraries:** `unknown`; `auto_path`; `tclIndex` / `auto_mkindex`; style: module prefixes (`Pref_Init`) and one global array per module.
- **Guestbook/CGI pattern (architecture):** persist data as Tcl `set` / `array set` scripts; reload with `source` inside `catch`.

#### Lab (summative) & deliverable — Checkpoint A

- Multi-file log/report or guestbook-like tool **without Tk**: `app.tcl` + `lib/*.tcl`, `auto_mkindex` → `tclIndex`, module global array, parse with `gets`/`read` + regexp, persist metrics as executable Tcl, `catch` on I/O.
- **Deliverable:** `week06_app/` with README (how to run, commands, limits). **Checkpoint A.**

---

### Week 7 — Tk fundamentals and geometry

**Kid goal:** Open a window; stack buttons and boxes.  
**Goal:** Name widgets and pack a simple layout.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | — (Part I ends at Tcl) | Ch. 10 *Tk Fundamentals*; Ch. 11 *Tk by Example*; Ch. 12 *The Pack Geometry Manager* (`place`: overview only) |

#### Core content

- **`wish`:** event-driven shell; root `.`; paths like `.top.btn`; widget command + `configure` / `cget`.
- **Pack cavity model:** `-side`, `-fill`, `-expand`, `-padx`/`-pady`, `-ipadx`/`-ipady`, `-anchor`, `-before`/`-after`, `-in`; `pack propagate`; `pack slaves` / `pack info`; `pack forget`.
- **`place` overview:** absolute/relative `-x`/`-y`/`-relx`/`-rely`/size.
- **Stacking:** `raise` / `lower`.

#### Lab & deliverable

- Stripped ExecLog: title, button row (`Quit`/`Run`), entry, text + scrollbar; pack scrollbar **before** text; change `-fill` / `-expand` / `-side` one at a time and note the effect.
- **Deliverable:** `week07_pack.tcl` + screenshot or ASCII before/after layouts.

---

### Week 8 — Events, buttons, and form widgets

**Kid goal:** Click → something happens.  
**Goal:** Connect user actions to Tcl commands with correct scope.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | — | Ch. 13 *Binding Commands to X Events*; Ch. 14 *Buttons and Menus*; Ch. 15 *Simple Tk Widgets*; Ch. 16 *Entry and Listbox Widgets* |

#### Core content

- **`bind` / `bindtags`:** sequences `<Mod-Type-Detail>`; `%W %x %y %X %Y %A %K %b`; default bindtag order; `break` stops propagation.
- **Buttons:** `button`, `checkbutton` / `radiobutton` (`-variable`, `-onvalue`/`-offvalue`/`-value`), `menubutton`; `-command`, `-state`, etc.
- **Menus:** `menu` + `add` (`command`, check/radio, `cascade`, `separator`); `tk_popup`; `tk_optionMenu`.
- **Forms:** `frame`, `toplevel`, `label`, `message`, `scale`, `scrollbar`, `bell`; `entry` / `listbox` ops and select modes; scrollbar coupling (`-yscrollcommand` / `-command`).

#### Lab & deliverable

- Two-pane UI: listbox (+ scrollbar), entry + Add/Delete, menubar; bind `<Return>` and `<Double-Button-1>`. Callbacks as `proc`s — not inlined scripts with stale `$`.
- **Deliverable:** `week08_ui.tcl`; comment every `bind` with event + proc.

---

### Week 9 — Dialogs, text, and canvas

**Kid goal:** A text viewer or a simple drawing.  
**Goal:** One focused viewer — not a widget museum.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | — | Ch. 17 *Focus, Grabs, and Dialogs*; **either** Ch. 18 *text* **or** Ch. 19 *canvas* (skim the other) |
| Optional | — | Ch. 20 *Selections and the Clipboard* |

#### Core content

- **Focus / grabs / dialogs:** `focus`; `grab` / `grab release`; `tkwait`; `update` / `update idletasks`.
- **Text track:** indices (`line.char`, `end`, `insert`, modifiers); marks; tags (`add`/`configure`/`bind`); insert/delete/get/see/search; embedded windows.
- **Canvas track:** coords (0,0 top-left); items (`arc`, `line`, `oval`, `rectangle`, `text`, …); tags/IDs; `create`/`delete`/`move`/`coords`/`itemconfigure`/`bind`/`scale`; optional `postscript`.

#### Lab & deliverable (choose one)

- **Text:** tagged log viewer (severity colors, search highlight, dump to file).  
- **Canvas:** layout/annotator or double-slider / hello-canvas with ≥2 item types and one binding.

- **Deliverable:** `week09_text.tcl` **or** `week09_canvas.tcl` (+ short note on focus/grab if you used a dialog).

---

### Week 10 — Callbacks, C-API map, and Checkpoint B

**Kid goal:** Big test B — a tiny window app + a peek at how C can add new commands.  
**Goal:** End-to-end Tk tool; know where C extensions sit.

| | Columbia Part I | Tk Book draft |
| --- | --- | --- |
| Required | Re-read Part I intro (what Tcl-only can do) | Ch. 21 *Callbacks and Handlers* (`after`, `fileevent`, `send` at concept level) |
| Required (map, not a C project) | — | Ch. 29 *C Programming and Tcl* |
| Optional | — | Ch. 22–28; Ch. 30 Tk C library |

#### Core content

- **Async:** `after` / `after cancel`; `fileevent`; `send` (concept).
- **C-API map (reading level):** `Tcl_Main` / `Tk_Main` → `Tcl_AppInit` → `Tcl_CreateCommand` → command proc `(ClientData, Tcl_Interp*, argc, argv[])` → `TCL_OK`/`TCL_ERROR` + `Tcl_SetResult`; `Tcl_Eval` / `Tcl_EvalFile`. Compiling an extension is **not** required unless a local toolchain is already set up.

#### Capstone (summative) — Checkpoint B

Pick one shape:

1. Interactive log analyzer / tool runner (ExecLog lineage; tagged text + filters).  
2. Record browser (Week 6 app + listbox).  
3. Canvas netlist/layout annotator.

**Must:**

1. Global array state; explicit `global` / `upvar`.  
2. File I/O with `catch`.  
3. Packed UI ≥2 widget classes + at least one `bind`.  
4. README: how to run, chapters used, one substitution bug you fixed.  
5. Optional but preferred: one-page C-API sketch (`Tcl_AppInit` → command proc → eval loop) — boxes, no code required.

- **Deliverable:** `week10_capstone/`. **Checkpoint B.**

---

## Pacing map (both books)

| Week | Topic focus | Columbia Part I | Tk Book draft | Deliverable |
| --- | --- | --- | --- | --- |
| 1 | Mental model, syntax | Ch. 1–2 | Ch. 1 | `week01_basics.tcl` |
| 2 | Strings, matching | Ch. 4 | Ch. 2 | `week02_strings.tcl` |
| 3 | Lists & arrays | Ch. 5, 8 | Ch. 3 | `week03_data.tcl` |
| 4 | Control, procs, scope | Ch. 6–7 | Ch. 4–5 | `week04_procs.tcl` |
| 5 | `eval`, files, glue | Ch. 9 | Ch. 6–7 | `week05_glue.tcl` |
| 6 | Libraries & app | Ch. 3 (application) | Ch. 8–9 | **Checkpoint A** `week06_app/` |
| 7 | Tk & pack | — | Ch. 10–12 | `week07_pack.tcl` |
| 8 | Events & forms | — | Ch. 13–16 | `week08_ui.tcl` |
| 9 | Dialogs, text/canvas | — | Ch. 17 + (18 or 19) | `week09_text.tcl` or `week09_canvas.tcl` |
| 10 | Callbacks, C map, capstone | Review Part I | Ch. 21, 29 (+ optional 22–30) | **Checkpoint B** `week10_capstone/` |

```text
Week   Columbia Part I              Tk Book draft
  1    Ch. 1–2                      Ch. 1
  2    Ch. 4                        Ch. 2
  3    Ch. 5, 8                     Ch. 3
  4    Ch. 6–7                      Ch. 4–5
  5    Ch. 9                        Ch. 6–7
  6    Ch. 3 (application)          Ch. 8–9     ← Checkpoint A
  7    —                            Ch. 10–12
  8    —                            Ch. 13–16
  9    —                            Ch. 17 + (18 or 19)
 10    review Part I                Ch. 21, 29 (+ optional 22–30)  ← Checkpoint B
```

---

## Assessment

| Element | Week | Weight | Evidence |
| --- | --- | --- | --- |
| Formative labs | 1–5, 7–9 | 40% | Weekly `.tcl` files that run |
| Checkpoint A | 6 | 25% | Multi-file Tcl tool, `tclIndex`, global state array, no Tk |
| Checkpoint B | 10 | 35% | Tk capstone + README; C-API sketch preferred |

**Rubric:** runs without syntax/uncaught eval failures; grouping/substitution controlled; state in arrays with explicit `global`/`upvar`; I/O and `exec` use `catch` and cleanup; Tk packed/bound on purpose; README names source chapters.

---

## Environment

- **Weeks 1–6:** `tclsh` (Tcl 8.x is fine; expect small differences from the 7.4-era draft).
- **Weeks 7–10:** `wish`.
- **OS:** Linux assumed (UNIX chapters). Windows/Mac notes: Columbia Ch. 2 / Tk Book Ch. 1.
- **Not required:** compiling Tk from source, deep X resources, or a full C extension — optional after Week 10 if time remains.

---

## What this programme deliberately skips

From the Tk Book draft, unless you have extra time after Week 10:

- Deep X resources and preference frameworks (Ch. 27–28)
- Full widget-attribute / font / colormap tours (Ch. 22–24)
- Encyclopedic `wm` / `winfo` (Ch. 25)
- Bind-editor mega-widget (Ch. 26)
- Custom C event loops and full Tk C library (Ch. 30)

These remain valid **reading extensions**, not core labs.

---

## How to use this planner

1. Keep both PDFs next to this file (`tcl_learning/`).
2. Each Monday (or session 1): read the required chapters and type the examples.
3. Each lab block: one new `.tcl` file (or folder) named as above; commit or zip weekly.
4. Do not start Tk before finishing Checkpoint A unless you already know Tcl.
5. If a draft example uses Tk 3.6-only behaviour, follow the “Tk 4.0” notes in the same chapter or skip that option.
6. When stuck: paper-trace grouping → substitution → invocation before adding more commands.

*End of 10-week guideline.*
