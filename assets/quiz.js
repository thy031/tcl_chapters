var QUESTIONS = [
  {
    q: "You type: set x 2; puts \"$x + 2\". What should you expect, and why?",
    choices: [
      "4, because Tcl evaluates math inside double quotes",
      "2 + 2, because quotes substitute $x but do not run expr",
      "An error, because + is illegal in quotes",
      "2 + 2 becomes 4 after command substitution"
    ],
    a: 1,
    why: "Double quotes do grouping and $ / [] / \\ substitution, not arithmetic. Math happens only when expr (or a command that calls it) runs."
  },
  {
    q: "Why does while {$x < 10} { incr x } use braces on both the test and the body?",
    choices: [
      "Braces make the loop faster",
      "So while sees the unevaluated script and can re-evaluate it each iteration",
      "Braces turn the test into a boolean type",
      "Without braces, incr would not exist"
    ],
    a: 1,
    why: "If you quoted the test with \"\", $x would be substituted once before while started. Braces delay substitution so each pass sees a fresh test and body."
  },
  {
    q: "set a {one two}; lappend a $b where b is {three four}. Why is list-aware lappend safer than set a \"$a $b\"?",
    choices: [
      "lappend is the only way to grow a string",
      "String concatenation can break grouping if an element has spaces; lappend preserves list structure",
      "\"$a $b\" cannot run in tclsh",
      "lappend copies arrays, not lists"
    ],
    a: 1,
    why: "A Tcl list is a string that obeys command grouping. Hand-joining with spaces does not quote elements that themselves contain whitespace."
  },
  {
    q: "A proc uses a global array state. Inside the proc you write puts $state(count) with no global command. What happens conceptually?",
    choices: [
      "Tcl automatically finds the global array",
      "You read a local variable named state unless you global/upvar it",
      "Arrays are always global",
      "Tk injects the array from the widget name"
    ],
    a: 1,
    why: "proc locals hide globals. You must declare global state (or upvar) before using the array inside the procedure."
  },
  {
    q: "You need a proc to update the caller’s array. Why is upvar used instead of returning a huge string?",
    choices: [
      "upvar is required for all arrays",
      "Call-by-name lets the proc modify the caller’s array in place without copying it as a return value",
      "upvar converts lists to arrays",
      "Returning strings is illegal in Tcl"
    ],
    a: 1,
    why: "upvar aliases a local name to a variable in another scope. That is how the books pass arrays by name."
  },
  {
    q: "eval $cmd $args is blowing up because args contains several words. What is the understanding fix?",
    choices: [
      "Switch to double quotes around the whole eval",
      "Build one well-formed command with list (or concat correctly) so grouping survives eval",
      "Replace eval with subst always",
      "Wrap args in extra braces by hand until it works"
    ],
    a: 1,
    why: "eval concatenates and reparses. list produces a single argument whose grouping is preserved when eval parses it again."
  },
  {
    q: "A pipeline opened with open |cmd r looks fine, but close $ch raises an error. What should you understand happened?",
    choices: [
      "close always errors in Tcl 8",
      "The child wrote stderr or exited non-zero; Tcl reports that when the channel is closed",
      "You forgot pwd",
      "glob failed earlier"
    ],
    a: 1,
    why: "Columbia Ch. 9: pipeline status and stderr are surfaced on close. catch around close is part of glue-layer error handling."
  },
  {
    q: "Why does the programme keep Tk out of Checkpoint A (Week 6)?",
    choices: [
      "Tk cannot read files",
      "So you prove Tcl glue, libraries, and I/O without mixing GUI event-loop issues",
      "wish is deprecated",
      "The guestbook example forbids widgets forever"
    ],
    a: 1,
    why: "Weeks 1–6 are tclsh on purpose. Tk adds bind/scope and pack problems that hide whether you actually learned lists, files, and procs."
  },
  {
    q: "You pack a text widget then a scrollbar, and the scrollbar vanishes when the window shrinks. What idea from the packer are you missing?",
    choices: [
      "Text widgets cannot share a window with scrollbars",
      "Packing order and the cavity model: pack the scrollbar first (slave that must keep its size)",
      "You must use place, not pack",
      "-expand always hides the last slave"
    ],
    a: 1,
    why: "The packer allocates remaining cavity in order. The book’s ExecLog pattern packs the scrollbar first so it keeps space when the text expands."
  },
  {
    q: "bind .lb <Double-1> { doIt $item } captures the wrong item later. What went wrong?",
    choices: [
      "Double-1 is not a valid event",
      "The $item was substituted when the binding was created, not when the event fired",
      "listbox cannot use bind",
      "You needed a C callback"
    ],
    a: 1,
    why: "Bindings are scripts. $ substitution at bind-time freezes the current value. Call a proc and read the current selection inside it."
  },
  {
    q: "A modal file dialog must not return until the user picks a name. Which mechanism matches that understanding?",
    choices: [
      "busy-wait with while {1} { }",
      "grab the dialog and tkwait until it is done, then release",
      "after 1000 and hope",
      "send to another wish"
    ],
    a: 1,
    why: "Ch. 17: grab + tkwait let the event loop keep running while your script waits for that window. A tight loop would freeze the UI."
  },
  {
    q: "reading Tcl_AppInit is required in Week 10 even if you do not compile. What understanding should you walk away with?",
    choices: [
      "You must ship a .so to pass Checkpoint B",
      "A C command is just another Tcl command: register it on the interpreter, then scripts call it like puts",
      "C replaces pack",
      "Tcl_Main is a Tk widget"
    ],
    a: 1,
    why: "The C API map is: create/init interpreter, register command procedures, manage the result, optionally eval scripts. Same evaluation model, different implementation language."
  },
  {
    q: "string equal $a $b vs expr {$a == $b} for two numeric-looking strings. What is the conceptual difference?",
    choices: [
      "They are identical in all Tcl versions",
      "expr == may coerce to numbers; string comparison stays string-wise — pick the command that matches the meaning you want",
      "expr cannot compare strings",
      "string equal always converts to int"
    ],
    a: 1,
    why: "Tcl stores strings. expr’s operators can treat operands as numbers. Using the wrong comparator is a meaning bug, not just a style issue."
  },
  {
    q: "You glob a tree with FindFile-style recursion and forget to cd back after a failed subdirectory. What understanding did you skip?",
    choices: [
      "glob sorts results",
      "The process current directory is process-wide state; catch and restore pwd or you search the wrong place next",
      "cd cannot fail",
      "recursion is illegal in Tcl"
    ],
    a: 1,
    why: "The Columbia FindFile example saves pwd, uses catch around cd, and restores the directory. That is about process state, not just file names."
  },
  {
    q: "after idle and fileevent exist so a Tk app can stay responsive. What is the idea?",
    choices: [
      "They spawn OS threads for every script",
      "They register work with the event loop instead of blocking the whole UI on a long read or sleep",
      "They replace pack",
      "They are only for C extensions"
    ],
    a: 1,
    why: "Tk is event-driven. Blocking open/read/sleep freezes widgets. after and fileevent continue the script when the event loop says the resource is ready."
  }
];

