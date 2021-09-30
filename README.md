# Citadel SDK

This package makes it easy to integrate with Citadel.
It is a TypeScript-based wrapper around the Citadel REST API.

This is a very early proof of concept, please do not use it in production.

### Note about ES Modules

This package uses ES Modules. It can only be imported in true ESM projects, not using `require()`.

### Simple example

```JavaScript
import {Citadel} from "./lib/index.js";

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
