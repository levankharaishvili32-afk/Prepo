// ფონის მოშორება ერთ სურათზე. ცალკე პროცესად ეშვება, რადგან ბიბლიოთეკას sharp-ის
// საკუთარი ვერსია მოჰყვება და ჩვენსას ერთ პროცესში ეჯახება.
// გამოყენება: node scripts/cutout.mjs <input> <output.png>
import { removeBackground } from '@imgly/background-removal-node';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [input, output] = process.argv.slice(2);
const blob = await removeBackground(pathToFileURL(path.resolve(input)).href, {
  model: 'medium',
  output: { format: 'image/png' },
});
fs.writeFileSync(output, Buffer.from(await blob.arrayBuffer()));
