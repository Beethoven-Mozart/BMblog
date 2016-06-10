"use strict";

export default (ctx, next) => {
    console.log(`plugin "test" start`);
    console.log(`request time ${new Date()}`);
}
