# Cloud session

A cloud session (`CLAUDE_CODE_REMOTE=true`) runs in a fresh Linux container cloned from GitHub, on a branch the session names: the **session branch**. One session carries one pull request; the user starts a new session for the next one. `node_modules` lives in the container itself, so the bind mount from `sandbox-node-modules.md` belongs only to the local sandbox.

## Setup

Every cloud session starts by installing its tooling into the container. The installs land in the home directory and the git-ignored `node_modules`, so the working tree stays clean. Run, with the versions pinned in `devEngines` of `package.json`:

1. **Node.** Use the container's nvm (`$NVM_DIR`), or clone `https://github.com/nvm-sh/nvm.git` into `~/.nvm` when there is none; `nvm install` the pinned Node, then append `export PATH="<that Node's bin directory>:$PATH"` to `~/.bashrc` so every later command runs on it.
2. **pnpm.** `npm install --global pnpm@<pinned version>`.
3. **Dependencies.** `pnpm install --frozen-lockfile`, prefixed with `ELECTRON_SKIP_BINARY_DOWNLOAD=1` when the project depends on `electron`.

Done when, in a fresh shell, `node --version` and `pnpm --version` print the pinned versions, `node_modules/.modules.yaml` exists, and `git status` shows nothing from the setup.

## Branch and pull request

- Commit and push to the session branch, on the user's instruction as everywhere else; open a pull request when the user asks for one.
- Checks that need the host, such as end-to-end tests that launch Electron, stay unrun here: name each one in the hand-back and in the pull request, for the user to run before merging.
- A merged pull request ends the session's work. Report the merge with the next planned step, and leave that step to a new session, which starts its own branch from the latest `main`.
