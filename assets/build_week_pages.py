#!/usr/bin/env python3
"""Convert weekN/weekNplanner.md into weekN/index.html (Week 1 layout)."""

from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

WEEKS = {
    2: {
        "h1": "Week 2: Strings, formatting, and pattern matching",
        "sub": "Treat all data as strings and use matching instead of ad-hoc parsing.",
        "diff_class": "diff-easy",
        "diff_label": "Easy",
        "stars": "★★☆☆☆",
        "stars_n": 2,
        "workload": "6–8 h",
        "shell": "tclsh",
        "topics": [
            "string subcommands",
            "append",
            "format and scan",
            "Glob-style string match",
            "Regular expressions: regexp and regsub",
        ],
        "lab": [
            "Proc to normalize whitespace",
            "Extract a numeric field with scan or regexp",
            "Rewrite a line with regsub",
            "Use book patterns only — no extra packages",
        ],
        "prev": ("../week1/index.html", "Week 1"),
        "next": ("../week3/index.html", "Week 3"),
        "lab_blurb": "In-browser sandbox for <code>string</code> basics. Use real <code>tclsh</code> for <code>regexp</code>, <code>regsub</code>, and <code>scan</code>.",
        "note": "Browser sandbox (string length/index/range/tolower). For week02_strings.tcl use real tclsh.",
        "examples": [
            ("length", "string length / index / range", r"""set s "Tcl/Tk"
puts [string length $s]
puts [string index $s 0]
puts [string index $s end]
puts [string range $s 0 2]"""),
            ("case", "trim + tolower", r"""set raw "  ERROR  "
puts ">[string trim $raw]<"
puts [string tolower ERROR]
puts [string toupper lvs]"""),
        ],
    },
    3: {
        "h1": "Week 3: Lists and arrays (Tcl data structures)",
        "sub": "Use lists for sequences and arrays for maps; stop concatenating strings as data.",
        "diff_class": "diff-mid",
        "diff_label": "Moderate",
        "stars": "★★★☆☆",
        "stars_n": 3,
        "workload": "6–8 h",
        "shell": "tclsh",
        "topics": [
            "list, lappend, concat",
            "llength, lindex, lrange, linsert, lreplace, lsearch, lsort",
            "split and join",
            "Array set/get and the array command",
            "env; optional unset, info, trace (draft extra)",
        ],
        "lab": [
            "Represent a small table as a list-of-lists and as an array",
            "Query, update, and pretty-print it",
            "record_add, record_get, record_dump",
        ],
        "prev": ("../week2/index.html", "Week 2"),
        "next": ("../week4/index.html", "Week 4"),
        "lab_blurb": "List commands may work in the sandbox if you stay with <code>list</code>/<code>lindex</code>. Arrays and <code>foreach</code> need real <code>tclsh</code>.",
        "note": "Sandbox is a Tcl subset. Run week03_data.tcl with real tclsh.",
        "examples": [
            ("list", "list vs quotes", r"""set a "two words"
puts [string length $a]
puts [string index $a 0]"""),
        ],
    },
    4: {
        "h1": "Week 4: Control flow, procedures, and scope",
        "sub": "Write structured scripts that hide state correctly.",
        "diff_class": "diff-mid",
        "diff_label": "Moderate",
        "stars": "★★★☆☆",
        "stars_n": 3,
        "workload": "6–8 h",
        "shell": "tclsh",
        "topics": [
            "if / elseif / else, switch",
            "foreach, while, for, break, continue",
            "catch, error, return",
            "proc, global, arrays as global state, upvar",
            "Draft extra: rename, uplevel, passing arrays by name",
        ],
        "lab": [
            "Command-line mini-tool with a proc API",
            "Global state array",
            "upvar for an in/out list or array",
            "catch around a failing operation",
        ],
        "prev": ("../week3/index.html", "Week 3"),
        "next": ("../week5/index.html", "Week 5"),
        "lab_blurb": "<code>if</code>/<code>while</code>/<code>proc</code> run here. <code>upvar</code> and <code>catch</code> need real <code>tclsh</code>.",
        "note": "Sandbox: if/while/proc. Run week04_procs.tcl with real tclsh.",
        "examples": [
            ("if", "if / elseif / else", r"""set n 3
if {$n < 0} {
    puts neg
} elseif {$n == 0} {
    puts zero
} else {
    puts pos
}"""),
            ("proc", "proc with default-like body", r"""proc greet {who} {
    return "hi $who"
}
puts [greet Ada]"""),
        ],
    },
    5: {
        "h1": "Week 5: eval, files, and program glue",
        "sub": "Read files and drive other programs — the core Tool Command Language use case.",
        "diff_class": "diff-hard",
        "diff_label": "Challenging",
        "stars": "★★★★☆",
        "stars_n": 4,
        "workload": "6–8 h",
        "shell": "tclsh",
        "topics": [
            "Why eval needs list",
            "subst",
            "exec and pipelines",
            "open / gets / puts / read / close; seek/tell",
            "glob, file tests, cd / pwd",
            "Pipeline errors raised on close",
        ],
        "lab": [
            "Run-and-capture script (exec or pipeline)",
            "Write stdout/stderr to files",
            "Glob a directory",
            "Recursive FindFile-style walk (Columbia Ch. 9)",
        ],
        "prev": ("../week4/index.html", "Week 4"),
        "next": ("../week6/index.html", "Week 6"),
        "lab_blurb": "The sandbox cannot <code>exec</code> or open files. Use it for grouping practice; run the lab in <code>tclsh</code>.",
        "note": "No exec/open here. Type eval/list grouping, then run week05_glue.tcl in tclsh.",
        "examples": [
            ("eval", "quotes vs grouping (puts)", r"""set a "two words"
puts $a
puts "$a"
puts {$a}"""),
        ],
    },
    6: {
        "h1": "Week 6: Reflection, libraries, complete Tcl app",
        "sub": "Inspect running state, structure a library, finish a non-Tk application.",
        "diff_class": "diff-hard",
        "diff_label": "Challenging · Checkpoint A",
        "stars": "★★★★☆",
        "stars_n": 4,
        "workload": "8+ h",
        "shell": "tclsh",
        "topics": [
            "info on variables, procs, stack",
            "Interactive history",
            "unknown, tclIndex, auto_path",
            "Module prefix and a global state array",
            "Guestbook CGI sample as architecture (CGI optional)",
        ],
        "lab": [
            "Summative Tcl-only tool (log filter or guestbook-like records)",
            "Split into app.tcl + lib/*.tcl",
            "Global state array and catch on I/O",
            "No Tk",
        ],
        "prev": ("../week5/index.html", "Week 5"),
        "next": ("../week7/index.html", "Week 7"),
        "lab_blurb": "Checkpoint A is a real <code>tclsh</code> folder. The sandbox is only for tiny proc checks.",
        "note": "Checkpoint A: tclsh-only app.tcl + lib. Sandbox is not the deliverable.",
        "examples": [
            ("proc", "tiny parse helper", r"""proc bump {n} {
    return [expr {$n + 1}]
}
puts [bump 3]"""),
        ],
    },
    7: {
        "h1": "Week 7: Tk fundamentals and geometry",
        "sub": "Open windows, name widgets, and pack a simple layout.",
        "diff_class": "diff-mid",
        "diff_label": "Moderate",
        "stars": "★★★☆☆",
        "stars_n": 3,
        "workload": "6–8 h",
        "shell": "wish",
        "topics": [
            "wish; widget path names; configure / cget",
            "Frames, labels, buttons, entry, text + scrollbar (ExecLog)",
            "pack side / fill / expand / padding; cavity model",
            "Packing order; pack slaves / pack info; unpacking",
            "place: overview only",
        ],
        "lab": [
            "Stripped ExecLog: title, buttons, entry, text + scrollbar",
            "Pack scrollbar first",
            "Change one pack option at a time and record the visual effect",
        ],
        "prev": ("../week6/index.html", "Week 6"),
        "next": ("../week8/index.html", "Week 8"),
        "lab_blurb": "Tk does not run in the browser. Use this sandbox for Tcl grouping; run <code>wish week07_pack.tcl</code> locally.",
        "note": "wish required for pack. Sandbox is Tcl-only.",
        "examples": [
            ("proc", "callback as a proc (no Tk)", r"""proc run {} {
    puts run
}
run"""),
        ],
    },
    8: {
        "h1": "Week 8: Events, buttons, and form widgets",
        "sub": "Connect user actions to Tcl commands with correct scope.",
        "diff_class": "diff-hard",
        "diff_label": "Challenging",
        "stars": "★★★★☆",
        "stars_n": 4,
        "workload": "6–8 h",
        "shell": "wish",
        "topics": [
            "bind / bindtags; key, button, modifiers, sequences",
            "Button -command and scope; check/radio Tcl variables",
            "Menus, popup, option menu",
            "frame/toplevel/label/message/scale/scrollbar/bell",
            "entry and listbox programming; select modes",
        ],
        "lab": [
            "Two-pane UI: listbox, entry, add/delete buttons, menu",
            "Bindings for Return and Double-1",
            "Callbacks as procs — not inlined scripts with stale $",
        ],
        "prev": ("../week7/index.html", "Week 7"),
        "next": ("../week9/index.html", "Week 9"),
        "lab_blurb": "Practice proc callbacks here. Bindings need <code>wish week08_ui.tcl</code>.",
        "note": "wish required. Demo why braces defer $ in a proc.",
        "examples": [
            ("stale", "read current var inside a proc", r"""set item apple
proc show {} {
    global item
    puts $item
}
set item banana
show"""),
        ],
    },
    9: {
        "h1": "Week 9: Dialogs, text, and canvas",
        "sub": "Build a focused viewer (text log or simple drawing), not a widget museum.",
        "diff_class": "diff-hard",
        "diff_label": "Challenging",
        "stars": "★★★★☆",
        "stars_n": 4,
        "workload": "6–8 h",
        "shell": "wish",
        "topics": [
            "focus, grabs, tkwait, update",
            "File-selection dialog pattern",
            "text: indices, marks, tags, bindings",
            "canvas: items, coordinates, operations",
            "Optional: selections and clipboard (Ch. 20)",
        ],
        "lab": [
            "Text track: tagged log viewer (search highlight, dump to file)",
            "OR canvas track: two item types and one bind",
        ],
        "prev": ("../week8/index.html", "Week 8"),
        "next": ("../week10/index.html", "Week 10"),
        "lab_blurb": "Text and canvas widgets need <code>wish</code>. Sandbox is Tcl-only.",
        "note": "Pick text or canvas. Run the deliverable with wish.",
        "examples": [
            ("index", "string stand-in for text indices", r"""set line "ERROR boom"
puts [string range $line 0 4]
puts [string toupper $line]"""),
        ],
    },
    10: {
        "h1": "Week 10: Callbacks, C-API map, and capstone",
        "sub": "Finish a small end-to-end Tk tool and know where C extensions sit.",
        "diff_class": "diff-hard",
        "diff_label": "Hard · Checkpoint B",
        "stars": "★★★★★",
        "stars_n": 5,
        "workload": "8+ h",
        "shell": "wish",
        "topics": [
            "after, fileevent; send at concept level",
            "C map: Tcl_Main, Tcl_AppInit, command procedures, result, eval from C",
            "Capstone: global array, file I/O + catch, packed UI, one bind",
            "Optional reading: Ch. 22–28, 30",
        ],
        "lab": [
            "Capstone wish app: state array + explicit global/upvar",
            "Read or write a file with catch",
            "Packed UI with at least two widget classes and one bind",
            "README: how to run, chapters used, one substitution bug you fixed",
        ],
        "prev": ("../week9/index.html", "Week 9"),
        "next": ("../quiz/index.html", "Review quiz"),
        "lab_blurb": "Checkpoint B runs under <code>wish</code>. Use the sandbox only for Tcl substitution checks.",
        "note": "Capstone is wish. Sandbox: grouping/substitution only.",
        "examples": [
            ("filter", "filter lines in Tcl", r"""proc keep {line filt} {
    if {$filt eq ""} { return 1 }
    return [string equal $filt [string range $line 0 [expr {[string length $filt]-1}]]]
}
puts [keep "ERROR x" ERROR]
puts [keep "INFO y" ERROR]"""),
        ],
    },
}


