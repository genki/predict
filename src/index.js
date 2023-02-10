"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var assert_1 = require("assert");
exports["default"] = (function (promise) {
    (0, assert_1["default"])(promise instanceof Promise, "Promise expected");
    var stack = [];
    var memo = undefined;
    var reply = function () { return memo !== null && memo !== void 0 ? memo : (memo = new Promise(function (done, fail) {
        return promise.then(function (result) {
            while (stack.length) {
                var _a = stack.shift(), type = _a[0], arg = _a[1];
                switch (type) {
                    case 'get':
                        result = result[arg];
                        break;
                    case 'call':
                        result = result.apply(void 0, arg);
                        break;
                    case 'new':
                        result = new (result.bind.apply(result, __spreadArray([void 0], arg, false)))();
                        break;
                }
            }
            done(result);
        })["catch"](fail);
    })); };
    var Future = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        stack.push(['call', args]);
        return captor();
    };
    var captor = function () { return new Proxy(Future, {
        get: function (target, prop) {
            memo = undefined;
            switch (prop) {
                case 'then': return function (done, fail) { return reply().then(done, fail); };
                case 'catch': return function (fail) { return reply()["catch"](fail); };
                case 'finally': return function (done) { return reply()["finally"](done); };
            }
            stack.push(['get', prop]);
            return captor();
        },
        construct: function (target, args) {
            stack.push(['new', args]);
            return captor();
        }
    }); };
    return captor();
});
