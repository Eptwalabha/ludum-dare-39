# Boilerplate for phaser.io (v2.8.3) and typescript

Quick boilerplate used for Game jam.

## project structure

```
/
|.. app/
|  |.. assets/
|  |.. sass/
|  |   |.. style.scss
|  |.. ts/
|  |   |.. definitions/
|  |   |.. app.ts
|  |.. index.html
|.. build/
|.. gulpfile.js
|.. package.json
|.. server.js
```

## set-up or first run

1. clone this repo
2. change name of the project in `/app/index.html` and `package.json`
3. `rm -rf .git/`
4. `git init`, `git add .` and `git commit -m "first commit"`
5. `npm install`

## gulp

the command `gulp`:
* transpiles typescript
* merges threejs with the previously transpiled script 
* compiles sass
* _useref_ the `/app/index.html`
* builds the app in `/build`

__note:__ Because `/build` is overwritten each time a file is changed,
all code/assets/style should be in `/app/ts/` and nothing should be
placed in `/build`.

## run server (only for dev purpose)

The server will only serve static files from `/build`,
so the project must be build at least once before starting the server.

to start the server listening on [localhost](http://localhost:9080)
(_port 9080_), run `npm start`
 
## TODO (mainly gulp task)

* in webstorm there is a problem where gulp only watches once the
`/app/index.html` file. Works if gulp is started from the command line.
* minify the js
* move assets to `/build`
* generate a `tar.gz` of `/build`
