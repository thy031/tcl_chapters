# Week 10 planner — line-by-line teaching (Checkpoint B)

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab; capstone runs in **`wish`**)  
**Kid goal:** Big test B — a tiny window app + a peek at how C can add new commands.  
**Goal:** End-to-end Tk tool; know where C extensions sit.  
**Shell:** `wish`  
**Deliverable:** `week10_capstone/` + README. **Checkpoint B.** Compiling C is **not** required.

---

## 0. Capstone shapes (pick one)

1. Interactive log analyzer / tool runner (ExecLog lineage; tagged text + filters).  
2. Record browser (Week 6 app + listbox).  
3. Canvas netlist/layout annotator.

**Must:**

1. Global array state; explicit `global` / `upvar`.  
2. File I/O with `catch`.  
3. Packed UI ≥2 widget classes + at least one `bind`.  
4. README: how to run, chapters used, one substitution bug you fixed.  
5. Optional: one-page C-API sketch (boxes, no code).

---

## 1. `after` — timers without freezing

```tcl
proc tick {} {
    global state
    incr state(n)
    .t configure -text $state(n)
    set state(after) [after 500 tick]
}
proc stop {} {
    global state
    after cancel $state(after)
}
```

| Piece | Meaning |
| --- | --- |
| `after 500 tick` | Run `tick` in 500 ms via the **event loop**. |
| `after idle {pack .b}` | After pending events. |
| `after cancel id` | Stop a pending handler. |

Do **not** `while {1} { exec ... }` inside a button — the window will freeze. That is what `after` / `fileevent` are for.

---

## 2. `fileevent` — channels without blocking the UI

```tcl
set ch [open "|uname -a" r]
fileevent $ch readable [list GotLine $ch]
proc GotLine {ch} {
    if {[gets $ch line] >= 0} {
        .log insert end $line\n
    } else {
        close $ch
    }
}
```

When the pipe has data, Tcl calls `GotLine`. Pair with Week 5 `catch`/`close`.

`send` talks to another Tk interpreter — understand the idea; you need not demo it if security blocks it.

---

## 3. C-API map (reading level, Ch. 29)

```text
Tcl_Main / Tk_Main
        → Tcl_AppInit
              → Tcl_CreateCommand("myop", MyOpProc, ...)
                    → MyOpProc(ClientData, Tcl_Interp*, argc, argv[])
                          → Tcl_SetResult(...)
                          → return TCL_OK or TCL_ERROR
        → eval loop (Tcl_Eval / Tcl_EvalFile)
```

| Piece | Meaning |
| --- | --- |
| `Tcl_AppInit` | Your hook: register commands, `source` `init.tcl`. |
| Command proc | Looks like a Tcl command to scripts. |
| Result | Goes through the interp, not `printf` alone. |
| `Tcl_Eval` | C asks Tcl to run a script. |

A `.so` / custom `wish` is **optional**. A one-page box diagram is enough.

Re-read Columbia Part I intro: a lot is already possible in Tcl-only + Tk.

---

## 4. Wiring the must-list onto a log viewer

```tcl
proc AppInit {} {
    global app
    set app(filter) ERROR
    set app(path) ""
}

proc AppLoad {path} {
    global app
    if {[catch {open $path r} ch]} {
        return $ch
    }
    .t delete 1.0 end
    while {[gets $ch line] >= 0} {
        AppAppend $line
    }
    close $ch
    set app(path) $path
}

proc AppAppend {line} {
    global app
    if {[string match *$app(filter)* $line] || $app(filter) eq ""} {
        .t insert end $line\n
    }
}
# bind .e <Return> {AppLoad $app(path)}   ;# comment in README
```

That sample already hits: array, `global`, `catch` open, `text`+`entry` (two classes), one `bind`. Add `pack` from Week 7.

---

## 5. Five teaching examples

### A — `after` heartbeat

```tcl
after 1000 tick
```

### B — `fileevent` instead of blocking `read`

```tcl
fileevent $ch readable [list Got $ch]
```

### C — capstone `catch` on open

```tcl
if {[catch {open $p r} ch]} { tk_messageBox -message $ch; return }
```

### D — BUG then FIX (blocking in `-command`)

```tcl
# BUG: button -command {exec long_tool}   → frozen UI
# FIX: fileevent or after + incremental read
```

### E — BUG then FIX (Week 8 stale `$` again)

```tcl
# BUG: bind .e <Return> "Load $path"
# FIX: bind .e <Return> LoadCurrent
```

---

## 6. Lab checklist (Checkpoint B)

- [ ] `week10_capstone/` runs under `wish`
- [ ] Global array + explicit `global`/`upvar`
- [ ] File I/O with `catch`
- [ ] Packed UI, ≥2 widget classes, ≥1 `bind`
- [ ] README: run, chapters, one substitution bug
- [ ] Optional C-API sketch
- [ ] Do **not** turn this into an unbounded C project

---

## 7. Deliverable skeleton

```text
week10_capstone/
  app.tcl
  README.md
  samples/
  c-api-sketch.txt   (optional)
```

```tcl
#!/usr/bin/env wish
# app.tcl — Checkpoint B
proc AppInit {} { global app; set app(filter) "" }
proc AppLoad {path} { global app; # catch open ... }
# pack + bind here
AppInit
```

README template:

- Run: `wish app.tcl`
- Chapters: e.g. 12, 13, 16, 18, 21
- Substitution bug: `-command "puts $x"` frozen; fixed by a proc

---

## 8. When you get stuck

If the window ignores clicks, you are blocked in `exec`/`read`. If filters use old strings, braces/`proc` (Week 1 + 8). If C reading overwhelms you, stop at the box diagram.

---

## 9. Readings pointer

Columbia Part I intro (review). Tk Book draft Ch. 21 (`after`, `fileevent`, `send`); Ch. 29 C map. Optional Ch. 22–28, 30 **after** the capstone runs.

*End of Week 10 line-by-line planner.*
