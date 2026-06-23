import fs from 'fs';

const report = JSON.parse(
  fs.readFileSync('/Users/user/snapnest/backend/src/data/cities-content-report.json', 'utf-8')
);
const citiesPath = '/Users/user/snapnest/backend/src/data/cities.ts';
let content = fs.readFileSync(citiesPath, 'utf-8');

let updatedCount = 0;

for (const r of report.results) {
  if (!r.shortDescription && !r.thumbnailUrl) continue;

  const searchKey = `'${r.id}': {`;
  const idx = content.indexOf(searchKey);
  if (idx === -1) {
    console.error(`Not found: ${r.id}`);
    continue;
  }

  // Find the opening brace after the key
  const bracePos = idx + searchKey.length - 1; // position of '{'
  const insertFields: string[] = [];
  if (r.shortDescription) insertFields.push(`shortDescription: ${JSON.stringify(r.shortDescription)}`);
  if (r.thumbnailUrl) insertFields.push(`thumbnailUrl: ${JSON.stringify(r.thumbnailUrl)}`);
  if (r.imageAttributionUrl) insertFields.push(`imageAttributionUrl: ${JSON.stringify(r.imageAttributionUrl)}`);

  const insert = insertFields.join(', ') + ', ';
  content = content.slice(0, bracePos + 1) + ' ' + insert + content.slice(bracePos + 1);
  updatedCount++;
}

fs.writeFileSync(citiesPath, content);
console.log(`✅ ${updatedCount}/94 cities updated in cities.ts`);
