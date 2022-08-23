# Git-Training

## Description
This repository will be used to practice different GIT commands and situations,
please do not clone this repository, use a fork to have this repository as a
base and be able to practice on the respective forks

There are folders for each exercise if you want to practice one of them go to the folder
and read the instructions inside the folder, it will have the steps to be able
to do it as well as the branches you will need

## Work with a fork

### What is a fork?

A fork is a copy of a repository, with forking you will be free to experiment with changes without affecting the original project.

### Steps

* Go to the origin repo on GitHub
  * [GIT Training](https://github.com/yodarjun/git-training)
* In the top-right corner of the page, click Fork
  * Now you will have a copy of the original repo in your Github account
* Clone your fork on your local machine.

Configuring a remote for a Fork.

You must configure a remote that points to the origin version of a repository(upstream) in Git to sync changes you make in that fork with the original repository, in this case we would use it mostly to update our fork.

* Move to your fork
* Open your terminal
* `git remote add upstream git@github.com:yodarjun/git-training.git`
* Verify the new upstream repository you've specified for your fork.
  * `git remote -v`
 
### Update your fork

To get new branches:
* `git fetch upstream`

To update master branch
* `git switch master`
* `git rebase upstream/master`
* `git push`

 
