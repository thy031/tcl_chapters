# Week 9 planner — line-by-line teaching

**Parent syllabus:** [`../planner.md`](../planner.md)  
**Week page:** [`index.html`](index.html) (Teach tab; run in **`wish`**)  
**Kid goal:** A text viewer **or** a simple drawing.  
**Goal:** One focused viewer — not a widget museum.  
**Shell:** `wish`  
**Deliverable:** `week09_text.tcl` **or** `week09_canvas.tcl` (+ short note on focus/grab if you used a dialog).

Pick **one** track. Skim the other chapter.

---

## 0. Focus, grabs, dialogs (everyone)

```tcl
focus .e
# grab .dlg
# tkwait window .dlg
# grab release .dlg
# update idletasks
```

| Command | Role |
| --- | --- |
| `focus` | Which widget gets keys. |
| `grab` | Modal: events stay in that subtree. |
| `tkwait window` / `variable` / `visibility` | Wait **without** a busy `while` that freezes Tcl. |
| `update` / `update idletasks` | Drain events / geometry; can **re-enter** your script. |

Dialog pattern: build → `grab` → `tkwait` → read result → `destroy`.

---

## 1. Text track — indices, marks, tags

```tcl
text .t -width 60 -height 16 -wrap none
pack .t -fill both -expand 1
.t insert end "ERROR boom\n"
.t insert end "INFO ok\n"
.t tag configure err -foreground red
.t tag add err 1.0 1.end
.t see end
```

| Index | Meaning |
| --- | --- |
| `1.0` | Line 1, character 0 (lines start at 1). |
| `end` | Just after the last char. |
| `insert` | Caret. |
| `end - 1 lines` | Modifiers (see Ch. 18). |

| Tags vs marks |
| --- |
| **Tags** style and bind ranges (`tag configure`, `tag bind`). |
| **Marks** named positions that move with edits. |

```tcl
.t search -forwards ERROR 1.0 end
.t get 1.0 end
.t delete 1.0 end
```

Lab: color ERROR/WARN, search highlight, dump to a file (`open` + `.t get` + `catch`).

---

## 2. Canvas track — items, coords, bind

```tcl
canvas .c -width 300 -height 200 -background white
pack .c
set r [.c create rectangle 20 20 80 80 -fill skyblue -tags box]
.c create text 50 50 -text hi
.c bind box <Button-1> {puts clicked}
.c move box 10 0
```

| Idea | Detail |
| --- | --- |
| Origin | `0,0` is **top-left**. |
| Items | `arc` `line` `oval` `rectangle` `text` `window` … |
| Id vs tag | `create` returns an id; tags group items. |
| Ops | `coords` `itemconfigure` `move` `scale` `delete` `find`. |

Window coords (`%x %y` on the widget) are **not** automatically canvas coords if you have scrolled — convert as in the book.

Optional `postscript` for a print dump.

Lab: ≥2 item types + one `bind` (hello-canvas, annotator, or double-slider idea from the chapter).

---

## 3. Optional Ch. 20

Selections and clipboard — only if your viewer copies text.

---

## 4. Five teaching examples

### A — dialog wait

```tcl
grab .dlg
tkwait window .dlg
```

### B — text tag color

```tcl
.t tag configure err -foreground red
.t tag add err 1.0 1.end
```

### C — canvas bind on a tag

```tcl
.c bind box <Button-1> ClickBox
```

### D — BUG then FIX (`tkwait` forgotten)

```tcl
# BUG: create dialog; immediately read the entry (empty)
# FIX: grab + tkwait then read
```

### E — BUG then FIX (text index `0.0`)

```tcl
# BUG: .t insert 0.0 ...
# FIX: 1.0 is the start
```

---

## 5. Lab checklist (choose one)

- [ ] **Text:** tagged log viewer (severity colors, search highlight, dump to file)
- [ ] **OR canvas:** ≥2 item types and one binding
- [ ] Short note on focus/grab if you used a dialog

---

## 6. Deliverable skeletons

**Text:**

```tcl
#!/usr/bin/env wish
# week09_text.tcl
proc LoadLog {path} { # open + insert + tag ERROR/WARN }
proc Search {pat} { # .t search + tag highlight }
proc Dump {} { # .t get 1.0 end → file, catch }
# TODO: pack text + entry + buttons
```

**Canvas:**

```tcl
#!/usr/bin/env wish
# week09_canvas.tcl
# items: rectangle + text; bind <Button-1> on tag
```

---

## 7. When you get stuck

Text: indices are `line.char`, not Python slices. Canvas: draw on paper first (y grows **down**). Dialogs: if the caller continued too soon, you skipped `tkwait`.

---

## 8. Readings pointer

Tk Book draft Ch. 17, and **either** Ch. 18 **or** Ch. 19 (skim the other). Optional Ch. 20.

*End of Week 9 line-by-line planner.*
