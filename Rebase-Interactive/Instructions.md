# Rebase Interactive

## Description
Sometimes during code review you may get some feedback like

> “Can you please squash your commits together so we get a clean, reversible git history?”.
> 
> “Can you rewrite your commit’s message to describe better the problem it solves, and how it solves it?”.

This could happen when you change your context to address some QA feedback, help on a high priority ticket, etc.

For this, we can use Rebase Interactive `git rebase -i` to solve this feedback.

**More info:** 

[Git Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)

[Git Rebase](https://git-scm.com/docs/git-rebase)

## Example Instructions

### Objective
We want to join and change the last 3 commit messages made on `FIT-1` from the brach `rebase-interactive` to a more meaningful message.

With `rebase interactive` we are going to join the last 3 commits and change the message to a more meaningful one.

### Branches
To avoid changes in `master` branch we are going to use a different branch

* branch: `rebase-interactive`

### Steps

To be able to see the folder where we are going to work we have to go to `rebase-interactive` branch

* `git switch "rebase-interactive"`

Find the commit where we want to start (we are going to change the commits with message "WIP").

* `git log`
* Copy the id of the commit that we want to start or count the commits that we want to change (3)

Use the command

* `git rebase -i HEAD~3`

You will see the editor for the rebase interactive

On the first commit 

* Change pick to reword (r)

On the other commits

* Change pich to fixup (f)

Press scape and save the changes

* :wq

You will see the editor of the firts commit - you choose reword so you will be able to change the message of the commit.

Change the message of the commit

* SOT is super cool

Press scape and save the changes

* :wq

The git rebase command will execute the new commit, joining in the 3 previous commits with the new commit message.

You can check the commit

* git log

You can review your code to be sure that everything is in place.