def slug(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text)
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text).strip("-")
    return text or "section"


def inline(s: str) -> str:
    parts: list[str] = []
    i = 0
    n = len(s)

    def take_code(j: int) -> tuple[str, int]:
        k = s.find("`", j + 1)
        if k < 0:
            return html.escape(s[j]), j + 1
        return f"<code>{html.escape(s[j + 1 : k])}</code>", k + 1

    while i < n:
        if s.startswith("`", i):
            chunk, i = take_code(i)
            parts.append(chunk)
            continue
        if s.startswith("**", i):
            k = s.find("**", i + 2)
            if k >= 0:
                parts.append(f"<strong>{inline(s[i + 2 : k])}</strong>")
                i = k + 2
                continue
        if s.startswith("[", i):
            m = re.match(r"\[([^\]]+)\]\(([^)]+)\)", s[i:])
            if m:
                label, href = m.group(1), m.group(2)
                parts.append(f'<a href="{html.escape(href, quote=True)}">{inline(label)}</a>')
                i += m.end()
                continue
        if s.startswith("*", i) and not s.startswith("**", i):
            k = s.find("*", i + 1)
            if k > i + 1:
                parts.append(f"<em>{inline(s[i + 1 : k])}</em>")
                i = k + 1
                continue
        parts.append(html.escape(s[i]))
        i += 1
    return "".join(parts)


