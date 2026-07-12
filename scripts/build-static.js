const fs = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'frontend');
const DEST = path.join(ROOT, 'dist');
const PUBLIC_DEST = path.join(ROOT, 'public');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await fs.rm(DEST, { recursive: true, force: true });
  await fs.rm(PUBLIC_DEST, { recursive: true, force: true });

  await copyDir(SRC, DEST);
  await copyDir(SRC, PUBLIC_DEST);

  const resumeSource = path.join(ROOT, 'pictures', 'Jagadesh_Resume (5).pdf');
  const resumeDest = path.join(DEST, 'Jagadesh_Resume.pdf');
  const resumePublicDest = path.join(PUBLIC_DEST, 'Jagadesh_Resume.pdf');
  await fs.copyFile(resumeSource, resumeDest);
  await fs.copyFile(resumeSource, resumePublicDest);

  console.log('Built frontend static output to dist/ and public/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
