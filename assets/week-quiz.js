var WEEK_QUIZZES = {
  1: [
    {
      q: "What does this script print, and why?",
      code: "set x 2\nputs \"$x + 2\"",
      choices: [
        "4 — quotes run arithmetic",
        "2 + 2 — $x is substituted, but + is just text",
        "An error — + is illegal in quotes",
        "$x + 2 — quotes block substitution"
      ],
      a: 1,
      why: "Double quotes do $ / [] / \\ substitution, not math. expr is what evaluates 2 + 2."
    },
    {
      q: "What is the function of the braces around the while test and body?",
      code: "set n 0\nwhile {$n < 3} {\n    incr n\n}\nputs $n",
      choices: [
        "They make the loop faster",
        "They delay substitution so while can re-run the test and body each pass",
        "They convert n into a boolean type",
        "They print n three times without incrementing"
      ],
      a: 1,
      why: "Braces group without substituting. while re-evaluates {$n < 3} and the body each iteration. Quotes would freeze $n once at the start."
    },
    {
      q: "What does this proc do when called as [add 10 20]?",
      code: "proc add {x y} {\n    return [expr {$x + $y}]\n}\nputs [add 10 20]",
      choices: [
        "Prints add 10 20 as a string",
        "Defines add, then prints 30",
        "Errors because expr cannot see x and y",
        "Prints 10 20 because return is ignored"
      ],
      a: 1,
      why: "proc add stores a command. [add 10 20] invokes it; expr {$x + $y} adds the two arguments; puts prints 30."
    }
  ],
  2: [
    {
      q: "What do these string commands report for s = Tcl/Tk?",
      code: "set s \"Tcl/Tk\"\nputs [string length $s]\nputs [string index $s 0]\nputs [string range $s 0 2]",
      choices: [
        "5, T, Tcl/ — slash is ignored",
        "6, T, Tcl — length counts every character, range is inclusive",
        "6, c, Tk — index 0 is the last letter",
        "An error — string range needs two words"
      ],
      a: 1,
      why: "length is 6 (T c l / T k). index 0 is T. range 0 2 is inclusive, so Tcl."
    },
    {
      q: "What is the function of trim and tolower here?",
      code: "set raw \"  ERROR  \"\nputs \">[string trim $raw]<\"\nputs [string tolower ERROR]",
      choices: [
        "trim deletes the word ERROR; tolower is unused",
        "trim strips leading/trailing spaces; tolower returns error",
        "trim lowercases; tolower strips spaces",
        "Both commands convert the string to an integer"
      ],
      a: 1,
      why: "string trim removes whitespace at the ends only. string tolower maps letters; it does not trim."
    },
    {
      q: "What is string match for, compared with regexp?",
      code: "puts [string match \"*.log\" \"run.log\"]\nputs [string match \"*.log\" \"run.txt\"]",
      choices: [
        "Both print 1 — glob always matches",
        "1 then 0 — glob * matches any characters, then the suffix .log",
        "They run regular expressions with ( ) groups",
        "string match opens the file named run.log"
      ],
      a: 1,
      why: "string match uses glob (*, ?, [abc]), not regexp. run.log matches *.log; run.txt does not."
    }
  ],
  3: [
    {
      q: "Why does this print different lengths?",
      code: "set a \"two words\"\nputs [string length $a]\nputs [llength [list two words]]",
      choices: [
        "Both are 2 — Tcl has a list type separate from strings",
        "9 vs 2 — string length counts characters; llength counts list elements",
        "Both are 9 — list is only an alias for string length",
        "An error — list cannot hold two words"
      ],
      a: 1,
      why: "\"two words\" is nine characters (including the space). list two words is two elements, so llength is 2."
    },
    {
      q: "What is the function of lappend here?",
      code: "set row [list a b]\nlappend row c\nputs $row",
      choices: [
        "Replace row with the single letter c",
        "Append element c, printing a b c as a proper list",
        "Concatenate without spaces: abc",
        "Create an array named row"
      ],
      a: 1,
      why: "lappend grows a list in place and keeps grouping. Hand-joining with \"$row $x\" can break elements that contain spaces."
    },
    {
      q: "What does this array code store and print?",
      code: "array set rec {name Ada n 3}\nputs $rec(name)\nputs $rec(n)",
      choices: [
        "A list of four unrelated words",
        "A map: name → Ada and n → 3, then prints Ada and 3",
        "Only the last pair; name is discarded",
        "A Tk widget named rec"
      ],
      a: 1,
      why: "array set fills an associative array from name/value pairs. $rec(name) reads one key."
    }
  ],
  4: [
    {
      q: "What does this if-chain print?",
      code: "set n 3\nif {$n < 0} {\n    puts neg\n} elseif {$n == 0} {\n    puts zero\n} else {\n    puts pos\n}",
      choices: [
        "neg — any non-empty n is negative",
        "pos — 3 is not < 0 and not == 0",
        "zero — elseif always wins",
        "Nothing — if needs expr around the whole command"
      ],
      a: 1,
      why: "The tests are re-evaluated because of braces. 3 fails both tests, so the else body runs and prints pos."
    },
    {
      q: "What is the function of this procedure?",
      code: "proc greet {who} {\n    return \"hi $who\"\n}\nputs [greet Ada]",
      choices: [
        "It prints the source of greet",
        "It returns the string hi Ada, which puts then prints",
        "It sets a global named Ada",
        "It errors because Ada is not quoted"
      ],
      a: 1,
      why: "greet takes one argument. Inside the body, $who is Ada. return hands hi Ada back to command substitution."
    },
    {
      q: "Inside a proc, what happens if you read $state(n) without global or upvar?",
      code: "set state(n) 1\nproc bump {} {\n    incr state(n)\n}\nbump",
      choices: [
        "Tcl always finds the global array",
        "The proc looks for a local state unless you declare global state (or upvar)",
        "Arrays cannot live in procs",
        "incr converts the array into a list"
      ],
      a: 1,
      why: "proc locals hide globals. You must global state (or upvar) before using the array inside the procedure."
    }
  ],
  5: [
    {
      q: "What does each puts print for a = two words?",
      code: "set a \"two words\"\nputs $a\nputs \"$a\"\nputs {$a}",
      choices: [
        "All three print $a literally",
        "two words; two words; $a — braces skip substitution",
        "All three print two words — grouping never matters",
        "The last line errors because braces are only for while"
      ],
      a: 1,
      why: "Bare $a and \"$a\" substitute. {$a} is one argument whose characters are dollar, a."
    },
    {
      q: "What is the function of list when used with eval?",
      code: "set cmd puts\nset msg \"hello there\"\neval [list $cmd $msg]",
      choices: [
        "eval ignores list and always splits on spaces",
        "list builds one well-formed command so hello there stays one argument to puts",
        "list opens a file named puts",
        "eval runs expr on the message"
      ],
      a: 1,
      why: "eval concatenates and reparses. list preserves grouping so msg stays a single word even with a space."
    },
    {
      q: "In a glue script, what is open |cmd r / close for?",
      code: "set ch [open \"|ls\" r]\nset data [read $ch]\nclose $ch",
      choices: [
        "It only reads a Tk text widget",
        "It runs a pipeline, reads its output, then close reports the child’s exit/stderr",
        "close always succeeds even if ls failed",
        "open |cmd creates a new interpreter"
      ],
      a: 1,
      why: "open |cmd is a channel to another program. Pipeline errors often surface on close, which is why catch belongs at the glue layer."
    }
  ],
  6: [
    {
      q: "What does this helper return?",
      code: "proc bump {n} {\n    return [expr {$n + 1}]\n}\nputs [bump 3]",
      choices: [
        "3 — expr is skipped inside proc",
        "4 — bump adds one and puts prints it",
        "n + 1 as text",
        "An error — bump needs global n"
      ],
      a: 1,
      why: "n is a proc argument. expr {$n + 1} computes 4; return sends that string back to puts."
    },
    {
      q: "What is the function of info in a small library app?",
      code: "proc ready {} { return 1 }\nputs [info procs ready]\nputs [info exists ready]",
      choices: [
        "info compiles the proc to C",
        "info procs names the command; info exists looks for a variable named ready (not the proc)",
        "Both commands print 1 if the proc exists",
        "info exists deletes the proc"
      ],
      a: 1,
      why: "Introspection is split: procs vs variables. A command named ready does not mean a variable ready exists."
    },
    {
      q: "Why split Checkpoint A into app.tcl + lib/*.tcl with a global state array?",
      code: "# app.tcl\nsource lib/filter.tcl\nfilter::run $argv",
      choices: [
        "source is required for Tk",
        "It keeps a tclsh tool modular: library commands + one state array, no GUI event loop",
        "Every Tcl file must be named app.tcl",
        "lib/*.tcl cannot use catch"
      ],
      a: 1,
      why: "Week 6 proves glue, libraries, and I/O. Tk is delayed so pack/bind bugs do not hide whether the Tcl app works."
    }
  ],
  7: [
    {
      q: "What is the function of this proc in a Tk button?",
      code: "proc run {} {\n    puts run\n}\n# button .b -text Go -command run",
      choices: [
        "It draws the button",
        "It is the callback: the button invokes run, which prints run",
        "puts run packs the widget",
        "wish ignores -command unless it is C"
      ],
      a: 1,
      why: "-command stores a Tcl script. A proc name is safer than an inlined script that might substitute $ too early."
    },
    {
      q: "Why pack the scrollbar before the text widget?",
      code: "pack .sb -side right -fill y\npack .t  -side left -fill both -expand 1",
      choices: [
        "Order never matters in pack",
        "The packer fills remaining cavity in order; the scrollbar must claim space first so it does not vanish",
        "-expand hides the first slave",
        "You must use place for scrollbars"
      ],
      a: 1,
      why: "ExecLog-style layout: pack the slave that must keep its size first. Text expands into what is left."
    },
    {
      q: "What does a widget path like .f.b mean?",
      code: "frame .f\nbutton .f.b -text Ok",
      choices: [
        "A file on disk named .f.b",
        "A button named b whose parent is frame .f (dot is the hierarchy)",
        "Two unrelated top-level windows",
        "A C procedure named frame"
      ],
      a: 1,
      why: "Tk names widgets as a tree from . (the main window). .f.b lives inside .f."
    }
  ],
  8: [
    {
      q: "What does show print, and why?",
      code: "set item apple\nproc show {} {\n    global item\n    puts $item\n}\nset item banana\nshow",
      choices: [
        "apple — procs freeze $item at definition time",
        "banana — show reads the current global when it runs",
        "item — global is only a comment",
        "An error — you cannot set item twice"
      ],
      a: 1,
      why: "The body is braced, so $item is substituted at call time. After set item banana, show prints banana."
    },
    {
      q: "What is wrong with this binding if item changes later?",
      code: "bind .lb <Double-1> { doIt $item }",
      choices: [
        "Double-1 is not a valid event",
        "$item is substituted when bind is created, so doIt gets a stale value",
        "listbox cannot use bind",
        "Braces make the event fire twice"
      ],
      a: 1,
      why: "Call a proc from the binding and read the current selection inside that proc. Do not bake $item into the bind script."
    },
    {
      q: "What is the function of -command on a button vs inlining $x?",
      code: "button .add -text Add -command addItem",
      choices: [
        "-command only works with C callbacks",
        "It names a proc to run on click; the proc can read current variables",
        "It packs the button automatically",
        "It stores the click as a string in .add"
      ],
      a: 1,
      why: "Point -command at a proc. Inlined \"$x\" in the option can capture the wrong value at creation time."
    }
  ],
  9: [
    {
      q: "This string stand-in models a text index. What does it print?",
      code: "set line \"ERROR boom\"\nputs [string range $line 0 4]\nputs [string toupper $line]",
      choices: [
        "ERROR boom twice",
        "ERROR then ERROR BOOM — range 0 4 is five characters",
        "boom then error boom",
        "An error — text indices need a widget"
      ],
      a: 1,
      why: "Inclusive range 0–4 is ERROR. toupper maps the whole string. Real text widgets use indices like 1.0, but the idea is the same: pick a span, then operate."
    },
    {
      q: "What is grab + tkwait for in a file dialog?",
      code: "# grab $dlg\n# tkwait window $dlg",
      choices: [
        "A busy while {1} loop that freezes painting",
        "Hold the dialog modal while the event loop still runs, then continue",
        "after 1000 hoping the user is done",
        "send the filename to another machine"
      ],
      a: 1,
      why: "grab + tkwait wait for that window without blocking the whole interpreter with a tight loop."
    },
    {
      q: "What does a canvas bind typically do?",
      code: "# $c bind box <1> { highlight %x %y }",
      choices: [
        "It packs a scrollbar",
        "It attaches a script to a canvas item (or tag) so a mouse event runs Tcl",
        "It converts the canvas into a text widget",
        "It compiles the item to C"
      ],
      a: 1,
      why: "canvas items have their own bind. %x/%y (and similar) are event substitutions filled when the event fires."
    }
  ],
  10: [
    {
      q: "What does keep return for these two calls?",
      code: "proc keep {line filt} {\n    if {$filt eq \"\"} { return 1 }\n    return [string equal $filt [string range $line 0 [expr {[string length $filt]-1}]]]\n}\nputs [keep \"ERROR x\" ERROR]\nputs [keep \"INFO y\" ERROR]",
      choices: [
        "1 then 1 — every line is kept",
        "1 then 0 — keep lines whose prefix equals filt",
        "0 then 1 — keep only INFO",
        "An error — string equal cannot compare prefixes"
      ],
      a: 1,
      why: "keep is a prefix filter. ERROR x starts with ERROR → 1. INFO y does not → 0. Empty filt keeps everything."
    },
    {
      q: "What is the function of after / fileevent in the capstone?",
      code: "after idle { loadMore }\n# fileevent $ch readable [list gotLine $ch]",
      choices: [
        "They start a new OS thread per script",
        "They register work with the event loop so the UI stays responsive",
        "They replace pack",
        "They are only used from C"
      ],
      a: 1,
      why: "Tk is event-driven. Blocking read/sleep freezes widgets. after and fileevent continue when the loop says it is time."
    },
    {
      q: "Reading Tcl_AppInit: what is a C command’s function?",
      code: "/* Tcl_CreateCommand(interp, \"myCmd\", MyCmdProc, ...) */",
      choices: [
        "You must ship a .so to pass Checkpoint B",
        "Register a C procedure as a normal Tcl command; scripts then call myCmd like puts",
        "C replaces the packer",
        "Tcl_Main is a widget path"
      ],
      a: 1,
      why: "Same evaluation model: create/init the interpreter, register commands, set the result. Implementation language can be C; callers still look like Tcl."
    }
  ]
};

function weekQuizMount(week) {
  var questions = WEEK_QUIZZES[week];
  if (!questions || !window.CourseQuiz) return;
  window.CourseQuiz.mount(
    document.getElementById("week-quiz"),
    questions,
    document.getElementById("week-quiz-score")
  );
}

if (typeof window !== "undefined") {
  window.WeekQuiz = { mount: weekQuizMount };
}