def parse_table(lines: list[str], start: int) -> tuple[str, int]:
    rows = []
    i = start
    while i < len(lines) and lines[i].strip().startswith("|"):
        cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
        rows.append(cells)
        i += 1
    if len(rows) < 2:
        return "", start
    # drop separator
    body = rows[2:] if re.match(r"^:?-+:?$", rows[1][0].replace(" ", "")) or set(rows[1][0]) <= set("-: ") else rows[1:]
    if all(re.match(r"^:?-+:?$", c.replace(" ", "") or "-") for c in rows[1]):
        head, body = rows[0], rows[2:]
    else:
        head, body = rows[0], rows[1:]
    th = "".join(f"<th>{inline(c)}</th>" for c in head)
    trs = []
    for row in body:
        while len(row) < len(head):
            row.append("")
        trs.append("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in row[: len(head)]) + "</tr>")
    return (
        "<div class=\"table-wrap\"><table><thead><tr>"
        + th
        + "</tr></thead><tbody>"
        + "".join(trs)
        + "</tbody></table></div>",
        i,
    )


def strip_planner_intro(src: str) -> str:
    """Drop title + Parent syllabus / Kid goal / Goal / Shell / Deliverable block."""
    lines = src.splitlines()
    for i, line in enumerate(lines):
        if re.match(r"^##\s+", line):
            return "\n".join(lines[i:]).lstrip("\n")
    return src


def sections_to_dropdowns(body: str) -> str:
    """Wrap each h2 section in a <details> dropdown."""
    parts = re.split(r"(?=<h2\b)", body)
    out: list[str] = []
    for part in parts:
        part = part.strip()
        if not part or not part.startswith("<h2"):
            continue
        m = re.match(r"(<h2\b[^>]*>.*?</h2>)(.*)", part, flags=re.DOTALL)
        if not m:
            continue
        heading, content = m.group(1), m.group(2)
        content = re.sub(r"^\s*<hr>\s*", "", content)
        content = re.sub(r"\s*<hr>\s*$", "", content)
        content = content.strip()
        id_m = re.search(r'\bid="([^"]+)"', heading)
        id_attr = f' id="{id_m.group(1)}"' if id_m else ""
        heading_no_id = re.sub(r'\s+id="[^"]+"', "", heading)
        out.append(
            f'<details class="learn-drop"{id_attr}>\n'
            f"  <summary>{heading_no_id}</summary>\n"
            f'  <div class="learn-drop-body">\n{content}\n  </div>\n'
            f"</details>"
        )
    return "\n".join(out)


def md_to_html(src: str) -> str:
    lines = src.splitlines()
    out: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("```"):
            lang = line[3:].strip() or "text"
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            code = html.escape("\n".join(buf))
            out.append(f'<pre class="code"><code class="lang-{html.escape(lang)}">{code}</code></pre>')
            continue
        if line.strip() == "---":
            out.append("<hr>")
            i += 1
            continue
        m = re.match(r"^(#{1,3})\s+(.*)$", line)
        if m:
            level = len(m.group(1))
            raw = m.group(2).strip()
            inner = inline(raw)
            out.append(f'<h{level} id="{slug(raw)}">{inner}</h{level}>')
            i += 1
            continue
        if line.strip().startswith("|") and i + 1 < len(lines) and lines[i + 1].strip().startswith("|"):
            block, i = parse_table(lines, i)
            if block:
                out.append(block)
                continue
        if re.match(r"^[-*]\s+", line) or re.match(r"^- \[[ xX]\]\s+", line):
            items = []
            while i < len(lines) and (re.match(r"^[-*]\s+", lines[i]) or re.match(r"^- \[[ xX]\]\s+", lines[i])):
                t = re.sub(r"^- \[[ xX]\]\s+", "", lines[i])
                t = re.sub(r"^[-*]\s+", "", t)
                items.append(f"<li>{inline(t)}</li>")
                i += 1
            out.append('<ul class="list">' + "".join(items) + "</ul>")
            continue
        if re.match(r"^\d+\.\s+", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i]):
                t = re.sub(r"^\d+\.\s+", "", lines[i])
                items.append(f"<li>{inline(t)}</li>")
                i += 1
            out.append('<ol class="list">' + "".join(items) + "</ol>")
            continue
        if not line.strip():
            i += 1
            continue
        para = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not lines[i].startswith(("#", "```", "---", "|", "- ", "* ")) and not re.match(r"^\d+\.\s+", lines[i]):
            if lines[i].startswith("  "):
                break
            para.append(lines[i])
            i += 1
        chunks = []
        for p in para:
            br = p.endswith("  ")
            chunks.append(inline(p.rstrip()) + ("<br>" if br else ""))
        text = " ".join(chunks)
        text = text.replace("<br> ", "<br>\n")
        out.append(f"<p>{text}</p>")
    return "\n".join(out)


