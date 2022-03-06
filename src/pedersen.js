var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var HN = require('./hex-number.js');
var crypto = require('crypto');
function commitTo(H, r, x) {
    return ec.g.mul(r).add(H.mul(x));
}
function add(Cx, Cy) {
    return Cx.add(Cy);
}
function sub(Cx, Cy) {
    return Cx.add(Cy.neg());
}
function addPrivately(H, rX, rY, vX, vY) {
    var rZ = rX.add(rY).umod(ec.n);
    return ec.g.mul(rZ).add(H.mul(vX + vY));
}
function subPrivately(H, rX, rY, vX, vY) {
    var rZ = rX.sub(rY).umod(ec.n);
    return ec.g.mul(rZ).add(H.mul(vX - vY));
}
function verify(H, C, r, v) {
    return ec.g.mul(r).add(H.mul(v)).eq(C);
}
function generateRandom() {
    var random;
    do {
        random = HN.toBN(HN.fromBuffer(crypto.randomBytes(32)));
    } while (random.gte(ec.n)); // make sure it's in the safe range
    return random;
}
function generateH() {
    return ec.g.mul(generateRandom());
}
module.exports = {
    commitTo,
    add,
    sub,
    addPrivately,
    subPrivately,
    verify,
    generateRandom,
    generateH
}
