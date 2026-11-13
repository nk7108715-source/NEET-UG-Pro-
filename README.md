# NEET UG Pro v6

## Android mobile update
Extract this ZIP. Upload ALL NINE files from the extracted folder into the existing repository root, replacing same-name files: index.html, admin.html, app.js, cloud.js, ar.js, ui.js, progress.js, style.css and README.md. Keep mitosis.png and other existing media. Wait for Pages deployment then refresh.

Student: https://nk7108715-source.github.io/NEET-UG-Pro-/
Admin: https://nk7108715-source.github.io/NEET-UG-Pro-/admin.html

## Changes
- No Paper name / Chapter practice input in either admin category. Chapterwise uses Subject + Chapter; PYQ uses Year + Main NEET/Re-NEET, with no Subject/Chapter entry.
- PYQ Question type selects MCQ or Assertion & Reason. PYQ A&R stays inside its paper and is free like the rest of that paper. Standard A&R choices are supplied automatically.
- Six student navigation tabs: Home, PYQs, Chapters, Saved, Maps, A&R.
- Standalone A&R is authored by subject/chapter; no separate question-set name is required. It remains restricted pending real rewarded ads. Chapter metadata is public; questions/answers are not.
- Timer starts with Start practice, continues across answers and Next, and stops on Finish. It measures wall-clock time including time spent in the background. A session abandoned by leaving navigation or reloading is not a completed practice; it is not resumed or counted in progress.
- Home progress shows completed practices, attempted questions, weighted accuracy, completed practice time and five recent results. Stored only on this browser/device. Admin previews are excluded from new progress records. Older results without timing remain in score totals but contribute no time.

## A&R data and permissions
Existing Firestore rules remain compatible; no rules change is needed. Questions in standalone A&R keep access=rewarded and published=false. The admin can preview them. A&R questions within PYQ instead use category=PYQ, practiceType=ar, access=free and the selected published state. They appear in normal paper practice and do not require a separate reward.

To show A&R chapter cards without exposing answers, metadata is stored in mindmaps documents with kind=arChapter, published=true and access=free. These records are excluded from the Maps screen. On first save/edit of a standalone A&R question, its chapter card is created. Edit and save existing A&R drafts once to create their chapter cards. Metadata save is a separate write: if it fails after the question save, reopen the admin page, edit the saved question and retry saving. Moving a question between chapters can leave the old metadata card; catalog cleanup is future work.

## Preserved content
Cloud records are not migrated or overwritten by uploading code. Editing keeps document IDs and local bookmark references. Old yearless PYQs remain in Earlier uploads until the admin assigns a year. Existing subject/chapter metadata is retained for old PYQs but not requested in the form. Chapter browsing now excludes PYQ records, keeping full papers out of chapter cards. A&R protected questions cannot be accessed via student bookmarks.

## Pending
No real banners/interstitials/rewarded ads or 24-hour unlock are live. Android ad integration is still required. Banner slot stays invisible with no fake ad. Videos and mock tests remain excluded. Bulk JSON upload/export, direct cloud image uploads and scale optimizations are not added by this update.

## Validation
Syntax checks and in-memory interaction tests cover form category/type toggles, ordinary and A&R PYQ persistence, free/restricted separation, paper grouping, timer continuity/freeze, duplicate finish prevention, progress aggregation and admin preview exclusion. Actual Firebase save/login and mobile visual checks must follow deployment.
