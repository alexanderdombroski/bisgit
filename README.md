# Bisgit

<img alt="biscuit with jelly" src="https://github.com/alexanderdombroski/bisgit/blob/main/public/bisgit.png" width="200px" />

Run `gi` or `bisgit` for full TUI.

## Commands

### Commit Tooling

- `gi sha <commit>` copies the shortend sha to clipboard (uses HEAD as default)
- `gi amend` commits with `--no-edit` and `--amend`. Accepts extra flags too.
- `gi fixup <commit>` commits staged changes as aa rebase, and starts an interactive rebase on the target commit if it would not fail.
- `gi savepoint` makes a WIP commit with current timestamp.

### Merge Helpers

- `gi backmerge <branch>` updates a branch and then merges it into the current branch.
- `gi conflict <branch>` shows all conflicts that would occur in a merge.
- `gi abort` and `gi continue` are useful in conflict resolution situations.
- `gi files <ref>` shows files of the commit or stash.
- `gi lines <ref> <ref?>` shows the number of lines changed. Use `-v` for verbose output.

### Branching

- `gi autoprune` deletes any already merged branches.
- `gi rebranch` If conflicts won't exist, create new branch from main and cherry-pick all commits from $
- `gi track <branch>` copies a remote branch to a local one and sets the origin upstream.
- `gi yank` is a force pull for the current branch. It commits a WIP commit and/or backup branch if commits don't exist in remote. Then it resets the local branch to match the remote. Useful way to handle a collaborator's force push.

### Github

- `gi code-review <pr>` checks out a pr and creates a diff similar to github's code review diff viewer.
- `gi whoami` shows github username.
- `gi languages` prints the percentages of languages for this repo.
- `gi coauthor <username>` commits with a co-authorship description.

### Utility

- `gi pwd` shows repo root path.
- `gi wipe` clears all uncommitted trackable files
- `gi churn` shows you the 25 most edited files.
- `gi exclude` and `gi include` allows you to ignore files locally without modifying the .gitignore file.
- `gi remote-default` shows whether the remote default branch is 'main', 'master', etc.

I turned many of my git aliases into commands. The original aliases are found this [gist](https://gist.github.com/alexanderdombroski/ddac491daeff48c5f1346ba2960462fa).
