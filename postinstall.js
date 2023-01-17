const { readFileSync, writeFileSync } = require("fs");

const path = "node_modules/react-scripts/config/webpack.config.js";
const text = readFileSync(path, "utf-8");

if (!text.includes("ignoreWarnings:")) {
  const stats = "stats: 'errors-warnings',";
  const newText = text.replace(stats, `${stats} ignoreWarnings: [/to parse source map/],`);
  writeFileSync(path, newText, "utf-8");
}
