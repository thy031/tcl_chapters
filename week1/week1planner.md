# Week 1 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab + **Coding lab**)  
**Kid goal:** Say hello and learn how Tcl reads a line.  
**Goal:** Run the interpreter; master command syntax, grouping, and substitution.  
**Shell:** `tclsh` only (no Tk this week) — or the in-page Coding lab on [`index.html`](index.html).  
**Deliverable:** `week01_basics.tcl` (see end of this file).

How to use this file: read a short idea → type the example into `tclsh` **or** the Week 1 Coding lab → read the line-by-line notes → break it on purpose → fix it. Do not only read. In the Coding lab, use **Debug** to see grouping → substitution → invocation.

---

## 0. Start the interpreter

```bash
tclsh
```

You should see a prompt like `%`. Type Tcl there. Exit with:

```tcl
exit
```

Or run a script file later with:

```bash
tclsh week01_basics.tcl
```

---

## 1. The big idea (before any code)

Tcl does **not** work like Python or C. Almost everything is a **command**:

```text
commandName  arg1  arg2  arg3 ...
```

Words are separated by **spaces**. A command ends at a **newline** or a **semicolon** `;`.

Every line is processed in **exactly three steps**:

1. **Grouping** — decide where arguments start/end (`{}`, `""`, spaces).
2. **Substitution** — fill in `$var`, `[command]`, and `\...`.
3. **Invocation** — run the command with the finished argument strings.

**Single-pass rule:** after substitution, Tcl does **not** re-group. If `$x` contains spaces, those spaces are already *inside* one argument (or they split words only if you used bare `$x` without quotes — see §5).

When something looks weird, draw those three steps on paper before adding more commands.

---

## 2. Hello World — `puts`

### Type this

```tcl
puts Hello
puts "Hello, world!"
puts {Hello, world!}
```

### Line-by-line

| Line | What happens |
| --- | --- |
| `puts Hello` | Command name is `puts`. One argument: the string `Hello`. `puts` writes it to stdout and adds a newline. |
| `puts "Hello, world!"` | Quotes **group** two words into **one** argument so the space does not start a new argument. Then `puts` prints that one string. |
| `puts {Hello, world!}` | Braces also group into one argument. Here `$`, `[]`, and most `\` are **not** substituted inside `{}`. Same printed result as the quoted line for this plain text. |

### Try a bug

```tcl
puts Hello, world!
```

Tcl sees **three** arguments after `puts` (`Hello,` `world!` — wait: actually `Hello,` and `world!` if comma sticks to Hello… depending on commas). Safer demo of the bug:

```tcl
puts Hello world
```

**Why it fails / misbehaves:** `puts` expects one main string (optional stream first). Extra words confuse it. Fix: quote or brace the message.

---

## 3. Variables — `set` and `$`

### Type this

```tcl
set name Ada
puts $name
puts "Hello, $name!"
puts {Hello, $name!}
set name
```

### Line-by-line

| Line | What happens |
| --- | --- |
| `set name Ada` | Command `set`. Argument 1: variable name `name`. Argument 2: value `Ada`. Creates/updates the variable. `set` also **returns** the value. |
| `puts $name` | Grouping: words `puts` and `$name`. Substitution: `$name` → `Ada`. Invocation: `puts` with argument `Ada`. |
| `puts "Hello, $name!"` | Inside `"..."`, `$name` **is** substituted → `Hello, Ada!`. |
| `puts {Hello, $name!}` | Inside `{...}`, `$name` is **literal text**. Prints `Hello, $name!` with a dollar sign visible. |
| `set name` | `set` with only the name **reads** the variable and returns its value (here `Ada`). |

### Brace form of variable names

```tcl
set x 10
puts ${x}toys
```

| Piece | Meaning |
| --- | --- |
| `${x}` | Variable name is clearly `x` (not `xtoys`). |
| `toys` | Plain text stuck after the value → prints `10toys`. |

Without braces, `$xtoys` would look for a variable named `xtoys`.

---

## 4. Math — `expr` (only place that does arithmetic)

### Type this

```tcl
set a 3
set b 4
puts [expr {$a + $b}]
puts "sum is [expr {$a + $b}]"
```

### Line-by-line

| Line / piece | What happens |
| --- | --- |
| `set a 3` | Store string `3` in `a`. (Everything is a string; `expr` will treat it as a number.) |
| `[expr {$a + $b}]` | **Command substitution:** run `expr` with one argument `{ $a + $b }` (after grouping). Inside the braced expr body, Tcl still substitutes `$a` and `$b` *as part of expr’s rules for that form* — standard safe style is `expr {$a + $b}`. Result string `7` replaces the whole `[...]`. |
| `puts [expr {$a + $b}]` | After substitution becomes `puts 7`. |
| Nested in quotes | Quotes allow `$` and `[]`. So `"sum is [expr ...]"` becomes `sum is 7`. |

### Important contrast

```tcl
puts 1+2
puts [expr {1+2}]
```

| Line | Result | Why |
| --- | --- | --- |
| `puts 1+2` | prints `1+2` | No `expr` — just characters. |
| `puts [expr {1+2}]` | prints `3` | `expr` evaluates math. |

Prefer `expr {...}` with braces around the expression (course rule: braces for code bodies).

---

## 5. Grouping deep dive — `{}` vs `""`

### Type this

```tcl
set x "two words"
puts $x
puts "$x"
puts {$x}
```

### Line-by-line

| Line | After substitution | Meaning |
| --- | --- | --- |
| `puts $x` | Often becomes two words `two` and `words` | Bare `$x` can **split** into multiple arguments if the value has spaces. Easy source of bugs. |
| `puts "$x"` | one argument `two words` | Quotes keep it **one** argument after `$` is filled in. |
| `puts {$x}` | one argument `$x` | No substitution — literal dollar-x. |

**Rule of thumb for Week 1:**  
- Code bodies (`while`, `proc`, `expr` args): use `{...}`.  
- Text that needs `$` or `[]`: use `"..."`.  
- Prefer `"$x"` over bare `$x` when printing or passing values that might contain spaces.

---

## 6. Command substitution — `[]`

### Type this

```tcl
set n [expr {2 * 5}]
puts "n is $n"
puts "length of hello is [string length hello]"
```

### Line-by-line

| Piece | What happens |
| --- | --- |
| `[expr {2 * 5}]` | Nested script runs first; result `10` replaces the brackets. |
| `set n ...` | Variable `n` becomes `10`. |
| `[string length hello]` | `string` is a command; subcommand `length`; argument `hello` → `5`. |

**Order inside one line:** innermost `[...]` runs when substitutions happen (step 2), then the outer command runs (step 3).

---

## 7. Backslash — `\`

### Type this

```tcl
puts "line1\nline2"
puts "quote: \"hi\""
puts "dollar: \$name"
puts "path: C:\\temp"
```

### Line-by-line

| Escape | Meaning |
| --- | --- |
| `\n` | newline |
| `\"` | a literal `"` inside a quoted string |
| `\$` | literal `$` (no variable substitution) |
| `\\` | one backslash |

Inside `{...}`, most of these stay literal (braces disable normal substitution). Use quotes when you want `\n` to mean newline.

**Line continuation:**

```tcl
puts "hello \
world"
```

`\` before the newline joins the next line; surrounding whitespace collapses to a space → often prints `hello world`.

---

## 8. Comments — `#`

