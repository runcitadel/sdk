# Citadel SDK

<small>Lightweight, type-safe wrapper around the Citadel API.</small>

The Citadel SDK allows you to easily interact with a Citadel node on the local network in your app.
It can power your app, but will also be used in the new Citadel dashboard and mobile app.


**This is a very early proof of concept, please do not use it in production yet.**

### Note about ES Modules

This package uses ES Modules. It can only be imported in projects using ESM. Trying to `require()` it will fail.


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
await citadel.manager.auth.test();d
```