function escapeQuiz(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mountQuiz(root, questions, scoreEl) {
  if (!root) return;
  root.innerHTML = "";
  questions.forEach(function (item, i) {
    var box = document.createElement("div");
    box.className = "quiz-q card";
    var html = "<p><strong>Q" + (i + 1) + ".</strong> " + escapeQuiz(item.q) + "</p>";
    if (item.code) {
      html += '<pre class="code quiz-code"><code>' + escapeQuiz(item.code) + "</code></pre>";
    }
    box.innerHTML = html;
    item.choices.forEach(function (c, j) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-opt";
      b.textContent = c;
      b.addEventListener("click", function () {
        if (box.getAttribute("data-done")) return;
        box.setAttribute("data-done", "1");
        var ok = j === item.a;
        b.classList.add(ok ? "correct" : "wrong");
        box.querySelectorAll(".quiz-opt")[item.a].classList.add("correct");
        box.setAttribute("data-ok", ok ? "1" : "0");
        var note = document.createElement("p");
        note.className = "why";
        note.innerHTML = "<strong>Why.</strong> " + escapeQuiz(item.why);
        box.appendChild(note);
      });
      box.appendChild(b);
    });
    root.appendChild(box);
  });
  if (scoreEl) {
    var btn = document.createElement("p");
    btn.innerHTML = '<button type="button" class="primary">Score quiz</button>';
    btn.querySelector("button").addEventListener("click", function () {
      scoreMountedQuiz(root, questions, scoreEl);
    });
    root.appendChild(btn);
  }
}

function scoreMountedQuiz(root, questions, out) {
  var nodes = root.querySelectorAll(".quiz-q");
  var answered = 0;
  var correct = 0;
  nodes.forEach(function (n) {
    if (n.getAttribute("data-done")) {
      answered += 1;
      if (n.getAttribute("data-ok") === "1") correct += 1;
    }
  });
  if (answered < questions.length) {
    out.textContent = "Answer all " + questions.length + " questions first (" + answered + " done).";
    return;
  }
  var pass = questions.length <= 3 ? correct === questions.length : correct >= 12;
  var msg = pass
    ? "You are reading what the code does, not only the command names."
    : "Re-read the Why notes and try the Practice tab examples again.";
  out.innerHTML = '<p class="score">Score: ' + correct + " / " + questions.length + "</p><p>" + msg + "</p>";
}

function renderQuiz() {
  mountQuiz(document.getElementById("quiz"), QUESTIONS);
}

function scoreQuiz() {
  scoreMountedQuiz(document.getElementById("quiz"), QUESTIONS, document.getElementById("score"));
}

if (typeof window !== "undefined") {
  window.CourseQuiz = { mount: mountQuiz, score: scoreMountedQuiz };
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("quiz") && typeof QUESTIONS !== "undefined") renderQuiz();
});
