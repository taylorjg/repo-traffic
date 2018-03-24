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

# Build

```
$ npm run build

> repo-traffic@0.0.1 build /Users/jontaylor/HomeProjects/repo-traffic
> babel index.js --out-dir dist

index.js -> dist/index.js
$ 
```

# Usage

```
$ node dist/index -h

  Usage: index [options]

  Options:

    -t, --token <token>        GitHub API token
    -u, --username <username>  User whose repos should be displayed (default: taylorjg)
    -p, --page-size <n>        Page size (default: 100)
    -d, --delay <n>            Delay (default: 0)
    -h, --help                 output usage information
$ 
```

# Example

```
$ node dist/index -t xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx -u taylorjg
rate limit: 5000
rate remaining: 3615
rate reset: Sat Mar 24 2018 08:50:22 GMT+0000 (GMT)
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
......................................................................................................................................................................................
FractalsWpf                        views:    28 /    19     clones:     0 /     0     stars: 2
Simple.Data.Informix               views:    27 /    14     clones:     0 /     0     stars: 0
DlxLib                             views:    20 /     8     clones:     0 /     0     stars: 6
Monads                             views:    20 /     6     clones:     0 /     0     stars: 6
DumpToken                          views:    19 /     4     clones:     0 /     0     stars: 3
gpu-js-experiments                 views:    17 /     2     clones:     0 /     0     stars: 0
hangman                            views:    15 /     2     clones:     0 /     0     stars: 0
WineApi                            views:    13 /     2     clones:     0 /     0     stars: 0
PotterKata                         views:    11 /     2     clones:     0 /     0     stars: 0
dlxlibjs                           views:    10 /     2     clones:     6 /     6     stars: 1
FlowFreeDlx                        views:    10 /     1     clones:     0 /     0     stars: 1
Mastermind                         views:    10 /     2     clones:     0 /     0     stars: 0
GenMonad                           views:    10 /     3     clones:     0 /     0     stars: 0
GameOfLife                         views:     8 /     1     clones:     0 /     0     stars: 0
SudokuDlx                          views:     8 /     3     clones:     0 /     0     stars: 0
rubiks-cube                        views:     7 /     2     clones:     0 /     0     stars: 0
PotterKata2                        views:     6 /     1     clones:     0 /     0     stars: 0
FlowFreeSolverWpf                  views:     4 /     2     clones:     0 /     0     stars: 4
RippleEffectDlx                    views:     3 /     2     clones:     0 /     0     stars: 0
Angular2Dialog                     views:     3 /     2     clones:     0 /     0     stars: 1
Pinger                             views:     3 /     1     clones:     0 /     0     stars: 0
ProcessRedirection                 views:     3 /     1     clones:     0 /     0     stars: 4
DebtMan                            views:     3 /     1     clones:     0 /     0     stars: 3
sudoku-dlx-js                      views:     3 /     1     clones:     0 /     0     stars: 0
SalesTaxes_CSharp                  views:     2 /     1     clones:     0 /     0     stars: 1
RackSort                           views:     2 /     2     clones:     0 /     0     stars: 0
Flinq                              views:     2 /     2     clones:     0 /     0     stars: 1
mastermind-svg-prototype           views:     1 /     1     clones:     4 /     2     stars: 0
TennisKataJavaScript               views:     1 /     1     clones:     0 /     0     stars: 0
FsCheckUtils                       views:     1 /     1     clones:     0 /     0     stars: 9
AdventOfCode2016                   views:     1 /     1     clones:     0 /     0     stars: 0
parallel-js-experiments            views:     1 /     1     clones:     0 /     0     stars: 0
CXX_WPF                            views:     1 /     1     clones:     0 /     0     stars: 2
TicTacToePlay                      views:     1 /     1     clones:     0 /     0     stars: 0
FractalsWebGL                      views:     1 /     1     clones:     0 /     0     stars: 1
ShowMeTheRoute                     views:     1 /     1     clones:     0 /     0     stars: 0
repo-traffic                       views:     0 /     0     clones:     2 /     2     stars: 0
PotterDictionary                   views:     0 /     0     clones:     1 /     1     stars: 0
AlgorithmXScala                    views:     0 /     0     clones:     1 /     1     stars: 0
EFTest                             views:     0 /     0     clones:     1 /     1     stars: 0
DiamondKata_CSharp                 views:     0 /     0     clones:     1 /     1     stars: 0
DiamondKata2_CSharp                views:     0 /     0     clones:     1 /     1     stars: 0
WineApiNodeJs                      views:     0 /     0     clones:     1 /     1     stars: 1
rate limit: 5000
rate remaining: 3249
rate reset: Sat Mar 24 2018 08:50:22 GMT+0000 (GMT)
$ 
```
