export function forLoop(from, to, incr, block) {
    var accum = '';
    for(var i = from; i < to; i += incr) {
        block.data.index = i;
        accum += block.fn(i);
    }
    return accum;
}