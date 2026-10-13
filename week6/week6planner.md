# Week 6 planner — line-by-line teaching (Checkpoint A)

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** Big test A — one small real program, no windows yet.  
**Goal:** Inspect running state, structure a library, finish a non-Tk application.  
**Shell:** `tclsh` only — **no `wish`**. Coding lab is for tiny `proc` / `string` checks, not the app.  
**Deliverable:** `week06_app/` with README. **Checkpoint A.**

---

## 0. What “done” looks like

A folder, not one giant file:

```text
week06_app/
  app.tcl
  lib/log.tcl
  tclIndex        (from auto_mkindex)
  README.md
  samples/...
```

Run: `tclsh app.tcl samples/run.log`

---

## 1. `info` — ask the interpreter

```tcl
proc add {a b} { expr {$a + $b} }
puts [info procs add]
puts [info args add]
puts [info body add]
puts [info exists add]
set x 1
puts [info vars]
puts [info level]
puts [info tclversion]
```

| Subcommand | Use |
| --- | --- |
| `procs` / `args` / `body` / `default` | What a proc looks like. |
| `vars` / `locals` / `globals` / `exists` | What names are bound. |
| `commands` / `level` / `script` | Stack and current file. |
| `library` / `tclversion` / `patchlevel` | Where you are running. |

Use `info` **before** scattering `puts` everywhere.

Interactive `history` / `redo` / `substitute` — type those in `tclsh`, not in a script file.

---

## 2. Libraries — `auto_path`, `unknown`, `tclIndex`

When Tcl cannot find a command it calls `unknown`, which can `source` a file using `tclIndex`.

```bash
# from week06_app/
tclsh
# % auto_mkindex lib *.tcl
# % exit
```

```tcl
# app.tcl
lappend auto_path [file join [file dirname [info script]] lib]
# now Log_Parse can autoload from lib/log.tcl if tclIndex lists it
```

| Piece | Meaning |
| --- | --- |
| `info script` | Path of the currently sourcing file. |
| `lappend auto_path .../lib` | Where to search. |
| `auto_mkindex lib *.tcl` | Rebuild `tclIndex` after you add a proc. |

Style from the books: **module prefix** (`Log_Init`, `Log_Parse`) and **one global array** (`log(...)`).

---

## 3. Guestbook pattern (architecture, CGI optional)

Columbia Ch. 3 persists data as Tcl that you can `source`:

```tcl
# data.tcl — generated
set rec(1,name) Ada
set rec(1,msg)  hello
```

```tcl
if {[catch {source data.tcl} err]} {
    puts "no data yet: $err"
}
```

You do **not** need HTTP. Steal: commands, files, `catch`, executable Tcl as storage.

---

## 4. Suggested log-filter app

`lib/log.tcl`:

```tcl
proc Log_Init {} {
    global log
    set log(counts,ERROR) 0
    set log(counts,WARN) 0
    set log(lines) {}
}

proc Log_ParseLine {line} {
    global log
    set line [string trim $line]
    if {[regexp {^(ERROR|WARN|INFO)} $line -> sev]} {
        incr log(counts,$sev)
        lappend log(lines) $line
    }
}

proc Log_Dump {} {
    global log
    foreach sev [list ERROR WARN INFO] {
        if {[info exists log(counts,$sev)]} {
            puts "$sev $log(counts,$sev)"
        }
    }
}
```

`app.tcl`:

```tcl
lappend auto_path [file join [file dirname [info script]] lib]
Log_Init
set path [lindex $argv 0]
if {[catch {open $path r} ch]} {
    puts stderr $ch
    exit 1
}
while {[gets $ch line] >= 0} {
    Log_ParseLine $line
}
close $ch
Log_Dump
```

| Must | How this sample does it |
| --- | --- |
| Multi-file | `app.tcl` + `lib/*.tcl` |
| Global array | `log(...)` |
| `gets` + regexp | parse loop |
| `catch` on I/O | `open` |
| No Tk | `tclsh` |

Persist metrics as Tcl if you want the guestbook shape:

```tcl
set out [open metrics.tcl w]
puts $out [list set log(counts,ERROR) $log(counts,ERROR)]
close $out
```

---

## 5. Five teaching examples

### A — `info exists` before read

```tcl
if {![info exists log(counts,ERROR)]} { set log(counts,ERROR) 0 }
```

### B — `auto_path` relative to the script

```tcl
lappend auto_path [file join [file dirname [info script]] lib]
```

### C — `source` inside `catch`

```tcl
catch {source state.tcl}
```

### D — BUG then FIX (Tk too early)

```tcl
# BUG: pack [button .q -text Quit]  in Checkpoint A
# FIX: tclsh-only; Checkpoint B is Week 10
```

### E — BUG then FIX (stale tclIndex)

```tcl
# BUG: added Log_Dump but auto_mkindex not re-run
# FIX: auto_mkindex lib *.tcl
```

---

## 6. Lab checklist (Checkpoint A)

- [ ] `week06_app/` with `app.tcl` + `lib/*.tcl`
- [ ] `auto_mkindex` → `tclIndex`
- [ ] Module prefix + one global array
- [ ] Parse with `gets`/`read` + regexp
- [ ] Persist something as Tcl `set` / `array set` (optional but on-brand)
- [ ] `catch` on I/O
- [ ] README: how to run, commands, limits
- [ ] **No Tk**

---

## 7. Deliverable skeleton

```tcl
# app.tcl
lappend auto_path [file join [file dirname [info script]] lib]
if {$argc < 1} {
    puts "usage: tclsh app.tcl FILE"
    exit 1
}
Log_Init
# TODO: open/gets/Log_ParseLine/close/Log_Dump
```

README: `tclsh app.tcl samples/run.log` — what it prints, what it will not do.

---

## 8. When you get stuck

If a command is “invalid”, check `auto_path` and `tclIndex`. If state vanishes, you forgot `global log`. Do not open `wish` to “see” it.

---

## 9. Readings pointer

Columbia Part I Ch. 3 (architecture); Tk Book draft Ch. 8–9.

*End of Week 6 line-by-line planner.*
