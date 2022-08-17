# cherry-pick

## Description
Apply the changes introduced by some existing commits to another branch, changes will be in the same folder, same file.

Some helpful flags:

* **--edit:** With this option, `cherry-pick` will let you edit the commit message prior to committing.
* **--no-commit:** This flag applies the changes necessary to `cherry-pick` each named commit to your working tree and the index, without making any commit.

More info: https://git-scm.com/docs/git-cherry-pick

## Example Instructions

### Objective
We want to remove the `reloadCachePage` function from the `runner.js` file of the `SWAT-1823` folder, to do this we have to create a feature branch and then create a new PR as we normally do in SOT, for this example we are going to simulate that we create the feature branch but we did the commit in master branch by mistake so we are going to solve it in the following way:

* With `cherry-pick` we are going to copy the changes we made in the commit and we are going to apply them in the feature branch to avoid making the changes again
* Then we are going to remove the commit that we did by mistake in `master` branch

### Branches
To avoid changes in `master` branch we are going to use different branches as master and feature branch

* master: cherry-pick-master
* feature branch: cherry-pick-feature
