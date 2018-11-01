# Description

A little Node.js program to fetch and display GitHub repo traffic data using
[GitHub REST API v3](https://developer.github.com/v3/) - in particular,
[Traffic](https://developer.github.com/v3/repos/traffic/).

To use it, create a [personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
and pass it in via the `-t` option.

# The Future

I took a look at [GitHub GraphQL API v4](https://developer.github.com/v4/guides/intro-to-graphql/).
Unfortunately, it doesn't appear to support traffic data yet. If this is added in the future,
this will be a much better (faster!) way to achieve the same goal.

# Usage

```
$ node index -h

  Usage: index [options]

  Options:

    -t, --token <token>        GitHub personal access token
    -u, --username <username>  User whose repos should be displayed
    -p, --page-size <n>        Page size (default: 100)
    -r, --show-rate-limit      Show remaining rate limit
    -h, --help                 output usage information
$ 
```

# Example

```
$ node index -t xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -u taylorjg -r
rate limit: 5000
rate remaining: 2164
rate reset: Thu Nov 01 2018 09:54:22 GMT+0000 (GMT)
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
......................................................................................................................................................................................................
GameOfLife                                   views:    35 /     8     clones:     2 /     2     stars: 0
Simple.Data.Informix                         views:    34 /     7     clones:     2 /     2     stars: 0
dotnet-versioninfo                           views:    11 /     7     clones:     0 /     0     stars: 2
DlxLib                                       views:    15 /     6     clones:     1 /     1     stars: 8
rubiks-cube                                  views:    12 /     6     clones:     0 /     0     stars: 0
hangman                                      views:    11 /     3     clones:     0 /     0     stars: 0
mastermind-csharp                            views:     5 /     3     clones:     0 /     0     stars: 0
ProcessRedirection                           views:     3 /     3     clones:     1 /     1     stars: 4
FlowFreeSolverWpf                            views:     3 /     3     clones:     1 /     1     stars: 5
repo-traffic                                 views:     6 /     2     clones:     1 /     1     stars: 0
transduce                                    views:     6 /     2     clones:     1 /     1     stars: 0
.
.
.
ZombieConga                                  views:     0 /     0     clones:     1 /     1     stars: 0

Total views: 219
Total unique views: 86
Total clones: 122
Total unique clones: 100
Total stars: 73

rate limit: 5000
rate remaining: 1766
rate reset: Thu Nov 01 2018 09:54:22 GMT+0000 (GMT)
$ 
```
