predict
=======

Predict the future of Promise.
The proxy object to capture accesses to the promise and replay when it is awaited for.

USAGE
-----

You can use `Promise` object as if a normal object.

```ts
import predict from "future-promise";

// dynamic import to global scope
globalThis.Foo = predict(import("foo-client")).default;

... some other file
const client = new Foo.Client(...);
const res = await client.where(...).exec();
```

And here is the list of features as a spec.

```ts
it('should predict a promise', async () => {
  const p = predict(Promise.resolve({
    foo: 'foo',
    bar: 'bar',
    baz: { qux: 'qux', },
    fn: () => 'fn',
    chain: () => () => 'chain',
    async: () => new Promise(_ => setTimeout(() => _('async'), 0)),
  }));
  expect(await p.foo).toBe('foo');
  expect(await p.bar).toBe('bar');
  expect(await p.baz.qux).toBe('qux');
  expect(await p.fn()).toBe('fn');
  expect(await p.chain()()).toBe('chain');
  expect(await p.async()).toBe('async');
});
```
