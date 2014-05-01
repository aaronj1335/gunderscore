(function(root) {
  var g = root.g = {};

  function isGenerator(o) {
    return !!o.next;
  }
  g.isGenerator = isGenerator;

  function* toGenerator(o) {
    var i, item;

    if (g.isGenerator(o))
      while (!(item = o.next()).done)
        yield item.value;

    else if (Array.isArray(o))
      for (i = 0; i < o.length; i++)
        yield o[i];

    else
      for (i in o)
        if (o.hasOwnProperty(i))
          yield {key: i, value: o[i]};
  }
  g.toGenerator = toGenerator;

  function* map(g, f) {
    var item, idx = 0;

    g = toGenerator(g);

    while (!(item = g.next()).done)
      yield f(item.value, idx++);
  }
  g.map = map;

  function* each(g, f) {
    g = map(g, f);

    while (!g.next().done)
      yield undefined;
  }
  g.each = each;
  g.forEach = each;

  function* filter(g, f) {
    var item, idx = 0;

    g = toGenerator(g);

    while (!(item = g.next()).done)
      if (f(item.value, idx++))
        yield item.value;
  }
  g.filter = filter;

  function reduce(g, f, i) {
    var item = {}, idx = 0;

    g = toGenerator(g);

    while (!(item = g.next()).done)
      i = f(i, item.value, idx++);

    return i;
  }
  g.reduce = reduce;

  function compact(g) {
    return filter(g, x => !!x);
  }
  g.compact = compact;

  function find(g, f) {
    var item;

    while (!(item = g.next()).done && !f(item.value));

    return item.done? undefined : item.value;
  }
  g.find = find;

  function contains(g, i) {
    return find(g, x => x === i);
  }
  g.contains = contains;

  // flatten
  // every
  // any
  // last
  // first
  // difference

})(this);
