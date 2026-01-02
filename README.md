# Bisgit

<img alt="biscuit with jelly" src="https://github.com/alexanderdombroski/bisgit/blob/main/public/bisgit.png" width="200px" />

Full Tui coming soon

## Commands

### Commit Tooling

- `git sha <commit>` copies the shortend sha to clipboard (uses HEAD as default)
- `git amend` commits with `--no-edit` and `--amend`. Accepts extra flags too.
- `git fixup <commit>` commits staged changes as aa rebase, and starts an interactive rebase on the target commit if it would not fail.
- `git savepoint` makes a WIP commit with current timestamp.

### Merge Helpers

- `git backmerge <branch>` updates a branch and then merges it into the current branch.
- `git conflict <branch>` shows all conflicts that would occur in a merge.
- `git abort` and `git continue` are useful in conflict resolution situations.
- `git lines <branch> <ignore-file> <ignore-file> ...*` shows the number of lines changed.

### Branching

- `git autoprune` deletes any already merged branches.
- `git rebranch` If conflicts won't exist, create new branch from main and cherry-pick all commits from $
- `git track <branch>` copies a remote branch to a local one and sets the origin upstream.
- `git yank` is a force pull for the current branch. It commits a WIP commit and/or backup branch if commits don't exist in remote. Then it resets the local branch to match the remote. Useful way to handle a collaborator's force push.

### Github

- `git code-review <pr>` checks out a pr and creates a diff similar to github's code review diff viewer.
- `git whoami` shows github username.
- `git languages` prints the percentages of languages for this repo.
- `git coauthor <username>` commits with a co-authorship description.

### Utility

- `git pwd` shows repo root path.
- `git wipe` clears all uncommitted trackable files
- `git files <commit>` shows the files edited by the given commit.
- `git churn` shows you the 25 most edited files.
- `git exclude` and `git include` allows you to ignore files locally without modifying the .gitignore file.
- `git remote-default` shows whether the remote default branch is 'main', 'master', etc.

I turned many of my git aliases into commands. The original aliases are found this [gist](https://gist.github.com/alexanderdombroski/ddac491daeff48c5f1346ba2960462fa).
