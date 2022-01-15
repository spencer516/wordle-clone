export default function* range(start = 0, end = 0, step = 1) {
  for (let idx = start; idx < end; idx += step) {
    yield idx;
  }
}
