var x, a;
var {
  isGenerator,
  toGenerator,
  map,
  each,
  forEach,
  filter,
  reduce,
  compact,
  find,
  contains
} = window.g;

document.body.className = '';
window.onerror = function() {
  document.body.className = 'red';
};

function assert(b) {
  if (!b) throw new Error();
}

function toArray(g) {
  var a = [];
  for (var i of g)
    a.push(i);
  return a;
}

function assertArrayEquals(a, other) {
  assert(a.length === other.length);
  a.forEach(function(ai, i) {
    assert(ai === other[i]);
  });
}

function assertGeneratorEquals(gen, a) {
  var i = 0;
  for (var x of gen)
    assert(a[i++] === x);
}

function* gen() {
  yield 0;
  yield 1;
  yield 2;
}

assert(isGenerator({}) === false);
assert(isGenerator(gen) === false);
assert(isGenerator(gen()));

a = [];
for (x of gen()) a.push(x);
assertArrayEquals(a, [0, 1, 2]);
assertGeneratorEquals(toGenerator(gen()), a);
assertGeneratorEquals(gen(), [0, 1, 2]);

assertGeneratorEquals(map(gen(), x => x * x), [0, 1, 4]);
assertGeneratorEquals(map(a, x => x * x), [0, 1, 4]);
assertGeneratorEquals(map({a: 1, b: 2}, o => o.value * o.value), [1, 4]);
assertGeneratorEquals(map({a: 1, b: 2}, o => o.key + o.key), ['aa', 'bb']);

var sum = 0;
var a = toArray(each(gen(), i => (sum += i, undefined)));
assertArrayEquals(a, Array(3));
assert(sum === 3);
assert(each === forEach);

assertGeneratorEquals(filter(gen(), x => x < 2), [0, 1]);
assertGeneratorEquals(
    map(filter({a: 1, b: 2, c: 3}, o => o.value < 2), o => o.value),
    [1]);

assert(reduce(gen(), (s, i) => s + i, 0) === 3);

assertGeneratorEquals(compact(gen()), [1, 2]);

assert(find(map(gen(), x => x * x), x => x > 2) === 4);
assert(find(map(gen(), x => x * x), x => x > 4) === undefined);

assert(!contains(map(gen(), x => x * x), 3));
assert(contains(map(gen(), x => x * x), 4));
assert(!contains(map(gen(), x => x * x), 5));
