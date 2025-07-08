import fs from 'fs';
const file = './confessionCounter.json';

export function getNextConfessionNumber() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({ count: 1 }, null, 2));
    return 1;
  }

  const data = JSON.parse(fs.readFileSync(file));
  data.count += 1;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  return data.count;
}
