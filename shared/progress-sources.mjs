/** Source identification for documented reports, not an assessment of their claims. */
export const SOURCE_GUIDANCE = "Use an arXiv or Zenodo manuscript, a supported preprint repository, a journal article, or a paper DOI. GitHub posts, personal pages, shared files, and attachments alone are insufficient for new progress.";

export const SUPPORTED_SOURCE_NAMES = Object.freeze([
  "arXiv", "Zenodo manuscripts", "IACR ePrint", "HAL", "OSF Preprints",
  "bioRxiv", "medRxiv", "Preprints.org", "paper DOIs",
  "APS", "IOP", "Springer", "Nature", "Science", "ACM", "SIAM", "Wiley",
  "ScienceDirect", "Oxford Academic", "Quantum", "PMLR", "Project Euclid",
]);

const DOI = /^10\.\d{4,9}\/[^\s<>]+$/iu;
const ARXIV = /^(?:\d{2}(?:0[1-9]|1[0-2])\.\d{4,5}|[a-z][a-z.\-]*\/\d{7})(?:v[1-9]\d*)?$/iu;
const PROJECT = "Naixu-Guo/quantum-open-problems";

function input(value) {
  if (typeof value !== "string" || !value.trim()) throw new Error("An archival manuscript or paper link is required.");
  const text = value.trim();
  if (text.length > 2048 || /[\s\u0000-\u001f\u007f<>]/u.test(text)) throw new Error("Provide one complete manuscript or paper link per field or line.");
  return text;
}

function parsedUrl(text) {
  let url;
  try { url = new URL(text); } catch { throw new Error("Provide a complete https:// manuscript link, arXiv identifier, or DOI."); }
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) {
    throw new Error("Use a public HTTPS manuscript or paper link without credentials or a custom port.");
  }
  url.protocol = "https:";
  return url;
}

function doiSource(identifier) {
  if (!DOI.test(identifier)) throw new Error("The DOI must identify a research manuscript or published paper.");
  // Encode each path segment, preserving the DOI's slash separators.
  return { url: `https://doi.org/${identifier.split("/").map(encodeURIComponent).join("/")}`, type: "doi" };
}

