function parseCoinbaseTag(hex) {
  if (!hex) return null;

  try {
    const ascii = Buffer.from(hex, "hex")
      .toString("ascii")
      .replace(/[^\x20-\x7E]/g, "");

    const matches = ascii.match(/\/([A-Za-z0-9 ._-]{3,32})\//g);
    if (!matches) return null;

    return matches[matches.length - 1]
      .replace(/\//g, "")
      .trim();
  } catch {
    return null;
  }
}

module.exports = { parseCoinbaseTag };