def js_string(s: str) -> str:
    return '"' + s.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def week_nav(active: int) -> str:
    bits = []
    for n in range(1, 11):
        cls = ' class="active"' if n == active else ""
        bits.append(f'    <a href="../week{n}/index.html"{cls}>Week {n}</a>')
    bits.append('    <a href="../quiz/index.html">Review quiz</a>')
    bits.append('    <a href="../index.html">Hub</a>')
    return "\n".join(bits)


def examples_js(examples: list[tuple[str, str, str]]) -> str:
    objs = []
    for eid, title, code in examples:
        objs.append(
            "{ id: %s, title: %s, code: %s }"
            % (js_string(eid), js_string(title), js_string(code))
        )
    return ",\n          ".join(objs)


def topics_dropdown(topics_html: str) -> str:
    return (
        '<details class="learn-drop">\n'
        "  <summary><h2>Topics</h2></summary>\n"
        '  <div class="learn-drop-body">\n'
        '      <ul class="list">\n'
        f"{topics_html}\n"
        "      </ul>\n"
        "  </div>\n"
        "</details>"
    )


def render_week(n: int) -> str:
    meta = WEEKS[n]
    md = strip_planner_intro((ROOT / f"week{n}" / f"week{n}planner.md").read_text(encoding="utf-8"))
    teach = sections_to_dropdowns(md_to_html(md))
    topics = "\n".join(f"      <li>{html.escape(t)}</li>" for t in meta["topics"])
    lab = "\n".join(f"      <li>{html.escape(t)}</li>" for t in meta["lab"])
    prev_href, prev_label = meta["prev"]
    next_href, next_label = meta["next"]
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Week {n} — Tcl/Tk programme</title>
  <link rel="stylesheet" href="../assets/course.css">
