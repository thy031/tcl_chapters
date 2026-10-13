# Week 2 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** Play with words — find patterns, fix messy text.  
**Goal:** Treat all data as strings; match instead of ad-hoc parsing.  
**Shell:** `tclsh` only (no Tk) — or the in-page Coding lab on [`index.html`](index.html) for `string` basics.  
**Deliverable:** `week02_strings.tcl` (see end of this file).

How to use this file: read a short idea → type the example into `tclsh` **or** the Week 2 Coding lab → read the line-by-line notes → break it on purpose → fix it. `regexp` / `regsub` / `scan` need real `tclsh`.

---

## 0. Recap from Week 1

Everything you `set` is already a **string**. This week you **inspect**, **grow**, **format**, and **match** those strings — you do not invent character-by-character loops.

```tcl
set s "Hello"
puts [string length $s]
```

| Line | What happens |
| --- | --- |
| `set s "Hello"` | Store five characters. |
| `[string length $s]` | Command `string`, subcommand `length`, argument `Hello` → `5`. |

---

## 1. The big idea

Tcl has **one** data type at this level: the string. `string` is a command with **subcommands** (like `string length`). Matching uses two languages:

- **Glob** — `string match` (`*` `?` `[abc]`).
- **Regexp** — `regexp` / `regsub` (`. ^ $ * + ? () | []`).

Do not mix them.

---

## 2. Inspect — `length`, `index`, `range`

### Type this

```tcl
set s "Tcl/Tk"
puts [string length $s]
puts [string index $s 0]
puts [string index $s end]
puts [string range $s 0 2]
puts [string range $s 4 end]
```

### Line-by-line

| Piece | Result | Why |
| --- | --- | --- |
| `string length $s` | `6` | Count characters (`/` counts). |
| `string index $s 0` | `T` | Zero-based. |
| `string index $s end` | `k` | `end` is the last index. |
| `string range $s 0 2` | `Tcl` | Inclusive range. |
| `string range $s 4 end` | `Tk` | From index 4 through last. |

### Try a bug

```tcl
puts [string range $s 0 20]
```

Out-of-range `range` still returns what exists (or empty). Fix: check `length` if you need a hard error.

---

## 3. Search and compare — `first`, `last`, `compare`, `equal`

### Type this

```tcl
set path "/tmp/run.log"
puts [string first ".log" $path]
puts [string last "/" $path]
puts [string equal Tcl tcl]
puts [string compare abc abd]
```

| Line | Result | Meaning |
| --- | --- | --- |
| `string first ".log" $path` | start index of first match, or `-1` | Find a substring. |
| `string last "/" $path` | last `/` | Useful for “dirname vs tail”. |
| `string equal Tcl tcl` | `0` | Case-sensitive. |
| `string compare abc abd` | negative | Like C `strcmp` (`<0`, `0`, `>0`). |

---

## 4. Case and trim

### Type this

```tcl
set raw "  ERROR  "
puts ">[string trim $raw]<"
puts [string tolower ERROR]
puts [string toupper lvs]
```

| Command | Role |
| --- | --- |
| `string trim` | Strip whitespace (or given chars) from both ends. |
| `string trimleft` / `trimright` | One side only. |
| `tolower` / `toupper` / `totitle` | Case. |

**Lab habit:** trim **before** you match.

---

## 5. Grow a string — `append`

### Type this

```tcl
set out ""
append out "a"
append out " " "b"
puts $out
```

| Line | What happens |
| --- | --- |
| `set out ""` | Empty accumulator. |
| `append out "a"` | In-place grow — efficient in a loop. |
| `append out " " "b"` | Extra args are concatenated. |

### Why not `set out "$out$more"`?

That copies the whole string each time. Prefer `append` when building output.

---

## 6. `format` — sprintf-style output

### Type this

```tcl
set code 402
set net N12
puts [format "ERROR (LVS-%s): net %s" $code $net]
puts [format "%-8s %04d" MET 7]
```

| Piece | Meaning |
| --- | --- |
| `%s` | String. |
| `%d` / `%04d` | Integer, zero-padded width 4. |
| `%-8s` | Left-aligned field width 8. |

Quotes keep the format string **one** argument.

---

## 7. `scan` — sscanf-style input

### Type this (real `tclsh`)

```tcl
set line "x=3 y=4"
scan $line "x=%d y=%d" a b
puts "a=$a b=$b"
```

| Line | What happens |
| --- | --- |
| `scan $line "x=%d y=%d" a b` | Parse into variables `a` and `b`. Returns count of conversions. |
| Character sets | `%[a-z]` (see the books) when fields are letters. |

If the line is messy, `regexp` is clearer than a huge `scan` format.

---

## 8. Glob matching — `string match`

### Type this

```tcl
puts [string match "*.log" run.log]
puts [string match "*.log" run.txt]
puts [string match "LVS-???" LVS-402]
puts [string match {[A-Z]*} Error]
```

| Pattern | Meaning |
| --- | --- |
| `*` | Any string. |
| `?` | One character. |
| `[abc]` / `[A-Z]` | Character class. |
| `\x` | Literal `x`. |

