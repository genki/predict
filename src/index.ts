import assert from 'assert';
type Future<T> = T & Promise<T> & FutureOf<T>;
type FutureOf<T> = { [P in keyof T]: Future<T[P]>; };

export default <T>(promise:Promise<T>):Future<T> => {
  type Get = ["get", string];
  type Call = ["call", any[]];
  type New = ["new", any[]];
  type Item = Get | Call | New;
  type Stack = Item[];
  type Captor<T> = () => Future<T>;
  type D = (x:T) => void;
  type F = (e:Error) => void;
  assert(promise instanceof Promise, "Promise expected");
  const stack:Stack = [];
  let memo = undefined;
  const reply = () => memo ??= new Promise((done, fail) => {
    return promise.then((result:any) => {
      while(stack.length) {
        const [type, arg] = stack.shift() as Item;
        switch(type) {
          case 'get': result = result[arg]; break;
          case 'call': result = result(...arg); break;
          case 'new': result = new result(...arg); break;
        }
      }
      done(result);
    }).catch(fail);
  });
  const Future = function(...args:any[]) {
    stack.push(['call', args]);
    return captor();
  };
  const captor:Captor<T> = () => new Proxy(Future, {
    get: (target:any, prop:string) => {
      memo = undefined;
      switch(prop) {
        case 'then': return (done:D, fail:F) => reply().then(done, fail);
        case 'catch': return (fail:F) => reply().catch(fail);
        case 'finally': return (done:D) => reply().finally(done);
      }
      stack.push(['get', prop]);
      return captor();
    },
    construct: (target:any, args:any[]) => {
      stack.push(['new', args]);
      return captor();
    },
  });
  return captor();
};
