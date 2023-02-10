import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import predict from '../src/index';

describe('[predict]', () => {
  it('should predict a promise', async () => {
    const p = predict(new Promise((done) => {
      done({
        foo: 'foo',
        bar: 'bar',
        baz: {
          qux: 'qux',
        },
        fn: () => 'fn',
        chain: () => () => 'chain',
      });
    }));
    expect(await p.foo).toBe('foo');
    expect(await p.bar).toBe('bar');
    expect(await p.baz.qux).toBe('qux');
    expect(await p.fn()).toBe('fn');
    expect(await p.chain()()).toBe('chain');
  });

  it('can predict construction', async () => {
    class Foo {
      constructor() {
        this.bar = 'bar';
      }
    }
    const p = predict(new Promise((done) => {
      done(Foo);
    }));
    expect(await (new p()).bar).toBe('bar');
  });
});
