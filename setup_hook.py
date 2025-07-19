def run_hook(release_path: str, *_):
  with open(f"{release_path}/pwv.js", "w") as file:
    file.write("window.hasPWV = true;\n")

