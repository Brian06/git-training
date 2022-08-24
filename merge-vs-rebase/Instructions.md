# Merge vs Rebase

## Description
Understand two different ways to incorporate/integrate changes from one branch to another branch.

**More info:** 

[Git Merge](https://git-scm.com/docs/git-merge)

[Git Rebase](https://git-scm.com/docs/git-rebase)

## Example Instructions

### Objective
We want incorporate three different features (commits) from three different branches into our master branch (`merge-vs-rebase-master).

Making use of `git merge` and `git rebase` we will be able to add those changes to the master branch, deal with some conflicts and check the commit history changes.

### Branches
To avoid changes in `master` branch we are going to use a different branch

* main branch: `merge-vs-rebase-master`
* Feature 1: `feature-1`
* Feature 1.1: `feature-1.1` (Created from `feature-1` branch)
* Feature 2: `feature-2`
### Steps
Let's apply the changes in feature branches to base branch 

To be able to see the folder where we are going to work we have to go to `merge-vs-rebase-master` branch

* `git checkout merge-vs-rebase-master`

Move to branch named `feature-1`
* `git checkout feature-1`
* `git log` (to check branch changes)

Add `feature-1` branch changes to `merge-vs-rebase-master` branch (using `git merge`)
* `git checkout merge-vs-rebase-master`
* `git merge feature-1`
* `git log`

**Note:** There is not a merge commit created and the reason is because `feature-1` is just one commit ahead from `merge-vs-rebase-master`.

Update `feature-2` branch with new `merge-vs-rebase-master` branch changes
* `git checkout feature-2`
* `git log`
* `git rebase merge-vs-rebase-master`
    * Fix conflicts

Add `feature-2` branch changes to `merge-vs-rebase-master` branch (using `git rebase`)
* `git checkout merge-vs-rebase-master`
* `git log` (check commit hashes)
* `git rebase feature-2`
* `git log`

Update `feature-1.1` branch with new `main` branch changes (using `git merge`)
* `git checkout feature-1.1`
* `git log` (check commit hashes)
* `git merge merge-vs-rebase-master`
    * Fix conflicts

#### Bonus
Update `feature-1.1` branch with new `merge-vs-rebase-master` branch changes (using `git rebase`)
* `git checkout feature-1.1`
* `git log` (check hashes and order in commits)

Copy commit hash of the `Add Feature 1.1` commit
* `git reset --hard origin/feature-1.1`

This is to redo what we did in the last step (adding new changes to `feature-1.1` making use of `git merge`)

**Note:** Be careful when using `git reset` and extra careful if you use it with `--hard` flag
* `git rebase merge-vs-rebase-master`
    * Fix conflicts

Notice the order of the features changes AND
the order in commits hashes as well as `feature-1.1` commit hash (it’s different from the one we copied before.

