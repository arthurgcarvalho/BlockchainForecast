To run the client GUI

```
Node and NPM must be install
npm install -g --production windows-build-tools
cd client && npm install
npm start
```


To build a deployable solution

```
Add the following to package.json before building:

"homepage": "./",

then: npm run build
```