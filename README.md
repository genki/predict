predict
=======

Predict the future of Promise.
The proxy object to capture accesses to the promise and replay when it is awaited for.

USAGE
-----

You can use `Promise` object as if a normal object.

```ts
import predict from "predict";

// dynamic import to global scope
globalThis.Foo = predict(import("foo-client")).default;

... some other file
const client new Foo.Client(...);
const res = await client.where(...).exec();
```