### Type this

```tcl
# This is a full-line comment
set x 1 ;# comment after a command
```

### Line-by-line

| Form | OK? | Why |
| --- | --- | --- |
| `# comment` at start of line | Yes | `#` sits where a **command name** is expected. |
| `set x 1 ;# comment` | Yes | After `;`, a new command position starts; `#` begins a comment command. |
| `set x 1 # bad` | No | `#` is not in command position — Tcl thinks `#` / `bad` are extra arguments to `set`. |

### Intentional bug (lab)

```tcl
set x 1 # mid-line comment wrong
```

Fix: use `;#` or put `#` on its own line.

---

## 9. Loops — `while` and `incr`

### Type this

```tcl
set i 0
set sum 0
while {$i < 5} {
    set sum [expr {$sum + $i}]
    incr i
}
puts "sum=$sum i=$i"
```

### Line-by-line

| Line | What happens |
| --- | --- |
| `set i 0` | Loop counter. |
| `set sum 0` | Running total. |
| `while {$i < 5} { ... }` | Command `while`. Arg1: test expression in braces (not substituted until `while` evaluates it each time). Arg2: body in braces (not run until the loop runs). |
| `{$i < 5}` | Each iteration, `while` evaluates this as a boolean (via expr-like rules). True while `i` is 0..4. |
| `set sum [expr {$sum + $i}]` | Add current `i` into `sum`. |
| `incr i` | Add 1 to integer variable `i` (default +1). Shortcut for `set i [expr {$i + 1}]`. |
| After loop | `sum` is `0+1+2+3+4` = `10`; `i` is `5`. |

### Why the body must be braced

If you wrote the body in quotes, `$i` and `$sum` could be substituted **once** when the `while` line is first parsed — wrong. Braces **defer** substitution until each iteration.

### Space before `{` (common Week 1 bug)

```tcl
# WRONG — missing space: Tcl may see a weird command name
while{$i < 5}{
    incr i
}
```

```tcl
# RIGHT — space separates command name from arguments
while {$i < 5} {
    incr i
}
```

---

## 10. Procedures — `proc`

### Type this

```tcl
proc add {a b} {
    return [expr {$a + $b}]
}
puts [add 3 4]
puts [add 10 20]
```

### Line-by-line

| Line | What happens |
| --- | --- |
| `proc add {a b} { ... }` | Defines a **new command** named `add`. |
| `{a b}` | Argument list: two parameters, `a` and `b`. Braced so the list is one grouping unit. |
| Body `{ return [expr {$a + $b}] }` | Stored as a script string. Not executed at definition time (braces). |
| `return [...]` | Exit the proc, giving that string as the result. |
| `puts [add 3 4]` | Calls `add` with `a=3`, `b=4`; result `7` printed. |

