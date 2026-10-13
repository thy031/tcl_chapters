# Week 8 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab; run the UI in **`wish`**)  
**Kid goal:** Click → something happens.  
**Goal:** Connect user actions to Tcl commands with correct scope.  
**Shell:** `wish`  
**Deliverable:** `week08_ui.tcl`; comment every `bind` with event + proc.

---

## 0. Recap

Week 4: `$x` inside a quoted script is substituted **when that script is built**. Week 7: `-command` is such a script. This week you put **proc names** in `-command` and `bind` so values are read **later**.

---

## 1. `bind` and percent substitutions

```tcl
bind .e <Return> {AddItem}
bind .l <Double-Button-1> {UseSelection}
```

| Piece | Meaning |
| --- | --- |
| `.e` | Widget (or class, or `all` — see bindtags). |
| `<Return>` | Event. |
| `<Double-Button-1>` | Sequence. |
| `{AddItem}` | Script run **at event time**. Braces defer `$`. |
| `%W %x %y %K` | Event fields, **not** `$` variables. |

`bindtags` order (typical): widget → class → toplevel → `all`. `break` in a binding stops later tags.

---

## 2. Buttons and Tcl variables

```tcl
set state(name) ""
entry .e -textvariable state(name)
button .add -text Add -command AddItem
checkbutton .v -text Verbose -variable state(verbose) -onvalue 1 -offvalue 0
radiobutton .a -text A -variable state(mode) -value a
```

| Option | Why |
| --- | --- |
| `-command AddItem` | Call a proc; the proc reads `state(...)` **now**. |
| `-textvariable` / `-variable` | Widget stores into a Tcl variable (use your global array). |

### Try a bug (stale `$`)

```tcl
set item apple
button .b -text Go -command "puts $item"
set item banana
# click still prints apple
```

Fix: `-command {puts $state(item)}` with braces **or** better `-command ShowItem` and `global state` inside the proc.

---

## 3. Menus

```tcl
menu .m
.m add command -label Quit -command exit
.m add separator
.m add cascade -label File -menu .m.file
menu .m.file
.m.file add command -label Open -command OpenFile
. configure -menu .m
# tk_popup .m.file %X %Y
# tk_optionMenu .opt state(choice) one two three
```

Entries are `command`, check/radio, `cascade`, `separator`.

---

## 4. Listbox + scrollbar + entry

```tcl
listbox .l -height 8 -yscrollcommand {.sb set} -selectmode browse
scrollbar .sb -command {.l yview}
entry .e -textvariable state(text)
button .add -text Add -command AddItem
button .del -text Delete -command DelItem

proc AddItem {} {
    global state
    .l insert end $state(text)
}
proc DelItem {} {
    set i [.l curselection]
    if {$i ne ""} { .l delete $i }
}
proc UseSelection {} {
    global state
    set i [.l curselection]
    if {$i ne ""} { set state(text) [.l get $i] }
}
```

| Call | Role |
| --- | --- |
| `.l insert end $s` | Append. |
| `.l curselection` | Selected index(es). |
| `.l get $i` / `.l delete $i` | Read / remove. |
| `-selectmode` | `browse` `single` `extended` `multiple`. |

---

## 5. Two-pane lab layout

```
[ menubar ]
[ listbox | scrollbar ]
[ entry ] [ Add ] [ Delete ]
```

Bind:

```tcl
# bind <Return> on entry → AddItem
# bind <Double-Button-1> on listbox → UseSelection
```

Comment those two lines in the deliverable.

---

## 6. Simple widgets (Ch. 15)

`frame`, `toplevel`, `label`, `message`, `scale`, `scrollbar`, `bell` — use `frame` for rows; you already need `scrollbar`. Skim the rest; do not build a widget museum.

---

## 7. Five teaching examples

### A — proc callback

```tcl
button .q -text Quit -command exit
```

### B — braced bind

```tcl
bind .e <Return> {AddItem}
```

### C — `-textvariable` on an array element

```tcl
entry .e -textvariable state(text)
```

### D — BUG then FIX (stale `$` in `-command`)

```tcl
# BUG: -command "puts $item"
# FIX: -command ShowItem
```

### E — BUG then FIX (no `global` in callback)

```tcl
# BUG: proc AddItem {} { .l insert end $state(text) }
# FIX: global state
```

---

## 8. Lab checklist

- [ ] Listbox + scrollbar, entry, Add/Delete, menubar
- [ ] `<Return>` and `<Double-Button-1>`
- [ ] Callbacks as procs — no inlined stale `$`
- [ ] Comment every `bind`

---

## 9. Deliverable skeleton — `week08_ui.tcl`

```tcl
#!/usr/bin/env wish
# bind .e <Return>           → AddItem
# bind .l <Double-Button-1>  → UseSelection

proc AddItem {} { global state; # TODO }
proc DelItem {} { # TODO }
proc UseSelection {} { global state; # TODO }

# TODO: widgets, pack, menu, bind
```

---

## 10. When you get stuck

If a click uses an old value, the script was substituted at **create** time. If a variable is empty in a proc, add `global state`.

---

## 11. Readings pointer

Tk Book draft Ch. 13–16.

*End of Week 8 line-by-line planner.*