</head>
<body>
  <div class="wrap wide">
    <header>
      <h1>{html.escape(meta["h1"])}</h1>
      <p>{html.escape(meta["sub"])}</p>
    </header>
    <nav class="bar">
{week_nav(n)}
    </nav>
    <section class="card">
      <div class="meta">
        <span class="{meta["diff_class"]}">{html.escape(meta["diff_label"])}</span>
        <span class="stars" aria-label="difficulty {meta["stars_n"]} of 5">{meta["stars"]}</span>
        <span>Workload {html.escape(meta["workload"])}</span>
        <span>Shell: <code>{html.escape(meta["shell"])}</code></span>
      </div>
    </section>
    <div class="tabs">
      <button type="button" class="active" data-show="learning">Learning</button>
      <button type="button" data-show="practice">Practice</button>
      <button type="button" data-show="quiz">Quiz</button>
    </div>
    <section class="card learn md-doc" data-panel="learning">
{topics_dropdown(topics)}
{teach}
      <p class="why"><strong>Tip:</strong> After a section, switch to the <strong>Practice</strong> tab, or run the examples in <code>{html.escape(meta["shell"])}</code>.</p>
    </section>
    <section class="card hidden" data-panel="practice" id="lab-playground">
      <h2>Practice</h2>
      <ul class="list">
{lab}
      </ul>
      <p>Follow the typed exercises in the <strong>Learning</strong> tab.</p>
      <h3>Coding lab — edit, run, debug</h3>
      <p>{meta["lab_blurb"]}</p>
      <div id="tcl-lab-root"></div>
    </section>
    <section class="card hidden" data-panel="quiz" id="week-quiz-panel">
      <h2>Week {n} quiz</h2>
      <p>Two or three questions on <strong>what this week’s code does</strong>. Pick an answer, then Score quiz.</p>
      <div id="week-quiz"></div>
      <div id="week-quiz-score" class="card"></div>
    </section>
    <nav class="bar">
      <a href="{prev_href}">{html.escape(prev_label)}</a>
      <a href="{next_href}">{html.escape(next_label)}</a>
    </nav>
    <footer>Practical Tcl/Tk for Scripting and Tool Glue</footer>
  </div>
  <script src="../assets/course.js"></script>
  <script src="../assets/tcl-lab.js"></script>
  <script src="../assets/quiz.js"></script>
  <script src="../assets/week-quiz.js"></script>
  <script>
    document.addEventListener("DOMContentLoaded", function () {{
      if (window.TclLab) TclLab.mount(document.getElementById("tcl-lab-root"), {{
        note: {js_string(meta["note"])},
        examples: [
          {examples_js(meta["examples"])}
        ]
      }});
      if (window.WeekQuiz) WeekQuiz.mount({n});
      if (location.hash === "#lab-playground") showPanel("practice");
      if (location.hash === "#quiz") showPanel("quiz");
    }});
  </script>
