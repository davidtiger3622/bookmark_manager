const fs = require("fs");
const path = require("path");

const baseDir = path.join(process.cwd(), "public", "wallpapers");
const manifest = {};

const categories = fs
  .readdirSync(baseDir)
  .filter((entry) => fs.statSync(path.join(baseDir, entry)).isDirectory());

for (const category of categories) {
  const dir = path.join(baseDir, category);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  manifest[category] = files;
  console.log(`${category}: ${files.length} images found`);
}

fs.writeFileSync(path.join(baseDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Manifest written to public/wallpapers/manifest.json");
