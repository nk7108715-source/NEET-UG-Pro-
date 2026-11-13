# NEET UG Pro v8 — Dashboard and test modes

## Update on Android
Extract this ZIP. Upload all ELEVEN files into the existing repository root and commit: index.html, admin.html, style.css, app.js, cloud.js, ar.js, ui.js, practice.js, progress.js, media.js, README.md. Keep mitosis.png and other media. No Firebase rules change is needed.

Student: https://nk7108715-source.github.io/NEET-UG-Pro-/
Admin: https://nk7108715-source.github.io/NEET-UG-Pro-/admin.html

## Home
Home contains only the progress dashboard beneath the app header. It has an accuracy ring, completed practices, stopwatch-styled practice time, attempted/correct/wrong/skipped totals, cumulative marks and recent results. Old welcome/Small steps banner, refresh-content card, A&R promotional card and admin shortcut are removed from Home. The six navigation tabs remain.

## Normal practice / Complete test
Starting any available paper/chapter/bookmark practice opens a mode choice. The timer starts only when the student chooses the mode. Normal practice reveals correctness and explanation after choosing an answer; Next/Finish continues the session. Complete test lets students select or change answers, go Previous/Next, Skip and jump via question numbers. Skip clears the current selection. Submit test opens a submission confirmation with unanswered-question information. Confirm submission freezes the timer and reveals the final report and expandable answer review. No correctness or explanations appear in test mode before confirmation.

Scoring: correct +4, wrong -1, missed/unanswered 0. Maximum = number of questions × 4; negative total scores are possible. Reports show marks, total time, attempted, correct, wrong, skipped, accuracy and negative marks deducted. Accuracy = correct / attempted. Repeated submission does not create duplicate records. Admin previews produce a report but are excluded from student progress.

Timer covers the entire practice, including time spent in the background. It stops on Finish or confirmed test submission. Navigation away/reload abandons the in-progress session; incomplete sessions are not recorded or resumed. Reports/progress are local to this browser/device and are lost if its site data is cleared. Old results without timing contribute to score totals but no elapsed time.

## Content and admin
Year → Main NEET/Re-NEET PYQs, bilingual MCQ/A&R within PYQs, separate admin login page, chapterwise questions, bookmarks and mind maps remain. Paper name/Chapter practice fields are removed from admin. Standalone A&R uploads by Subject + Chapter and remains restricted pending Android ads; the A&R navigation shows chapter metadata without exposing protected answers. Existing A&R drafts should be edited and saved once to create their chapter cards.

A&R chapter metadata is stored in mindmaps with kind=arChapter and is filtered out of the Maps screen. Question answers in standalone A&R retain access=rewarded and published=false. PYQ A&R is free with its paper. Rules remain compatible. Existing cloud question IDs are preserved when edited.

## Remaining work
No live AdMob banners/interstitials/rewarded ads, native Android package or 24-hour rewarded entitlement is included. Standalone student A&R cannot start a real test until integration; the shared test/report engine will apply when it is enabled. A native/server verified unlock remains future work. No fake ads, timers granting rewards or earnings are included.

## Validation
Syntax checks and in-memory interaction tests passed for mode selection, hidden test feedback, skip, +4/-1/0 marks, negative/empty scores, reports, timer continuity/freeze, duplicate finish, progress aggregation, preview exclusion and legacy history. Live Firebase and mobile layout testing follows user deployment. This ZIP has not been uploaded to GitHub by the assistant.


## Image support in v8
PYQ and Chapter admin forms have six optional image controls: question, options 1–4 and solution. Each accepts Gallery/Files PNG, JPG or WebP, previews the result, and supports Remove image. Optional hosted HTTPS links are also supported. Plain text questions continue to work. Image-only answer options and image-only explanations are allowed; the bilingual question prompt itself is still required. Always inspect graphs, atom labels, superscripts and reaction arrows in the prepared preview before publishing.

Images are resized locally to a maximum edge of 1800px and prepared as WebP, up to 90 KiB of image data each. Source files over 8 MB, unsupported formats and images that cannot meet the limit are rejected with an explanation. Transparency is flattened on white. The app stores these small images directly inside the question document, so no separate GitHub upload or Firebase Storage setup is required for this limited initial feature. Question JSON is capped at 850,000 UTF-8 bytes to leave room below Firestore's 1 MiB document limit (https://firebase.google.com/docs/firestore/quotas). For larger diagrams, use a hosted HTTPS image URL instead. Embedded images increase question-bank download size and database usage; before a large public launch, move bulk media to dedicated storage and fetch questions by chapter/paper instead of loading the entire bank.

Images are rendered in question practice and option buttons. Normal practice shows the solution image after answering. Complete test keeps the solution out of the rendered interface until confirmed submission, and the submitted report review includes question, selected/correct option images and solution. Like the existing client-based scoring model, this is interface-level feedback timing, not a secure exam system; answer fields already arrive on the device.

Editing retains the original media unless Remove image or a new selection is used. No images are deleted or modified in existing cloud documents by uploading these files. Firebase rules stay unchanged. Only the configured admin can write question records. No HTML/SVG or arbitrary data URL is accepted. HTTPS images hosted outside Firestore have their own host's access rules; use embedded images for restricted questions if privacy is needed.

Additional checks passed for six gallery controls, image-only fields, media reference serialization, edit/removal behavior, unsafe-source rejection, question-size guard, test-mode solution gating and image preparation lifecycle with mocked canvas. Actual photo readability, Gallery behavior and live Firebase save/render must be checked on the user's Android after upload.