### Two-argument proc without `return` (also fine)

The value of the **last command** in the body is the result if you omit `return`:

```tcl
proc add2 {a b} {
    expr {$a + $b}
}
puts [add2 1 2]
```

---

## 11. Putting it together — annotated mini script

Save as `demo_week1.tcl` and run `tclsh demo_week1.tcl`, or paste block by block.

```tcl
# demo_week1.tcl — every line explained below

puts "=== Week 1 demo ==="

set name "Ada"
puts "Hello, $name!"

set a 3
set b 5
puts "a+b = [expr {$a + $b}]"

set i 0
set sum 0
while {$i <= 3} {
    set sum [expr {$sum + $i}]
    incr i
}
puts "sum 0..3 = $sum"

proc greet {who} {
    return "hi, $who"
}
puts [greet $name]
```

### Line-by-line walkthrough

| Line | Role |
| --- | --- |
| `# demo_week1...` | Comment (command position). |
| `puts "=== ... ==="` | Print a banner; quotes keep spaces as one argument. |
| `set name "Ada"` | Assign string with quotes (optional for a single word). |
| `puts "Hello, $name!"` | Quote group + variable substitution. |
| `set a 3` / `set b 5` | Numeric strings for later `expr`. |
| `puts "a+b = [expr {$a + $b}]"` | Nested command substitution inside a quoted string. |
| `set i 0` / `set sum 0` | Loop state. |
| `while {$i <= 3} { ... }` | Deferred test + body; both braced. |
| `set sum [expr {$sum + $i}]` | Update total using command substitution. |
| `incr i` | Counter bump. |
| `puts "sum 0..3 = $sum"` | Show result (`6`). |
| `proc greet {who} { ... }` | New command; body braced. |
| `return "hi, $who"` | Build result with substitution inside quotes **when the proc runs**. |
| `puts [greet $name]` | Call proc; print `hi, Ada`. |

---

## 12. Five teaching examples for your deliverable

Include these (or equivalents) in the comment block / script of `week01_basics.tcl`. Two must be bugs you hit and fixed.

### Example A — quotes substitute, braces do not

```tcl
set x 7
puts "x=$x"    ;# → x=7
puts {x=$x}    ;# → x=$x
```

### Example B — command substitution

```tcl
puts [expr {2+2}]   ;# → 4
```

### Example C — safe loop body braces

```tcl
set n 0
while {$n < 3} {
    puts "n=$n"
    incr n
}
```

### Example D — BUG then FIX (missing space before brace)

```tcl
# BUG:
# while{$n < 3}{ incr n }

# FIX:
while {$n < 3} {
    incr n
}
```

### Example E — BUG then FIX (comment not in command position)

```tcl
# BUG:
# set x 1 # oops

# FIX:
set x 1 ;# ok
```

---

## 13. Lab checklist (from the main planner)

- [ ] Interactive `tclsh`: `puts`, `set`, `expr`
- [ ] `while` + `incr` running sum
- [ ] One `proc` taking two numeric arguments
- [ ] Break at least one script with wrong braces / bad `#`, then fix it
- [ ] Write one-page notes *or* top-of-file comments: 3-step model + five examples (two bugs)

---

## 14. Deliverable skeleton — `week01_basics.tcl`

Create this file in `tcl_learning/week1/` (or wherever you keep weekly labs). Fill the comment block in your own words.

```tcl
# week01_basics.tcl
#
# Tcl 3-step evaluation model:
#   1) Grouping   — decide argument boundaries ({}, "", spaces)
#   2) Substitution — $, [], \
#   3) Invocation — run the command with finished string args
# Single-pass: substituted text is NOT re-grouped.
#
# Five examples (include two bugs+fixes):
#   1) ...
#   2) ...
#   3) ...
#   4) BUG: ...  FIX: ...
#   5) BUG: ...  FIX: ...

puts "Hello, world!"

set a 3
set b 4
puts "sum=[expr {$a + $b}]"

set i 0
set total 0
while {$i < 5} {
    set total [expr {$total + $i}]
    incr i
}
puts "total=$total"

proc add {x y} {
    return [expr {$x + $y}]
}
puts "add(10,20)=[add 10 20]"
```

Run:

```bash
tclsh week01_basics.tcl
```

---

## 15. When you get stuck

1. Write the line.  
2. Underline each argument after **grouping**.  
3. Rewrite the line after **substitution**.  
4. Only then ask what the **command** does with those strings.

Most Week 1 bugs are braces vs quotes, missing space before `{`, or `#` in the wrong place — not “wrong algorithms.”

---

## 16. Readings pointer (optional; books not required to use this file)

If you have the PDFs: Columbia Part I Ch. 1–2 and/or Tk Book draft Ch. 1. Type every boxed example. This `week1planner.md` is the line-by-line companion for the lab, not a replacement for those chapters when you have them.

*End of Week 1 line-by-line planner.*
