// The build embeds the maintained stylesheet so a failed asset request cannot
// leave an otherwise reachable page unstyled. Direct template callers can still
// use the standalone stylesheet.
export function styleHead(config, root) {
  return typeof config.stylesheet === "string"
    ? `<style id="site-styles">${config.stylesheet}</style>`
    : `<link rel="stylesheet" href="${root}assets/styles.css?v=${config.assetVersions?.styles ?? ""}">`;
}
