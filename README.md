# Citadel SDK

Lightweight, type-safe wrapper around the Citadel API.


**This is a very early proof of concept, please do not use it in production yet.**

### Note about ES Modules

The Node.js version of this package uses ES Modules. It can only be imported in true ESM projects, not using `require()`.

The browser version also has a CommonJS build, available at `@runcitadel/sdk/browser-cjs/index.browser.cjs`.


### Simple example

```JavaScript
import {Citadel} from "@runcitadel/sdk";

console.log("Initializing testing...");
// Try to discover a Citadel
let node = await Citadel.discover() || "http://localhost";
let citadel = new Citadel(node);
console.log("Checking online state...");
console.log(await citadel.isOnline());
console.log("Logging in...");
await citadel.login("password123!", true);
console.log("Testing connection...");
await citadel.manager.auth.test();
console.log("Checking Citadel/Umbrel...");
console.log(await citadel.manager.isCitadel() ? "Citadel" : "Umbrel");
// Umbrel is not really supported
```
