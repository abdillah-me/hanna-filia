// Downloads placeholder photographs into public/images/.
// Run once after cloning: `npm run photos`
// Every file here is a placeholder. To use a real photograph, simply overwrite
// the file of the same name — nothing else in the codebase needs to change.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'images');

/** key → Unsplash photo id (https://unsplash.com/photos/<id>) */
const PHOTOS = {
  'building-front': 'Ucr4Yp-t364',
  'class-kids': '5QTQz-oYk1A',
  'class-teens': '7ixTyur7opE',
  'class-conversation': '-uHVRvDr7pg',
  'class-toefl': '6RTM8EsD1T8',
  'class-business': 'faEfWCdOKIg',
  'hfos-hero': '6zlgM-GUd6I',
  'gallery-kids-class': 'BPXSTl_HBhk',
  'gallery-phonics': 'Pw0vMMWnSWU',
  'gallery-teens-discussion': '90ctJcyrRLs',
  'gallery-teens-presentation': 'gMsnXqILjp4',
  'gallery-conversation-roleplay': 'f0DKiz23tlw',
  'gallery-native-speaker': 'VBLHICVh-lI',
  'gallery-toefl-simulation': '7Wf684C9nwU',
  'gallery-business-inhouse': 'KdeqA3aTnBY',
  'gallery-english-camp': 'adQAb-L-YkE',
  'gallery-graduation': 'm7yOJx0ALME',
  'gallery-speaking-day': '_2NZCoWRJSo',
  'gallery-study-tour': 'z8XO8BfqpYc',
  'article-1': '93W0xn4961g',
  'article-2': 'MiZd3-92iDE',
  'article-3': 'omeaHbEFlN4',
};

const exists = async (p) => access(p).then(() => true, () => false);

async function main() {
  await mkdir(OUT, { recursive: true });
  let downloaded = 0;
  let skipped = 0;
  const failed = [];

  for (const [key, id] of Object.entries(PHOTOS)) {
    const file = join(OUT, `${key}.jpg`);

    // Never overwrite: once the client drops in a real photo, re-running this
    // script must not clobber it.
    if (await exists(file)) {
      skipped++;
      console.log(`skip     ${key}.jpg (already present)`);
      continue;
    }

    try {
      const res = await fetch(`https://unsplash.com/photos/${id}/download?w=1600`, {
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(file, buf);
      downloaded++;
      console.log(`download ${key}.jpg (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed.push(`${key} (${id}): ${err.message}`);
      console.error(`FAIL     ${key}: ${err.message}`);
    }

    // Be a polite client.
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n${downloaded} downloaded, ${skipped} skipped, ${failed.length} failed`);
  if (failed.length) {
    console.error('\nFailed:\n' + failed.join('\n'));
    process.exitCode = 1;
  }
}

main();
