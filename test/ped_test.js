var assert = require('assert');
var pedersen = require('../src/pedersen.js');
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var r = Array(10).fill().map((x, i) => i).map(i => pedersen.generateRandom());
var H = pedersen.generateH();
describe('pedersen', () => {
    it('should commit to a sum of two values', () => {
        var tC = pedersen.commitTo(H, r[1], 5);
        var aC1 = pedersen.commitTo(H, r[2], 10);
        var aC2 = pedersen.sub(aC1, tC);
        var bC1 = pedersen.commitTo(H, r[4], 7);
        var bC2 = pedersen.add(bC1, tC);
        var checkAC2 = pedersen.subPrivately(H, r[2], r[1], 10, 5);
        assert(aC2.eq(checkAC2));
        var checkBC2 = pedersen.addPrivately(H, r[4], r[1], 7, 5);
        assert(bC2.eq(checkBC2));
        assert(pedersen.verify(H, bC2, r[4].add(r[1]), 7 + 5));
    });
    it('should fail if not using the correct blinding factors', () => {
        var tC = pedersen.commitTo(H, r[1], 5);
        var aC1 = pedersen.commitTo(H, r[2], 10);
        var aC2 = pedersen.sub(aC1, tC);
        var bC1 = pedersen.commitTo(H, r[4], 7);
        var bC2 = pedersen.add(bC1, tC);
        var checkAC2 = pedersen.subPrivately(H, r[0], r[1], 10, 5);
        assert(aC2.eq(checkAC2) == false);
        var checkBC2 = pedersen.addPrivately(H, r[0], r[1], 7, 5);
        assert(bC2.eq(checkBC2) == false);
    })
});
