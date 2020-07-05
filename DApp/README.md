Make sure Node and NPM are installed.

Start by installing the required NPM libraries:

```
npm install -g --production windows-build-tools
```

Next, install and start the DApp:

```
npm install
npm start
```


To build a deployable solution, make sure you add the following to package.json before building:

```
"homepage": "./",
```

then run the following command:

```
npm run build
```
