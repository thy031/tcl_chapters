# Week 3 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** Shopping lists and labeled boxes (name → thing).  
**Goal:** Lists for sequences, arrays for maps — stop using string concat as a data structure.  
**Shell:** `tclsh` — list examples can also run in the Coding lab if you stay with `list` / `lindex` / `llength` (arrays need real `tclsh`).  
**Deliverable:** `week03_data.tcl` with `record_add`, `record_get`, `record_dump`.

How to use: type each example → read the table → break grouping on purpose → fix it.

---

## 0. Recap

A **list** is a string that obeys command grouping (spaces, `{}`, quotes). An **array** is a map: `name(key)` → value. Related fields belong in **one** array, not ten scalars.

---

## 1. Build lists correctly — `list`, `lappend`, `concat`

### Type this

```tcl
set a "two words"
set bad "$a extra"
set good [list $a extra]
puts "bad=$bad"
puts "good=$good"
puts [llength $bad]
puts [llength $good]
```

| Line | After grouping | Meaning |
| --- | --- | --- |
| `"$a extra"` | one string `two words extra` | Looks like three words if you later treat it as a list. |
| `[list $a extra]` | two elements: `{two words}` and `extra` | `list` quotes elements that need it. |
| `llength` | 3 vs 2 | Proof that concat-by-quotes is not `list`. |

```tcl
set L [list]
lappend L u1 AND2
lappend L u2 NAND2
puts $L
```

`lappend` grows a list **in place** (like `append` for strings).

`concat` flattens one level of lists into one list — use it to join list values, not random strings.

---

## 2. Read lists — `llength`, `lindex`, `lrange`

### Type this

```tcl
set row [list u1 AND2 10 20]
puts [llength $row]
puts [lindex $row 0]
puts [lindex $row end]
puts [lrange $row 1 2]
```

| Command | Role |
| --- | --- |
| `llength` | Count elements (not characters). |
| `lindex $row 0` | First field. |
| `lindex $row end` | Last field. |
| `lrange $row 1 2` | Inclusive slice as a list. |

### Nested lists

```tcl
set table [list [list u1 AND2] [list u2 NAND2]]
puts [lindex $table 0]
puts [lindex [lindex $table 0] 1]
```

| Line | Result |
| --- | --- |
| `lindex $table 0` | `{u1 AND2}` (one row). |
| `lindex [lindex $table 0] 1` | `AND2` |

---

## 3. Edit — `linsert`, `lreplace`

```tcl
set L [list a b c]
puts [linsert $L 1 X]
puts [lreplace $L 1 1 Y]
puts $L
```

These commands **return a new list**; they do not change `$L` unless you `set L [...]`.

---

## 4. Search and sort — `lsearch`, `lsort`

```tcl
set cells [list AND2 NAND2 NOR2]
puts [lsearch -exact $cells NAND2]
puts [lsearch -glob $cells N*]
puts [lsort $cells]
```

| Switch | Meaning |
| --- | --- |
| `-exact` | Literal element. |
| `-glob` | Week-2 glob language. |
| `-regexp` | Week-2 regexp language. |

`-1` means not found.

---

## 5. `split` and `join`

```tcl
set line "u1,AND2,10,20"
set row [split $line ,]
puts [llength $row]
puts [join $row |]
```

| Command | Role |
| --- | --- |
| `split $line ,` | Delimiter → list of fields. |
| `join $row \|` | List → string (here `|`). |

This is how a file line becomes a row (Week 5 will `gets` the line).

---

## 6. Arrays — `set arr(key)`, `$arr($i)`

### Type this (real `tclsh`)

```tcl
set inst(u1,cell) AND2
set inst(u1,x) 10
set inst(u1,y) 20
set name u1
puts $inst($name,cell)
puts [array exists inst]
puts [array names inst]
puts [array size inst]
```

