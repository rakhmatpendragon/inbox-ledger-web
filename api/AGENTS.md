# AGENTS.md

This repository is an API workspace. The current checkout does not yet include a populated source tree or project documentation, so keep changes conservative and verify the repo state before assuming framework, tooling, or build commands.

## Working rules

- Prefer the smallest possible change that solves the task.
- Do not broaden scope, rename symbols, or refactor unrelated code without a clear reason.
- Before editing, inspect the relevant file(s) and existing conventions in the repository.
- If the repo is missing a manifest or framework, do not invent project-specific commands or dependencies.
- Validate with the narrowest command that checks the changed behavior.

## Project expectations

- Treat this as a backend/API project unless another stack is explicitly present.
- Check for manifests such as `package.json`, `pyproject.toml`, `requirements.txt`, `go.mod`, `Cargo.toml`, `pom.xml`, or similar before running install/build/test commands.
- If the workspace is still empty or sparse, keep instructions and changes minimal and avoid assumptions about tooling.

## Preferred workflow

1. Read the relevant files and confirm the current patterns.
2. Make a targeted patch that matches the repository’s conventions.
3. Run the smallest relevant validation command.
4. Report exact changes and any verification results.

## Good agent behavior

- Prefer surgical edits over large rewrites.
- Keep documentation or instructions short and actionable.
- When a task requires new dependencies, explain the need and prefer the least invasive option.
- If there is uncertainty, inspect the repo state first instead of guessing.
