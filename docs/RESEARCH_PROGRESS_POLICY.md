# Documenting research progress

QIQCOP records reported research progress with sources, dates, and attribution.
The maintainer team does not referee manuscripts, verify proofs, arrange expert
assessments, or certify reported resolutions. A progress entry documents what
its source reports. Preprint hosting, publication, peer review, and a DOI do not
automatically determine a problem's status.

The **Progress** panel is for reports of research progress received through
the portal or GitHub: manuscripts or papers, counterexamples, partial results,
and computational findings. Classify the content, not the reporter's role;
a maintainer can report research progress too. Internal maintainer arguments,
review discussion, scope or citation fixes, editorial changes, and engineering
or integration work belong in their repository threads, not as Progress entries.
A correction qualifies here only when it reports a research result.

The maintainer team reserves the final right to interpret and determine each
problem's **Solved** or **Unsolved** designation. Submission, source checks,
historical imports, and publication metadata never change that designation
automatically. A status change requires a separate team decision and preserves
the associated progress history.

## Sources required for new reports

Every new report of a resolution, partial result, computational finding, or new
research claim in a correction or follow-up must include an archival link to
the manuscript or paper reporting that result. An eligible source is:

- An arXiv manuscript, including a specific version where available.
- A Zenodo record containing a research manuscript.
- A manuscript in another supported preprint repository.
- A journal or publisher paper record, or a DOI identifying that research paper.

The link must identify the actual research document. A repository home page,
author profile, unrelated background paper, personal website, GitHub post,
shared document, temporary download, or attachment alone does not qualify.
A DOI identifying only software, a dataset, or another non-manuscript object
does not replace a paper. These materials may be supplementary links.
Peer review, expert endorsement, and formal proof certificates are not required
to document an eligible preprint.

The form lists supported sources. The shared source parser in
[progress-sources.mjs](../shared/progress-sources.mjs) supplies the same URL
rules to the browser, service, and catalog checks. A paper without a DOI may
use a supported stable publisher record. If its archival repository is not
supported yet, request source support with the record link through the
source-support route; the request does not itself submit new research progress.

Source checks identify the document and its bibliographic information.
Maintainers confirm that the summary describes the cited report and concerns
the indicated problem. This is documentation work, not a correctness review.
An unavailable source lookup prompts a retry when it is needed for validation;
it does not waive the required link or imply that a mathematical claim is false.

## Submit an update

Use [Submit a progress report](https://qiqc-op.com/contribute/progress/).
Provide the problem ID, type of update, archival link, a brief summary, and
public attribution. Citation details and a theorem, section, or page locator
help readers consult the report. A reported resolution describes the source's
claim; it does not set Solved automatically.

When direct sending is enabled, reports enter a private maintainer inbox.
Contact email remains private. Required links are checked in both the form
and the API; bypassing browser validation does not waive the requirement.
Receiving a report does not publish it or change a status.

Until the progress service is enabled, the form prepares a validated GitHub
research-update issue. It explains that this handoff is public and omits
private contact details. The GitHub form has a dedicated required archival-link
field. GitHub templates cannot prevent arbitrary comments or prove that a
pasted URL identifies a manuscript: an incomplete or ineligible new report
posted elsewhere is not ready for documentation until an eligible source is
provided. Once private sending is deployed and enabled, the research issue
form can be retired in favor of the portal link.

Ordinary typo fixes, bibliographic corrections, software reports, and requests
to reconsider a status may refer to the existing record without supplying a
new resolving paper. Use the correction route for those requests. If a
correction introduces a new research claim, use the progress route with its
archival source. New-problem proposals remain available; any research progress
included with them must also identify the corresponding archival sources.

## Existing GitHub reports remain visible

Existing GitHub reports of actual research progress, including those raised
by external contributors, belong in the **Progress** panel of each affected
problem page. Use a compact, visible hyperlink to the original report, such as
**GitHub #123**. Link a substantive report comment directly when appropriate.
Keep dates, authorship, detailed summaries, and discussion available in the
original thread and provenance inventory; do not repeat them as long panel entries.
These links do not require a later manuscript, resubmission, or proof assessment.

Include eligible reports from both open and closed issues. Add a brief qualifier
when needed to avoid misleading readers, such as identifying a withdrawn report;
keep its details in the linked thread and do not reconstruct removed material.
Link a report from each problem it actually concerns and preserve distinct
research-report links when combining duplicates. A later manuscript supplements
the original report link. Internal review, editorial corrections, and repository
implementation work are not research reports merely because they concern a
problem. Reports remain visible independently of the problem's status.

The dated [historical inventory](audits/github-progress-2026-09-25.md) records
the source versions and their problem mappings. Its
[machine-readable snapshot](audits/github-progress-2026-09-25.json) binds
historical entries to the content actually documented. Importing an old report
now does not make it new research. Conversely, an old issue's creation date
does not exempt a new claim added later. Additional historical requests must
identify their original pre-policy content; choosing a historical option
does not establish eligibility. Unclear mappings require clarification.
Inventory checks bind both the report and its cited comments to content-version
timestamps and hashes. A later snapshot cannot grandfather post-cutoff edits
merely because a thread was created earlier.

The new-submission requirement takes effect when these changes are adopted
and the corresponding intake route is enabled. The dated inventory documents
the existing reports already identified; later additions to that inventory
require provenance checks, not a retrospective manuscript requirement.

## Presentation and repository updates

Use one Progress panel for research reports, with compact source hyperlinks.
Keep detailed GitHub discussion, dates, and reporter information in the linked
thread and provenance inventory. A short source label identifies where a report
appeared and does not rank its correctness. Do not introduce verification badges,
proof-review queues, or accepted and unaccepted sections. Keep links visible and accessible
on both Solved and Unsolved pages. Summary fields use the site's readable
sans-serif font, and source requirements and validation errors are explicit.

For a catalog PR, add eligible source links directly to each new progress item
or to the bibliographic entry it cites. The progress-source check compares
changed entries with the base branch and permits documented historical entries
from the inventory. It does not validate mathematical arguments or turn a
source-presence check into approval. Ordinary wording corrections to a
historical entry should update its inventory text while retaining the original
source version and explaining the correction; new claims need archival links.

Preserve authorship separately from reporting credit, original report dates
separately from website-update dates, and existing licensing boundaries.
Do not copy entire GitHub proofs or apply a new license to earlier material.
Administrative handling may ask for missing citation details or identify
duplicates. It must not promise a proof review or describe an issue's closure
as settling the mathematical problem.

Catalog changes follow the existing [contribution process](../CONTRIBUTING.md)
and [repository merge policy](SECURITY_OPERATIONS.md). This policy does not
change branch protections, code ownership, merge authority, or deployment
settings. A proposal branch is reviewed through the normal repository process
before any of its website or policy changes become active.
