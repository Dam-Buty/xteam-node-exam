Some JSON parsing CLI
====

I will parse JSON files for you, and count occurrences of your favorite tags!

How to install
----
My only dependencies are for unit testing. You can install them with `npm install`.

If you want, you can also install me globally with `sudo npm install -g`. This allows you to run `xteam` from any directory containing a `data` folder.

How to test
----
`npm test`

(`npm coverage` will generate an istanbul coverage report) 


How to use
----

If i am installed globally, you can just run `xteam` from anywhere. I will complain if i can't find a folder called `data` in the current directory, though.

Otherwise you can use `npm start`, `node index.js` or `bin/xteam` when you are at my repository's root.

In any case, you have three ways of telling me your favorite tags :

```
cat tags.txt | xteam     # by piping content to stdin
xteam lorem,ipsum        # by specifying a comma-separated list of tags as argument
xteam                    # if nothing is offered, i will try to read a tags.txt file in the current folder
```



Node.js exam
====

Quick practical exam for node.js candidates.

Requirements
----

- allow the user to supply a CLI argument containing a comma-separated list of tags
  - if no argument is given, load `tags.txt` to get an array of tags.
- for each of these tags, find out how many times that tag appears within the objects in `data/*.json` (_note:_ objects can be nested).
- final output should be formatted like this (sorted by most popular tag first):

```
pizza     15
spoon     2
umbrella  0
cats      0
```

- cache the result so that subsequent runs can return the result immediately without needing to process the files.
- use only core modules
- use the asynchronous variants of the file IO functions (eg. use `fs.readFile` not `fs.readFileSync`).
- if any of the data files contain invalid JSON, log the error with `console.error` and continue, ignoring that file.
- you can use any version of node, however your solution must use plain callbacks rather than promises.