**This is not regexp.** `*.log` as a regexp would mean “any chars, then one `l`, then `og`” in a different way — do not pass glob patterns to `regexp`.

---

## 9. `regexp` — test and capture

### Type this (real `tclsh`)

```tcl
set line "ERROR (LVS-402): Short detected at net N12 on layer MET1"
regexp {ERROR \(([A-Z]+)-([0-9]+)\):} $line -> tool num
puts "tool=$tool num=$num"
regexp {net ([A-Za-z0-9]+) on layer ([A-Za-z0-9]+)} $line -> net layer
puts "net=$net layer=$layer"
```

### Line-by-line

| Piece | Role |
| --- | --- |
| `{ERROR \(([A-Z]+)-([0-9]+)\):}` | Braces: pattern is **one** argument; `()` are regexp grouping, not Tcl grouping. |
| `$line` | Subject string. |
| `-> tool num` | First match of whole pattern is stored in `->` (dummy); groups in `tool`, `num`. |
| `-nocase` / `-indices` | Book switches — try them after the basic form works. |

### Try a bug

```tcl
regexp ERROR (LVS-402) $line
```

Without braces/quotes, Tcl sees extra arguments. Fix: brace the pattern.

---

## 10. `regsub` — rewrite

### Type this (real `tclsh`)

```tcl
set p "/home/eda/work/run.log"
regsub {/home/eda} $p {/proj} q
puts $q
regsub -all { +} "a   b  c" { } compact
puts ">$compact<"
```

| Piece | Meaning |
| --- | --- |
| `regsub pattern string replacement var` | Write result into `var`; returns count of substitutions. |
| `-all` | Every match, not just the first. |
| `&` / `\1` | Whole match / group 1 in the replacement (see the books). |

---

## 11. Mini script — normalize and parse a log line

Save as `demo_week2.tcl` and run `tclsh demo_week2.tcl`.

```tcl
proc normalize {s} {
    set s [string trim $s]
    regsub -all {[ \t]+} $s { } s
    return $s
}

proc parse_lvs {line} {
    set line [normalize $line]
    if {![regexp {ERROR \(([A-Z]+)-([0-9]+)\):} $line -> tool code]} {
        return [list]
    }
    regexp {net ([A-Za-z0-9]+) on layer ([A-Za-z0-9]+)} $line -> net layer
    return [list $tool $code $net $layer]
}

set raw "  ERROR  (LVS-402): Short detected at net N12 on layer MET1  "
puts [normalize $raw]
puts [parse_lvs $raw]
```

| Line | Role |
| --- | --- |
| `normalize` | Trim + collapse whitespace with `regsub -all`. |
| `parse_lvs` | Two `regexp` captures → a list of fields. |
| Empty list | Parse failure — caller can `llength` check (Week 3). |

---

## 12. Five teaching examples for your deliverable

### Example A — trim then match

```tcl
set s "  foo.log  "
puts [string match *.log [string trim $s]]
```

### Example B — `format` vs concat

```tcl
set n 7
puts [format "cell_%04d" $n]
```

### Example C — glob is not regexp

```tcl
puts [string match "LVS-*" LVS-402]
# regexp {LVS-*}  is a different language — do not swap them
```

### Example D — BUG then FIX (unbraced regexp)

```tcl
# BUG: regexp ERROR (LVS-402): $line
# FIX:
regexp {ERROR \(LVS-402\):} $line
```

### Example E — BUG then FIX (`append` vs accidental extra args to `puts`)

```tcl
# BUG: puts Hello world
# FIX:
set msg ""
append msg Hello " " world
puts $msg
```

---

## 13. Lab checklist (from the main planner)

- [ ] Proc to normalize messy whitespace to single spaces
- [ ] Parse a tool-log line (code, net, layer) with `scan` **or** `regexp`
- [ ] Rewrite a path or assignment with `regsub`
- [ ] 5–10 sample input lines and expected output
- [ ] Use book patterns only — no extra packages

---

## 14. Deliverable skeleton — `week02_strings.tcl`

```tcl
# week02_strings.tcl
#
# Samples (input → expected):
#   "  a   b  " → "a b"
#   ERROR (LVS-402): ... net N12 on layer MET1 → LVS 402 N12 MET1
#   ...

proc normalize {s} {
    set s [string trim $s]
    # TODO: regsub -all whitespace
    return $s
}

# TODO: parse_lvs, rewrite_path
# TODO: loop over sample lines and puts expected vs got
```

Run:

```bash
tclsh week02_strings.tcl
```

---

## 15. When you get stuck

1. Print the **raw** string with `puts ">$s<"`.  
2. Ask: glob or regexp?  
3. Brace the pattern so Tcl grouping does not eat `()` `[]`.  
4. Then ask what `regexp`/`regsub` does with that pattern.

---

## 16. Readings pointer (optional)

Columbia Part I Ch. 4 *string processing* and/or Tk Book draft Ch. 2 *Strings and Pattern Matching*. Type boxed examples. This file is the lab companion.

*End of Week 2 line-by-line planner.*
