"""Shared sidebar + page shell for the Tcl course site."""

WEEKS = [
    (1, "First scripts"),
    (2, "Strings"),
    (3, "Lists & arrays"),
    (4, "If, loops, procs"),
    (5, "Files & other programs"),
    (6, "A whole tiny app"),
    (7, "Windows (Tk)"),
    (8, "Buttons & clicks"),
    (9, "Text or drawing"),
    (10, "Finish the app"),
]


def sidebar(active, prefix):
    home = "index.html" if prefix == "" else "../index.html"
    items = [
        f'<a class="{"active" if active == "home" else ""}" href="{home}">Home<span class="sub">pick a week</span></a>'
    ]
    for n, title in WEEKS:
        if prefix == "":
            url = f"week{n}/index.html"
        else:
            url = f"../week{n}/index.html"
        cls = "active" if active == f"week{n}" else ""
        items.append(
            f'<a class="{cls}" href="{url}">Week {n}<span class="sub">{title}</span></a>'
        )
    quiz = "quiz/index.html" if prefix == "" else "../quiz/index.html"
    items.append(
        f'<a class="{"active" if active == "quiz" else ""}" href="{quiz}">Quiz<span class="sub">check you get it</span></a>'
    )
    return '<nav class="side"><h2>Tcl course</h2>\n' + "\n".join(items) + "\n</nav>\n"


def page(title, active, prefix, body, extra_js=""):
    css = "assets/course.css" if prefix == "" else "../assets/course.css"
    js = "assets/course.js" if prefix == "" else "../assets/course.js"
    scripts = f'<script src="{js}"></script>'
    if extra_js:
        scripts += f'\n  <script src="{extra_js}"></script>'
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <link rel="stylesheet" href="{css}">
</head>
<body>
{sidebar(active, prefix)}
  <div class="main">
{body}
    <footer>Simple Tcl/Tk course · full chapter list is in planner.md</footer>
  </div>
  {scripts}
</body>
</html>
"""
