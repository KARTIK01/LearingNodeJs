const _ = require("lodash");

let a = {
    name:"rahul"
};
console.log("() : ", _.extend(a, { class:"x" }));
console.log("() : ", a);