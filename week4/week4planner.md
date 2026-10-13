# Week 4 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** If/then, loops, helpers, and “who owns this variable?”  
**Goal:** Structured scripts that hide state correctly.  
**Shell:** `tclsh` — `if` / `while` / `proc` work in the Coding lab; `upvar` / `catch` / `switch` need real `tclsh`.  
**Deliverable:** `week04_procs.tcl` with comments listing every `global` / `upvar`.

---

## 0. Recap — braces defer substitution

`if`, `while`, `for`, `foreach`, and `proc` bodies must be `{...}` so `$vars` are **not** frozen when the line is first parsed (Week 1).

---

## 1. `if` / `elseif` / `else`

### Type this

```tcl
set n 3
if {$n < 0} {
    puts neg
} elseif {$n == 0} {
    puts zero
} else {
    puts pos
}
```

| Piece | Why braced |
| --- | --- |
| `{$n < 0}` | Test re-evaluated; `if` runs it as an expression. |
| `{ puts pos }` | Body not run unless that branch is taken. |

Space before `{` is required (`if{` is a different command name).

---

## 2. `switch`

```tcl
set sev ERROR
switch -exact -- $sev {
    ERROR { puts 2 }
    WARN  { puts 1 }
    default { puts 0 }
}
```

| Piece | Meaning |
| --- | --- |
| `-exact` / `-glob` / `-regexp` | How the string is matched. |
| `--` | End of switches so a value starting with `-` is safe. |
| `default` | Fallback arm. |
| `-` as a body | Fall-through (see the books). |

---

## 3. `foreach`, `for`, `break`, `continue`

```tcl
foreach x [list a b c] {
    puts $x
}

for {set i 0} {$i < 3} {incr i} {
    if {$i == 1} continue
    puts $i
}
```

| Command | Role |
| --- | --- |
| `foreach x $list {body}` | Walk a list (Week 3 data). |
| `for {init} {test} {next} {body}` | C-style; all four args usually braced. |
| `break` / `continue` | Leave loop / next iteration. |

Multi-var `foreach` (two lists, or `foreach {k v} $kv`) is in the assigned chapters — type those boxed examples.

---

## 4. Errors — `catch`, `error`, `return`

### Type this (real `tclsh`)

```tcl
if {[catch {open nosuch.txt r} err]} {
    puts "failed: $err"
} else {
    close $err
}

catch {error "boom"} msg
puts $msg
```

| Piece | Meaning |
| --- | --- |
| `catch {script} var` | `0` = ok (result in `var`); `1` = error (message in `var`). |
| `error "boom"` | Raise. `errorInfo` / `errorCode` hold extra detail. |
| `return -code` | Can mimic `break`/`continue`/`error` from a helper (books). |

**Lab rule:** wrap file/`exec` in `catch`. Do not assume the path exists.

---

## 5. `proc` arguments — defaults and `args`

```tcl
proc greet {{who world}} {
    return "hi $who"
}
puts [greet]
puts [greet Ada]

proc sum {args} {
    set t 0
    foreach n $args { set t [expr {$t + $n}] }
    return $t
}
puts [sum 1 2 3]
```

| Form | Meaning |
| --- | --- |
| `{who world}` | Default if the caller omits it. |
| `args` | Remaining arguments as a list. |

---

## 6. Scope — locals vs `global`

```tcl
set n 1
proc bump {} {
    global n
    incr n
}
bump
puts $n
```

| Without `global n` | With `global n` |
| --- | --- |
| `incr n` uses a **local** (or errors if missing). | Updates the global `n`. |

Prefer **one global array** (`state(...)`) over many scalars.

```tcl
proc init {} {
    global state
    set state(count) 0
}
proc bump {} {
    global state
    incr state(count)
}
```

---

## 7. `upvar` — call-by-name

```tcl
proc push {listVar x} {
    upvar $listVar L
    lappend L $x
}
set xs {}
push xs a
push xs b
puts $xs
```

| Line | What happens |
| --- | --- |
| `upvar $listVar L` | `L` in this proc **is** the caller’s variable named in `$listVar`. |
| `lappend L $x` | Mutates `xs` in the caller. |
| `upvar #0 rec rec` | `#0` = global frame — another way to reach globals. |

Use `upvar` when a proc must **update** a caller list or array without returning a huge copy.

---

## 8. Draft extras — `uplevel`, `rename`

```tcl
# rename oldName newName   ;# empty newName deletes
# uplevel 1 { set x 1 }    ;# run script in the caller’s frame
```

Read the boxed examples. You only need them if your helper is a tiny control-structure (like a custom loop).

---

## 9. Mini CLI pattern

```tcl
proc usage {} {
    puts "usage: tool add name | list"
}

proc cmd_add {name} {
    global state
    lappend state(names) $name
}

proc cmd_list {} {
    global state
    puts [join $state(names) \n]
}

set state(names) {}
# pretend argv:
foreach {op arg} [list add u1 add u2 list {}] {
    switch -exact -- $op {
        add  { cmd_add $arg }
        list { cmd_list }
        default { usage }
    }
}
```

---

## 10. Five teaching examples

### A — braced `if`

```tcl
if {$x > 0} { puts ok }
```

### B — `foreach` over a list

```tcl
foreach row $rows { puts [lindex $row 0] }
```

### C — `catch` around `open`

```tcl
if {[catch {open $path r} ch]} { puts $ch; return }
```

### D — BUG then FIX (quoted `while` test)

```tcl
# BUG: while "$i < 3" { incr i }   → $i frozen at parse
# FIX: while {$i < 3} { incr i }
```

### E — BUG then FIX (missing `global`)

```tcl
# BUG: proc bump {} { incr n }
# FIX: proc bump {} { global n; incr n }
```

---

## 11. Lab checklist

- [ ] CLI mini-tool with a proc API
- [ ] One global state array
- [ ] `upvar` for an in/out list or array
- [ ] `catch` around a failing file/op
- [ ] Comment every `global` / `upvar` and why

---

## 12. Deliverable skeleton — `week04_procs.tcl`

```tcl
# week04_procs.tcl
# global state   — why: ...
# upvar listVar  — why: ...

proc state_init {} {
    global state
    set state(items) {}
}

proc state_add {item} {
    upvar #0 state S
    lappend S(items) $item
}

# TODO: catch open, switch on argv
state_init
state_add demo
puts $state(items)
```

---

## 13. When you get stuck

Ask: **which stack frame owns this name?** Local, global, or `upvar` alias? Then check braces on the test/body.

---

## 14. Readings pointer

Columbia Part I Ch. 6–7; Tk Book draft Ch. 4–5.

*End of Week 4 line-by-line planner.*