/** Normalize a supported document link. Its document type and relevance still need checking. */
export function normalizeArchivalLink(value) {
  const text = input(value);
  const arxivId = text.replace(/^arxiv:/iu, "");
  if (ARXIV.test(arxivId)) return { url: `https://arxiv.org/abs/${arxivId}`, type: "arxiv" };
  const bareDoi = text.replace(/^doi:/iu, "");
  if (DOI.test(bareDoi)) return doiSource(bareDoi);

  const url = parsedUrl(text);
  const host = url.hostname.toLowerCase().replace(/^www\./u, "");
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { throw new Error("The source link contains invalid URL encoding."); }

  if (["doi.org", "dx.doi.org"].includes(host)) return doiSource(pathname.slice(1));
  if (["arxiv.org", "export.arxiv.org"].includes(host)) {
    const id = pathname.replace(/^\/(?:abs|pdf)\//u, "").replace(/\.pdf$/u, "");
    if (ARXIV.test(id)) return { url: `https://arxiv.org/abs/${id}`, type: "arxiv" };
  }
  if (host === "zenodo.org") {
    const match = /^\/records?\/([1-9]\d*)(?:\/?|\/files\/[^/]+)$/u.exec(pathname);
    if (match) return { url: `https://zenodo.org/records/${match[1]}`, type: "zenodo" };
  }
  if (host === "eprint.iacr.org" && /^\/\d{4}\/\d+(?:\.pdf)?\/?$/u.test(pathname)) {
    return { url: `https://${host}${pathname.replace(/\.pdf$/u, "").replace(/\/$/u, "")}`, type: "preprint" };
  }
  const preprint = (
    (host === "hal.science" && /^\/(?:hal|tel)-\d+(?:v\d+)?(?:\/document)?\/?$/u.test(pathname)) ||
    (host === "osf.io" && /^\/preprints\/(?:[a-z0-9_-]+\/)?[a-z0-9]+\/?$/iu.test(pathname)) ||
    (["biorxiv.org", "medrxiv.org"].includes(host) && /^\/content\/10\.1101\/[^/]+(?:\.full(?:\.pdf)?)?\/?$/u.test(pathname)) ||
    (host === "preprints.org" && /^\/manuscript\/\d{6}\.\d+(?:\/v\d+)?\/?$/u.test(pathname))
  );
  if (preprint) return { url: `https://${host}${url.pathname}`, type: "preprint" };

  const publisherDoi = [
    ["journals.aps.org", /^\/[^/]+\/(?:abstract|pdf|accepted|supplemental)\/(10\..+)$/u],
    ["iopscience.iop.org", /^\/article\/(10\..+?)(?:\/pdf)?$/u],
    ["link.springer.com", /^\/(?:article|chapter)\/(10\..+)$/u],
    ["science.org", /^\/doi\/(?:abs\/|full\/|pdf\/)?(10\..+)$/u],
    ["dl.acm.org", /^\/doi\/(?:abs\/|full\/|pdf\/)?(10\..+)$/u],
    ["epubs.siam.org", /^\/doi\/(?:abs\/|full\/|pdf\/)?(10\..+)$/u],
    ["onlinelibrary.wiley.com", /^\/doi\/(?:abs\/|full\/|pdf\/|epdf\/)?(10\..+)$/u],
  ];
  for (const [publisher, pattern] of publisherDoi) {
    if (host === publisher) {
      const match = pattern.exec(pathname);
      if (match) return doiSource(match[1]);
    }
  }
  const publication = (
    (host === "nature.com" && /^\/articles\/[a-z0-9.\-]+(?:\.pdf)?\/?$/iu.test(pathname)) ||
    (host === "sciencedirect.com" && /^\/science\/article\/(?:abs\/)?pii\/[a-z0-9]+\/?$/iu.test(pathname)) ||
    (host === "academic.oup.com" && /^\/[^/]+\/article(?:-abstract)?\/[^/]+\/[^/]+\/[^/]+(?:\/[^/]+)?\/?$/u.test(pathname)) ||
    (host === "quantum-journal.org" && /^\/papers\/q-\d{4}-\d{2}-\d{2}-\d+\/?$/u.test(pathname)) ||
    (host === "proceedings.mlr.press" && /^\/v\d+\/[a-z0-9_-]+\.html$/iu.test(pathname)) ||
    (host === "projecteuclid.org" && /^\/(?:journals|ebooks|proceedings)\/.+\/(?:full|short|pdf)$/u.test(pathname))
  );
  if (publication) return { url: `https://${host}${url.pathname}`, type: "publication" };
  throw new Error("Use an eligible archival manuscript or paper link. This URL is not a supported document source; use the paper DOI or request support for its repository.");
}

/** Historical requests identify existing project reports; this does not prove their age. */
export function normalizeHistoricalLink(value) {
  let url;
  try { url = parsedUrl(input(value)); }
  catch { throw new Error("Provide the complete URL of the original GitHub issue, pull request, or report comment in Naixu-Guo/quantum-open-problems."); }
  const match = /^\/Naixu-Guo\/quantum-open-problems\/(issues|pull)\/([1-9]\d*)\/?$/iu.exec(url.pathname);
  if (url.hostname.toLowerCase() !== "github.com" || !match || url.search || (url.hash && !/^#(?:issuecomment-\d+|discussion_r\d+|pullrequestreview-\d+)$/u.test(url.hash))) {
    throw new Error("Link to the original issue, pull request, or report comment in Naixu-Guo/quantum-open-problems.");
  }
  return `https://github.com/${PROJECT}/${match[1].toLowerCase()}/${match[2]}${url.hash}`;
}