| Piece | Meaning |
| --- | --- |
| `inst(u1,cell)` | One array `inst`; key is the string `u1,cell`. |
| `$inst($name,cell)` | Substitute `$name` first, then look up. |
| `array names` | List of keys (order not guaranteed). |
| `array get` / `array set` | Flatten / restore as a key-value list. |

### Try a bug

```tcl
puts $inst(u1, cell)
```

Space inside `()` is part of the key (or a syntax mess). Keys are strings — no casual spaces.

---

## 7. Two representations of a table

**List of lists** (rows):

```tcl
set rows {}
lappend rows [list u1 AND2 10 20]
lappend rows [list u2 NAND2 30 40]
```

**Array keyed by `inst,attribute`:**

```tcl
set rec(u1,cell) AND2
set rec(u1,x) 10
set rec(u2,cell) NAND2
```

| Style | Strength |
| --- | --- |
| List of lists | Ordered dump, `foreach` rows. |
| Array | Fast lookup by instance name. |

The lab asks you to implement **both** views behind the same procs.

---

## 8. Mini procs — `record_add` / `record_get` / `record_dump`

```tcl
proc record_add {name cell x y} {
    global rec
    set rec($name,cell) $cell
    set rec($name,x) $x
    set rec($name,y) $y
    lappend rec(_names) $name
}

proc record_get {name attr} {
    global rec
    return $rec($name,$attr)
}

proc record_dump {} {
    global rec
    foreach name $rec(_names) {
        puts [format "%s %s %s %s" $name $rec($name,cell) $rec($name,x) $rec($name,y)]
    }
}

record_add u1 AND2 10 20
record_add u2 NAND2 30 40
puts [record_get u1 cell]
record_dump
```

| Line | Why |
| --- | --- |
| `global rec` | Array lives in the global namespace (Week 4 will explain scope). |
| `rec(_names)` | Remember insertion order; `array names` will not. |

---

## 9. Optional extras (draft)

- `unset rec(u1,x)` — drop one key.  
- `info exists rec(u1,cell)` — test before read.  
- `trace variable` — watch writes (optional).  
- `env` — `$::env(PATH)` is an array of the environment.

---

## 10. Five teaching examples

### A — `list` vs quotes

```tcl
set x "a b"
puts [llength [list $x]]
puts [llength "$x"]
```

### B — `lappend` in a loop

```tcl
set L {}
foreach w [list a b c] { lappend L $w }
```

### C — nested `lindex`

```tcl
puts [lindex [lindex [list [list 1 2]] 0] 1]
```

### D — BUG then FIX (comma key with space)

```tcl
# BUG: set rec(u1, cell) AND2
# FIX:
set rec(u1,cell) AND2
```

### E — BUG then FIX (forgot `global`)

```tcl
# BUG inside proc: set rec(u1,cell) AND2  → local array, empty outside
# FIX: global rec
```

---

## 11. Lab checklist

- [ ] Table as list-of-lists **and** as an array keyed by `inst,attribute`
- [ ] `record_add`, `record_get`, `record_dump`
- [ ] Query, update, pretty-print
- [ ] Notes comparing the two representations (optional)

---

## 12. Deliverable skeleton — `week03_data.tcl`

```tcl
# week03_data.tcl
# Two representations: rows (list of lists) vs rec() array.

proc record_add {name cell x y} {
    global rec rows
    # TODO
}

proc record_get {name attr} {
    global rec
    # TODO
}

proc record_dump {} {
    global rec
    # TODO
}

record_add u1 AND2 10 20
record_add u2 NAND2 30 40
puts [record_get u1 cell]
record_dump
```

---

## 13. When you get stuck

Draw the list as boxes of words, not as characters. If an element has a space, it must have been built with `list`/`lappend`.

---

## 14. Readings pointer

Columbia Part I Ch. 5 *Lists*, Ch. 8 *Arrays*; Tk Book draft Ch. 3 *Tcl Data Structures*.

*End of Week 3 line-by-line planner.*
