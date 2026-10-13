# Week 7 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab; Coding lab is Tcl-only — run Tk in **`wish`**)  
**Kid goal:** Open a window; stack buttons and boxes.  
**Goal:** Name widgets and pack a simple layout.  
**Shell:** `wish`  
**Deliverable:** `week07_pack.tcl` + screenshot or ASCII before/after layouts.

---

## 0. `wish` vs `tclsh`

```bash
wish
```

Tk scripts are still Tcl. Extra: widgets, `pack`, the event loop. Root window is `.`.

Columbia Part I has **no** Tk — use the Tk Book draft Ch. 10–12.

---

## 1. Widget paths and `configure`

```tcl
label .title -text "ExecLog"
button .quit -text Quit -command exit
pack .title .quit
```

| Piece | Meaning |
| --- | --- |
| `.title` | Child of `.` named `title`. |
| `.top.btn` | Parent `.top` **must exist first**. |
| `-text` / `-command` | Options at create time. |
| `.quit configure -text Exit` | Change later. |
| `.quit cget -text` | Read an option. |

### Try a bug

```tcl
button .a.b -text x
```

Cannot create `.a.b` before `.a`. Fix: `frame .a` first.

---

## 2. Pack cavity model

Each packed widget takes a slice of remaining **cavity**.

```tcl
frame .row
button .row.q -text Quit
button .row.r -text Run
pack .row.q -side left
pack .row.r -side left
pack .row -side top -fill x
```

| Option | Effect |
| --- | --- |
| `-side` | `top` `bottom` `left` `right` — which wall of the cavity. |
| `-fill` | `x` `y` `both` `none` — grow into the slice. |
| `-expand` | Take extra leftover cavity. |
| `-padx` `-pady` | Outside padding. |
| `-ipadx` `-ipady` | Inside padding. |
| `-anchor` | Where in a larger slice the widget sits. |
| `-before` `-after` `-in` | Order / parent. |

**Order of `pack` commands matters.** Pack the widget that must **keep its size first**.

---

## 3. Scrollbar before text (ExecLog lesson)

```tcl
text .t -width 40 -height 10 -yscrollcommand {.sb set}
scrollbar .sb -command {.t yview}
pack .sb -side right -fill y
pack .t  -side left  -fill both -expand 1
```

| Why this order | If you reverse it |
| --- | --- |
| Scrollbar claims a thin right strip first. | Expanding text can starve the scrollbar. |

Inspect:

```tcl
puts [pack slaves .]
pack info .t
```

`pack forget .t` unpacks (widget still exists). `pack propagate` — read the chapter before you turn it off.

---

## 4. Stripped ExecLog lab

```tcl
wm title . week07
label .title -text "week07 pack"
frame .btns
button .btns.quit -text Quit -command exit
button .btns.run  -text Run  -command {puts run}
entry .cmd -width 40
scrollbar .sb -command {.log yview}
text .log -width 50 -height 12 -yscrollcommand {.sb set}

pack .title -side top -anchor w
pack .btns  -side top -fill x
pack .btns.quit .btns.run -side left -padx 4
pack .cmd   -side top -fill x
pack .sb    -side right -fill y
pack .log   -side left -fill both -expand 1
```

Change **one** of `-fill` / `-expand` / `-side` at a time. Note what happens (ASCII or screenshot).

---

## 5. `place` overview only

```tcl
# place .b -x 10 -y 10
# place .b -relx 0.5 -rely 0.5 -anchor center
```

Coordinates, not the default manager this week. `raise` / `lower` change stacking, which is **not** pack order.

---

## 6. Five teaching examples

### A — parent before child

```tcl
frame .m
button .m.q -text Quit -command exit
pack .m.q
pack .m
```

### B — fill x on a toolbar

```tcl
pack .btns -side top -fill x
```

### C — scrollbar then text

```tcl
pack .sb -side right -fill y
pack .t  -fill both -expand 1
```

### D — BUG then FIX (`.a.b` first)

```tcl
# BUG: button .a.b
# FIX: frame .a ; button .a.b
```

### E — BUG then FIX (pack expand text first)

```tcl
# BUG: pack .t -fill both -expand 1 ; pack .sb
# FIX: pack .sb first
```

---

## 7. Lab checklist

- [ ] Stripped ExecLog: title, button row, entry, text + scrollbar
- [ ] Pack scrollbar **before** text
- [ ] Change one pack option at a time; record before/after
- [ ] `week07_pack.tcl` runs under `wish`

---

## 8. Deliverable skeleton — `week07_pack.tcl`

```tcl
#!/usr/bin/env wish
# week07_pack.tcl
# Notes:
#   pack .sb then .log  — scrollbar keeps width
#   -expand 1 on .log   — leftover cavity
wm title . week07
# TODO: widgets + pack as above
```

Run: `wish week07_pack.tcl`

---

## 9. When you get stuck

Sketch the cavity after each `pack`. If a widget vanished, it was packed with `-fill`/`-expand` stolen by a sibling, or the parent was not packed.

---

## 10. Readings pointer

Tk Book draft Ch. 10 *Tk Fundamentals*, Ch. 11 *Tk by Example*, Ch. 12 *The Pack Geometry Manager*.

*End of Week 7 line-by-line planner.*
