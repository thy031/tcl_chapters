# Week 5 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** Open files and run other programs — glue tools together.  
**Goal:** Scripts that read files and drive other programs.  
**Shell:** real `tclsh` (the Coding lab cannot `exec` or `open` files).  
**Deliverable:** `week05_glue.tcl` + a short README (one wrapped command + how non-zero status was handled with `catch`).

---

## 0. Recap

Week 4 taught `catch`. This week every I/O and `exec` goes through it. Week 3 lists hold filenames from `glob`.

---

## 1. `eval` needs `list`

### Type this

```tcl
set a "two words"
eval puts $a
# vs
eval [list puts $a]
```

| Form | After substitution | Risk |
| --- | --- | --- |
| `eval puts $a` | `puts` + `two` + `words` | Extra arguments. |
| `eval [list puts $a]` | `puts` with **one** arg `two words` | Safe. |

**Rule:** `eval [list cmd $arg1 $arg2]` — never glue untrusted text with quotes.

`subst` does `$` `[]` `\` **without** running a command (`-novariables` / `-nocommands` / `-nobackslashes`). Type the book examples.

---

## 2. `exec` — run other programs

```tcl
if {[catch {exec uname -s} out]} {
    puts "exec failed: $out"
} else {
    puts $out
}
```

| Syntax (in the `exec` args) | Meaning |
| --- | --- |
| `|` / `|&` | Pipeline. |
| `>` `>>` `2>` `>&` `<` `<<` `@` | Redirection (books). |
| trailing `&` | Background. |
| non-zero / stderr | Often a **Tcl error** — `catch` it. |

---

## 3. Channels — `open`, `gets`, `puts`, `read`, `close`

```tcl
set path /tmp/week05_demo.txt
set ch [open $path w]
puts $ch "hello"
close $ch

set ch [open $path r]
set line [gets $ch]
close $ch
puts $line
```

| Command | Role |
| --- | --- |
| `open path w` / `r` | Channel id (a string). |
| `puts $ch ...` | Write to that channel. |
| `gets $ch` | One line (no newline); `-1` at EOF if you use the var form. |
| `read $ch` | Rest of the file. |
| `close $ch` | Always. Pipeline `close` can **error** — `catch` it. |
| `seek` / `tell` / `flush` / `eof` | Random access / buffers. |

`open "|uname -s" r` is a **pipeline channel** — same `gets`/`close` story.

---

## 4. `file` and `glob`

```tcl
puts [file exists /tmp]
puts [file isdirectory /tmp]
puts [file tail /tmp/a/b.tcl]
puts [file dirname /tmp/a/b.tcl]
puts [file extension b.tcl]
puts [glob -nocomplain /tmp/*.txt]
```

| Command | Role |
| --- | --- |
| `file exists` / `isfile` / `isdirectory` | Tests. |
| `file tail` / `dirname` / `rootname` / `extension` | Path pieces. |
| `glob -nocomplain` | Existing names; empty list if none (no error). |

`pwd` / `cd` are **process-wide**. If you `cd` in a walk, save and restore.

---

## 5. FindFile-style walk (Columbia Ch. 9)

```tcl
proc FindFile {dir pattern} {
    set saved [pwd]
    if {[catch {cd $dir}]} {
        return
    }
    foreach f [glob -nocomplain *] {
        if {[file isdirectory $f]} {
            FindFile [file join $saved $f] $pattern
        } elseif {[string match $pattern $f]} {
            puts [file join [pwd] $f]
        }
    }
    cd $saved
}
```

| Line | Why |
| --- | --- |
| `set saved [pwd]` | Restore even if you recurse. |
| `catch {cd $dir}` | Permission / missing dir. |
| `glob -nocomplain *` | Children; folders and files. |
| `string match $pattern $f` | Week 2 glob. |

---

## 6. Run-and-capture lab shape

```tcl
proc run_capture {cmd outFile errFile} {
    global errorInfo
    if {[catch {eval [linsert $cmd 0 exec]} result]} {
        set ch [open $errFile w]
        puts $ch $result
        close $ch
        return 1
    }
    set ch [open $outFile w]
    puts $ch $result
    close $ch
    return 0
}
```

Build the `exec` with `list` / `linsert`, not string concat.

---

## 7. Five teaching examples

### A — safe `eval`

```tcl
eval [list puts $msg]
```

### B — `catch` around `exec`

```tcl
catch {exec false} msg
```

### C — write then read a file

```tcl
set ch [open $p w]; puts $ch hi; close $ch
```

### D — BUG then FIX (`eval $user`)

```tcl
# BUG: eval $user
# FIX: eval [list puts $user]
```

### E — BUG then FIX (forgot `close`)

```tcl
# BUG: set ch [open $p r]; gets $ch; # leak
# FIX: close $ch  (and catch close on pipelines)
```

---

## 8. Lab checklist

- [ ] Run-and-capture (`exec` or `open "|..."`)
- [ ] Write stdout/stderr to files
- [ ] `glob` a directory
- [ ] Recursive FindFile-style walk
- [ ] README: one wrapped command + `catch` on non-zero

---

## 9. Deliverable skeleton — `week05_glue.tcl`

```tcl
# week05_glue.tcl
# Wrapped command: uname -s   (change me)
# Non-zero: catch {exec ...}; write message to err.txt

proc run_capture {args} {
    if {[catch {eval [linsert $args 0 exec]} out]} {
        return [list 1 $out]
    }
    return [list 0 $out]
}

# TODO: glob, FindFile, write files
```

README one paragraph: command, how you detected failure, where output went.

---

## 10. When you get stuck

If `eval` “eats” spaces, you forgot `list`. If a pipeline “worked” then failed later, `catch` the `close`.

---

## 11. Readings pointer

Columbia Part I Ch. 9; Tk Book draft Ch. 6 *Eval* and Ch. 7 *Working with UNIX*.

*End of Week 5 line-by-line planner.*