</body>
</html>
"""


def patch_week1() -> None:
    """Refresh Week 1 Learning panel from planner (page shell stays hand-maintained)."""
    path = ROOT / "week1" / "index.html"
    text = path.read_text(encoding="utf-8")
    md = strip_planner_intro((ROOT / "week1" / "week1planner.md").read_text(encoding="utf-8"))
    teach = sections_to_dropdowns(md_to_html(md))
    topics = topics_dropdown(
        "\n".join(
            f"      <li>{html.escape(t)}</li>"
            for t in [
                "puts, set, expr, string, incr, proc, while",
                "Grouping with braces and quotes",
                "$ variable substitution, [] command substitution, \\ backslash",
                "Comments and Hello World",
                "The three interpreter steps: grouping → substitution → invocation",
            ]
        )
    )
    new_panel = (
        '    <section class="card learn md-doc" data-panel="learning">\n'
        f"{topics}\n"
        f"{teach}\n"
        '      <p class="why"><strong>Tip:</strong> After a section, switch to the <strong>Practice</strong> tab '
        "and Run / Debug the matching example.</p>\n"
        "    </section>"
    )
    updated, n = re.subn(
        r'    <section class="card learn md-doc" data-panel="learning">.*?</section>',
        new_panel,
        text,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        raise SystemExit("week1 learning panel not found for patch")
    path.write_text(updated, encoding="utf-8")
    print("wrote", path.relative_to(ROOT))


def main() -> None:
    patch_week1()
    for n in range(2, 11):
        path = ROOT / f"week{n}" / "index.html"
        path.write_text(render_week(n), encoding="utf-8")
        print("wrote", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
