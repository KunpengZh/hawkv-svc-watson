const obj={a:1,b:2,c:3,d:4,x:{aa:1,bb:2}}
const {a,b,...querObj}=obj;

console.log(querObj)