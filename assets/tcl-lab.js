/**
 * Week-1 Tcl teaching sandbox (browser).
 * Subset: puts, set, expr, incr, while, for, if, proc, return, string (basic), break, continue.
 * Not a full tclsh — use real tclsh for the graded deliverable.
 */
(function (global) {
  "use strict";

  function TclError(message, line) {
    this.name = "TclError";
    this.message = message;
    this.line = line || null;
  }
  TclError.prototype = Object.create(Error.prototype);

  function skipSpace(s, i) {
    while (i < s.length && /[ \t\r\f\v]/.test(s.charAt(i))) i++;
    return i;
  }

  function matchBraced(s, i) {
    // s[i] === '{'
    var depth = 1;
    var j = i + 1;
    while (j < s.length) {
      var c = s.charAt(j);
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === "{") depth++;
      else if (c === "}") {
        depth--;
        if (depth === 0) return { end: j + 1, raw: s.slice(i + 1, j) };
      }
      j++;
    }
    throw new TclError("missing close brace");
  }

  function matchQuoted(s, i) {
    var j = i + 1;
    var out = "";
    while (j < s.length) {
      var c = s.charAt(j);
      if (c === "\\") {
        out += s.charAt(j) + (s.charAt(j + 1) || "");
        j += 2;
        continue;
      }
      if (c === '"') return { end: j + 1, raw: out };
      out += c;
      j++;
    }
    throw new TclError("missing close quote");
  }

  function matchBracket(s, i) {
    var depth = 1;
    var j = i + 1;
    while (j < s.length) {
      var c = s.charAt(j);
      if (c === "\\") {
        j += 2;
        continue;
      }
      if (c === "[") depth++;
      else if (c === "]") {
        depth--;
        if (depth === 0) return { end: j + 1, raw: s.slice(i + 1, j) };
      } else if (c === "{") {
        var b = matchBraced(s, j);
        j = b.end;
        continue;
      } else if (c === '"') {
        var q = matchQuoted(s, j);
        j = q.end;
        continue;
      }
      j++;
    }
    throw new TclError("missing close bracket");
  }

  function splitCommands(script) {
    var cmds = [];
    var i = 0;
    var start = 0;
    var line = 1;
    var startLine = 1;

    function pushCmd(end) {
      var raw = script.slice(start, end).replace(/^[ \t]+|[ \t]+$/g, "");
      if (raw && !/^#/.test(raw)) {
        cmds.push({ text: raw, line: startLine });
      } else if (raw && /^#/.test(raw)) {
        /* comment command — ignore */
      }
      while (end < script.length && (script.charAt(end) === "\n" || script.charAt(end) === ";")) {
        if (script.charAt(end) === "\n") line++;
        end++;
      }
      start = end;
      startLine = line;
      return end;
    }

    while (i < script.length) {
      var c = script.charAt(i);
      if (c === "\n" || c === ";") {
        i = pushCmd(i);
        continue;
      }
      if (c === "\\") {
        if (script.charAt(i + 1) === "\n") {
          i += 2;
          line++;
          continue;
        }
        i += 2;
        continue;
      }
      if (c === "#") {
        // only a comment if at command start
        var before = script.slice(start, i).replace(/[ \t]+/g, "");
        if (before === "") {
          while (i < script.length && script.charAt(i) !== "\n") i++;
          start = i;
          continue;
        }
      }
      if (c === "{") {
        var br = matchBraced(script, i);
        i = br.end;
        continue;
      }
      if (c === '"') {
        var qu = matchQuoted(script, i);
        i = qu.end;
        continue;
      }
      if (c === "[") {
        var bk = matchBracket(script, i);
        i = bk.end;
        continue;
      }
      if (c === "\n") line++;
      i++;
    }
    pushCmd(script.length);
    return cmds;
  }

  function parseWords(cmd) {
    var words = [];
    var i = 0;
    var s = cmd;
    while (true) {
      i = skipSpace(s, i);
      if (i >= s.length) break;
      if (s.charAt(i) === "#") break;
      var c = s.charAt(i);
      if (c === "{") {
        var b = matchBraced(s, i);
        words.push({ kind: "brace", raw: b.raw, source: s.slice(i, b.end) });
        i = b.end;
      } else if (c === '"') {
        var q = matchQuoted(s, i);
        words.push({ kind: "quote", raw: q.raw, source: s.slice(i, q.end) });
        i = q.end;
      } else {
        var start = i;
        while (i < s.length && !/[ \t\n;]/.test(s.charAt(i))) {
          if (s.charAt(i) === "\\") {
            i += 2;
            continue;
          }
          if (s.charAt(i) === "[") {
            var m = matchBracket(s, i);
            i = m.end;
            continue;
          }
          if (s.charAt(i) === "{") {
            var mb = matchBraced(s, i);
            i = mb.end;
            continue;
          }
          i++;
        }
        words.push({ kind: "bare", raw: s.slice(start, i), source: s.slice(start, i) });
      }
    }
    return words;
  }

  function applyBackslash(ch, rest) {
    var map = { n: "\n", t: "\t", r: "\r", a: "\x07", b: "\b", f: "\f", v: "\v" };
    if (map[ch] !== undefined) return { ch: map[ch], eat: 1 };
    if (ch === "\n") return { ch: " ", eat: 1 };
    return { ch: ch, eat: 1 };
  }

  function TclInterp(options) {
    this.vars = Object.create(null);
    this.procs = Object.create(null);
    this.output = [];
    this.trace = [];
    this.debug = !!(options && options.debug);
    this.depth = 0;
    this.breakFlag = false;
    this.continueFlag = false;
    this.returnFlag = false;
    this.returnValue = "";
  }

  TclInterp.prototype.reset = function () {
    this.vars = Object.create(null);
    this.procs = Object.create(null);
    this.output = [];
    this.trace = [];
    this.depth = 0;
    this.breakFlag = false;
    this.continueFlag = false;
    this.returnFlag = false;
    this.returnValue = "";
  };

  TclInterp.prototype.log = function (entry) {
    if (this.debug) this.trace.push(entry);
  };

  TclInterp.prototype.getVar = function (name) {
    if (!(name in this.vars)) throw new TclError("can't read \"" + name + "\": no such variable");
    return this.vars[name];
  };

  TclInterp.prototype.setVar = function (name, value) {
    this.vars[name] = String(value);
    return this.vars[name];
  };

  TclInterp.prototype.substText = function (text, doVars, doCommands, doBackslash) {
    var out = "";
    var i = 0;
    while (i < text.length) {
      var c = text.charAt(i);
      if (doBackslash && c === "\\") {
        var next = text.charAt(i + 1) || "";
        var esc = applyBackslash(next, text.slice(i + 2));
        out += esc.ch;
        i += 1 + esc.eat;
        continue;
      }
      if (doCommands && c === "[") {
        var br = matchBracket(text, i);
        out += this.evalScript(br.raw);
        i = br.end;
        continue;
      }
      if (doVars && c === "$") {
        var name = "";
        var j = i + 1;
        if (text.charAt(j) === "{") {
          var end = text.indexOf("}", j + 1);
          if (end < 0) throw new TclError("missing close brace in variable name");
          name = text.slice(j + 1, end);
          i = end + 1;
        } else {
          while (j < text.length && /[A-Za-z0-9_]/.test(text.charAt(j))) j++;
          name = text.slice(i + 1, j);
          i = j;
        }
        if (!name) {
          out += "$";
          continue;
        }
        out += this.getVar(name);
        continue;
      }
      out += c;
      i++;
    }
    return out;
  };

  TclInterp.prototype.wordValue = function (word) {
    if (word.kind === "brace") return word.raw;
    if (word.kind === "quote") return this.substText(word.raw, true, true, true);
    return this.substText(word.raw, true, true, true);
  };

  TclInterp.prototype.evalMath = function (expr) {
    var expanded = this.substText(expr, true, true, true);
    if (!/^[\d\s+\-*/%().!<>=&|?:]+$/.test(expanded.replace(/true|false|eq|ne/gi, ""))) {
      // allow common expr tokens after stripping numbers — stricter check below
    }
    var safe = expanded.replace(/\s+/g, " ").trim();
    if (/[^0-9eE+\-*/%().!<>=&\s|?:]/.test(safe)) {
      throw new TclError("unsupported expr: " + expr);
    }
    try {
      // eslint-disable-next-line no-new-func
      var result = Function('"use strict"; return (' + safe + ");")();
      if (typeof result === "boolean") return result ? "1" : "0";
      return String(result);
    } catch (e) {
      throw new TclError("invalid expr: " + expr);
    }
  };

  TclInterp.prototype.truthy = function (s) {
    if (s === "" || s === "0" || s === "false") return false;
    return true;
  };

  TclInterp.prototype.callProc = function (name, args) {
    var def = this.procs[name];
    if (!def) throw new TclError("invalid command name \"" + name + "\"");
    if (args.length !== def.args.length) {
      throw new TclError("wrong # args: should be \"" + name + " " + def.args.join(" ") + "\"");
    }
    var prevVars = this.vars;
    this.vars = Object.create(null);
    for (var i = 0; i < def.args.length; i++) {
      this.vars[def.args[i]] = args[i];
    }
    var result = "";
    try {
      result = this.evalScript(def.body);
      if (this.returnFlag) {
        result = this.returnValue;
        this.returnFlag = false;
      }
    } finally {
      this.vars = prevVars;
    }
    return result;
  };

  TclInterp.prototype.evalCommand = function (cmdObj) {
    var words = parseWords(cmdObj.text);
    if (!words.length) return "";

    var grouped = words.map(function (w) {
      return w.source;
    });
    var values = [];
    for (var i = 0; i < words.length; i++) {
      values.push(this.wordValue(words[i]));
    }

    this.log({
      line: cmdObj.line,
      source: cmdObj.text,
      step1_grouping: grouped,
      step2_substitution: values.slice(),
      step3_command: values[0],
      args: values.slice(1),
    });

    var cmd = values[0];
    var args = values.slice(1);

    if (this.procs[cmd]) return this.callProc(cmd, args);

    switch (cmd) {
      case "puts": {
        if (args.length === 0) {
          throw new TclError("wrong # args: should be \"puts ?-nonewline? ?channelId? string\"");
        }
        if (args[0] === "-nonewline") {
          if (args.length < 2) throw new TclError("wrong # args: puts -nonewline needs a string");
          this.output.push({ type: "out", text: args[args.length - 1], nl: false });
          return "";
        }
        if (args.length === 1) {
          this.output.push({ type: "out", text: args[0], nl: true });
          return "";
        }
        if (args.length === 2 && (args[0] === "stdout" || args[0] === "stderr")) {
          this.output.push({ type: "out", text: args[1], nl: true });
          return "";
        }
        throw new TclError(
          "wrong # args: puts got " + args.length + " words — wrap the message in quotes or braces"
        );
      }
      case "set": {
        if (args.length === 1) return this.getVar(args[0]);
        if (args.length === 2) return this.setVar(args[0], args[1]);
        throw new TclError("wrong # args: should be \"set varName ?newValue?\"");
      }
      case "expr": {
        return this.evalMath(args.join(" "));
      }
      case "incr": {
        if (args.length < 1 || args.length > 2) throw new TclError("wrong # args: should be \"incr varName ?increment?\"");
        var cur = args[0] in this.vars ? Number(this.vars[args[0]]) : 0;
        var delta = args.length === 2 ? Number(args[1]) : 1;
        if (!isFinite(cur) || !isFinite(delta)) throw new TclError("expected integer but got \"" + (args[0] in this.vars ? this.vars[args[0]] : "0") + "\"");
        return this.setVar(args[0], String(cur + delta));
      }
      case "return": {
        this.returnFlag = true;
        this.returnValue = args[0] !== undefined ? args[0] : "";
        return this.returnValue;
      }
      case "break":
        this.breakFlag = true;
        return "";
      case "continue":
        this.continueFlag = true;
        return "";
      case "while": {
        if (args.length !== 2) throw new TclError("wrong # args: should be \"while test body\"");
        var last = "";
        while (this.truthy(this.evalMath(args[0]))) {
          last = this.evalScript(args[1]);
          if (this.returnFlag) return last;
          if (this.breakFlag) {
            this.breakFlag = false;
            break;
          }
          if (this.continueFlag) {
            this.continueFlag = false;
            continue;
          }
        }
        return last;
      }
      case "if": {
        // if test body ?elseif test body ...? ?else body?
        var idx = 0;
        while (true) {
          if (idx >= args.length) return "";
          var test = args[idx];
          var body = args[idx + 1];
          if (body === undefined) throw new TclError("wrong # args: no if body");
          if (this.truthy(this.evalMath(test))) return this.evalScript(body);
          idx += 2;
          if (args[idx] === "elseif") {
            idx++;
            continue;
          }
          if (args[idx] === "else") return this.evalScript(args[idx + 1] || "");
          return "";
        }
      }
      case "proc": {
        if (args.length !== 3) throw new TclError("wrong # args: should be \"proc name args body\"");
        var pname = args[0];
        var pargs = args[1].replace(/^\s+|\s+$/g, "").split(/\s+/).filter(Boolean);
        this.procs[pname] = { args: pargs, body: args[2] };
        return "";
      }
      case "string": {
        if (args.length < 2) throw new TclError("wrong # args: should be \"string subcommand ...\"");
        var sub = args[0];
        if (sub === "length") return String(args[1].length);
        if (sub === "index") {
          var ix = args[2] === "end" ? args[1].length - 1 : Number(args[2]);
          return args[1].charAt(ix) || "";
        }
        if (sub === "range") {
          var a = Number(args[2]);
          var b = args[3] === "end" ? args[1].length - 1 : Number(args[3]);
          return args[1].slice(a, b + 1);
        }
        if (sub === "equal") return args[1] === args[2] ? "1" : "0";
        if (sub === "tolower") return args[1].toLowerCase();
        if (sub === "toupper") return args[1].toUpperCase();
        if (sub === "trim") {
          if (args.length === 2) return args[1].replace(/^\s+|\s+$/g, "");
          var chars = args[2];
          var re = new RegExp("^[" + chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "]+|[" + chars.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "]+$", "g");
          return args[1].replace(re, "");
        }
        if (sub === "first") return String(args[2].indexOf(args[1]));
        if (sub === "last") return String(args[2].lastIndexOf(args[1]));
        throw new TclError("unknown string subcommand \"" + sub + "\" in this sandbox");
      }
      default:
        throw new TclError("invalid command name \"" + cmd + "\" (sandbox Week-1 subset)");
    }
  };

  TclInterp.prototype.evalScript = function (script) {
    var cmds = splitCommands(script);
    var result = "";
    for (var i = 0; i < cmds.length; i++) {
      try {
        result = this.evalCommand(cmds[i]);
      } catch (e) {
        if (e instanceof TclError && !e.line) e.line = cmds[i].line;
        throw e;
      }
      if (this.returnFlag || this.breakFlag || this.continueFlag) break;
    }
    return result;
  };

  TclInterp.prototype.run = function (script) {
    this.output = [];
    this.trace = [];
    this.breakFlag = false;
    this.continueFlag = false;
    this.returnFlag = false;
    var result = this.evalScript(script);
    return {
      result: result,
      output: this.output,
      trace: this.trace,
      vars: Object.assign({}, this.vars),
      procs: Object.keys(this.procs),
    };
  };

  var EXAMPLES = [
    {
      id: "hello",
      title: "Hello World",
      code: 'puts Hello\nputs "Hello, world!"\nputs {Hello, world!}',
    },
    {
      id: "vars",
      title: "Variables & quotes vs braces",
      code: 'set name Ada\nputs $name\nputs "Hello, $name!"\nputs {Hello, $name!}',
    },
    {
      id: "expr",
      title: "expr + command substitution",
      code: "set a 3\nset b 4\nputs [expr {$a + $b}]\nputs \"sum is [expr {$a + $b}]\"",
    },
    {
      id: "while",
      title: "while + incr running sum",
      code:
        "set i 0\nset sum 0\nwhile {$i < 5} {\n    set sum [expr {$sum + $i}]\n    incr i\n}\nputs \"sum=$sum i=$i\"",
    },
    {
      id: "proc",
      title: "proc add",
      code: "proc add {a b} {\n    return [expr {$a + $b}]\n}\nputs [add 3 4]\nputs [add 10 20]",
    },
    {
      id: "bug-space",
      title: "Bug: missing space before {",
      code: "# This should error — fix by adding spaces:\n# while{$i < 3}{ incr i }\nset i 0\nwhile {$i < 3} {\n    puts \"i=$i\"\n    incr i\n}",
    },
    {
      id: "deliverable",
      title: "Deliverable skeleton",
      code:
        'puts "Hello, world!"\n\nset a 3\nset b 4\nputs "sum=[expr {$a + $b}]"\n\nset i 0\nset total 0\nwhile {$i < 5} {\n    set total [expr {$total + $i}]\n    incr i\n}\nputs "total=$total"\n\nproc add {x y} {\n    return [expr {$x + $y}]\n}\nputs "add(10,20)=[add 10 20]"',
    },
  ];

  function formatOutput(chunks) {
    var s = "";
    for (var i = 0; i < chunks.length; i++) {
      s += chunks[i].text;
      if (chunks[i].nl) s += "\n";
    }
    return s;
  }

  function renderTrace(trace) {
    if (!trace.length) return "<p class=\"muted\">No commands traced yet. Turn on Debug and Run.</p>";
    return trace
      .map(function (t, n) {
        return (
          '<article class="trace-step">' +
          "<header>#" +
          (n + 1) +
          " · line " +
          t.line +
          "</header>" +
          "<pre class=\"src\">" +
          escapeHtml(t.source) +
          "</pre>" +
          "<div class=\"steps\">" +
          "<div><strong>1 · Grouping</strong><code>" +
          escapeHtml(JSON.stringify(t.step1_grouping)) +
          "</code></div>" +
          "<div><strong>2 · Substitution</strong><code>" +
          escapeHtml(JSON.stringify(t.step2_substitution)) +
          "</code></div>" +
          "<div><strong>3 · Invocation</strong><code>" +
          escapeHtml(t.step3_command + " ← " + JSON.stringify(t.args)) +
          "</code></div>" +
          "</div></article>"
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mountLab(root, options) {
    if (!root) return;
    options = options || {};
    var examples = options.examples && options.examples.length ? options.examples : EXAMPLES;
    var noteHtml =
      options.note ||
      "Browser sandbox for teaching (puts, set, expr, incr, while, if, proc, return, string basics). " +
        "For your graded script, also run with real <code>tclsh</code> or <code>wish</code>. " +
        "Line-by-line notes are in the <strong>Teach</strong> tab.";
    root.innerHTML =
      '<div class="tcl-lab">' +
      '<div class="tcl-lab-toolbar">' +
      '<label class="tcl-ex">Example <select id="tcl-example"></select></label>' +
      '<button type="button" class="tcl-btn primary" id="tcl-run">Run ▶</button>' +
      '<button type="button" class="tcl-btn" id="tcl-debug-run">Debug</button>' +
      '<button type="button" class="tcl-btn" id="tcl-reset">Reset</button>' +
      '<button type="button" class="tcl-btn" id="tcl-clear-out">Clear output</button>' +
      '<span class="tcl-hint">Ctrl+Enter to run</span>' +
      "</div>" +
      '<div class="tcl-lab-grid">' +
      '<div class="tcl-pane">' +
      "<h3>Editor</h3>" +
      '<textarea id="tcl-editor" spellcheck="false" aria-label="Tcl editor"></textarea>' +
      "</div>" +
      '<div class="tcl-pane">' +
      "<h3>Output</h3>" +
      '<pre id="tcl-output" class="tcl-out" aria-live="polite"></pre>' +
      "<h3>Variables</h3>" +
      '<pre id="tcl-vars" class="tcl-out small"></pre>' +
      "</div>" +
      "</div>" +
      '<div class="tcl-pane trace-pane">' +
      "<h3>Debug — 3-step evaluation</h3>" +
      '<div id="tcl-trace"></div>' +
      "</div>" +
      '<p class="tcl-note">' +
      noteHtml +
      "</p>" +
      "</div>";

    var sel = root.querySelector("#tcl-example");
    examples.forEach(function (ex) {
      var opt = document.createElement("option");
      opt.value = ex.id;
      opt.textContent = ex.title;
      sel.appendChild(opt);
    });

    var editor = root.querySelector("#tcl-editor");
    var out = root.querySelector("#tcl-output");
    var varsEl = root.querySelector("#tcl-vars");
    var traceEl = root.querySelector("#tcl-trace");
    var interp = new TclInterp({ debug: true });

    function loadExample(id) {
      var ex = examples.find(function (e) {
        return e.id === id;
      });
      if (ex) editor.value = ex.code;
    }
    loadExample(examples[0].id);

    function showVars(vars) {
      var keys = Object.keys(vars).sort();
      if (!keys.length) {
        varsEl.textContent = "(none)";
        return;
      }
      varsEl.textContent = keys
        .map(function (k) {
          return k + " = " + JSON.stringify(vars[k]);
        })
        .join("\n");
    }

    function run(debug) {
      interp.debug = !!debug;
      try {
        // Keep procs/vars across runs unless reset — for lab UX, re-run from clean state each time
        interp.reset();
        interp.debug = !!debug;
        var res = interp.run(editor.value);
        out.textContent = formatOutput(res.output);
        if (res.result !== "" && res.output.length === 0) {
          out.textContent = (out.textContent ? out.textContent + "\n" : "") + "⇒ " + res.result;
        }
        out.classList.remove("err");
        showVars(res.vars);
        traceEl.innerHTML = debug
          ? renderTrace(res.trace)
          : '<p class="muted">Click <strong>Debug</strong> to see grouping → substitution → invocation for each command.</p>';
      } catch (e) {
        out.classList.add("err");
        var loc = e.line ? " (line " + e.line + ")" : "";
        out.textContent = "Error" + loc + ": " + (e.message || e);
        showVars(interp.vars);
        traceEl.innerHTML = interp.debug ? renderTrace(interp.trace) : "";
      }
    }

    sel.addEventListener("change", function () {
      loadExample(sel.value);
    });
    root.querySelector("#tcl-run").addEventListener("click", function () {
      run(false);
    });
    root.querySelector("#tcl-debug-run").addEventListener("click", function () {
      run(true);
    });
    root.querySelector("#tcl-reset").addEventListener("click", function () {
      interp.reset();
      out.textContent = "";
      out.classList.remove("err");
      varsEl.textContent = "(none)";
      traceEl.innerHTML = "";
    });
    root.querySelector("#tcl-clear-out").addEventListener("click", function () {
      out.textContent = "";
      out.classList.remove("err");
    });
    editor.addEventListener("keydown", function (ev) {
      if ((ev.ctrlKey || ev.metaKey) && ev.key === "Enter") {
        ev.preventDefault();
        run(false);
      }
    });

    showVars({});
    traceEl.innerHTML =
      '<p class="muted">Load an example, then <strong>Run</strong> or <strong>Debug</strong>. Full teaching text is in the <strong>Teach</strong> tab.</p>';
  }

  global.TclLab = {
    mount: mountLab,
    TclInterp: TclInterp,
    EXAMPLES: EXAMPLES,
  };
})(typeof window !== "undefined" ? window : globalThis);
