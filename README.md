# NEET UG Pro — Cloud edition v2

## Update from Android
1. Extract this ZIP.
2. Open the existing NEET-UG-Pro- GitHub repository.
3. Upload index.html, style.css, app.js and cloud.js into the repository ROOT. Replace matching files. All four files are required. Do not upload only the ZIP.
4. Commit and wait for Pages deployment to finish. Open the page again.
5. Look for Cloud connected, then tap Admin. Use the email/password created in Firebase. Never share your password.
6. Add a bilingual question, choose correct option, tick Publish for all students, and Save to cloud. Open the page in another browser to verify.

Configured Firebase project: neet-ug-pro. Configured admin UID: 1ocjfH5edshtXpkCPEYPBFLgKN32. UID and web config are client identifiers; the published Firestore rules enforce permissions. Student login is not required. There is no signup interface.

## Data
Collections are questions and mindmaps. Public queries require published == true and access == 'free', matching your published rules. Other documents are denied by the existing catch-all rule. Every question stores bilingual text/options/explanation. Options use objects rather than nested arrays for Firestore compatibility. User content is rendered with textContent, not HTML.

Previous starter localStorage remains untouched. Admin can import local bank as new drafts. Repeated imports create duplicate drafts; import only once. Existing bookmarks/results remain on the same browser and origin. Imported cloud copies receive new IDs; existing local bookmarks do not automatically transfer to them. Move to draft removes content from new public reads; previously viewed/copied content cannot be revoked from a device.

Cloud records are read in pages of 250, loading the entire published bank at refresh. This is suitable for initial testing, not the final large-scale 5,000-student architecture. Before scaling, add chapter-specific queries, caching and cost controls. No continuous listeners are used.

## Mind maps
Add English/Hindi titles and the HTTPS image URL for an image containing bilingual content. Upload the image to your GitHub repository first and use its live Pages image URL. Direct device-to-cloud binary upload is not implemented in this edition. Draft image URLs hosted publicly on GitHub remain public outside the app.

## Remaining work
Real native AdMob integration, Assertion & Reason reward unlock, Android packaging, complete interface localization, direct binary uploads and release testing remain. Videos and mock tests are excluded. No fake ads or rewards are included. Final ad placement: before practice starts; at most one interstitial attempt per chapter per calendar day, one per PYQ paper attempt subject to safeguards, and rewarded set access for 24 hours after reward callback. Web config/rules alone do not implement these ads.

## Validation
JavaScript syntax and stubbed rendering/data-flow tests passed. Firebase SDK is loaded from its official CDN using modular imports. Real-device login and live read/write tests must be performed after upload; no admin credentials were supplied to the developer. If Cloud error appears, share its error code (not password). This package has not been deployed by the assistant.

## Mobile edition v3
Updated responsive spacing, fixed five-tab bottom navigation, shorter tab labels, visible Admin shortcut above content, larger form inputs and answer targets. No database schema, permissions, IDs, ad behavior or existing browser storage keys changed. Replace all four app files with this version. Admin still opens inside the same app; a separate admin page is deferred.

## Assertion & Reason v4
Upload FIVE files: index.html, style.css, app.js, cloud.js and ar.js. Keep existing mitosis.png. Existing Firebase rules stay unchanged.

Home has a new A&R card. Admin has a separate bilingual form with assertion, reason, subject, chapter, set name, four standard answer choices, correct answer and explanation. Saved A&R uses practiceType=ar, access=rewarded and published=false. Such documents are denied to students by the rules you already published; admin may read/write and preview them. The regular question editor excludes A&R to prevent accidental conversion to free content.

Student A&R access remains unavailable while native rewarded-ad integration is pending. There are no fake ad completions or timers. No 24-hour entitlement is currently granted or claimed. The final Android/server reward-verification and set catalog are future work. Do not change these drafts to access=free to bypass the pending integration. Admin preview results use the existing on-device practice history.

Basic checks cover A&R validation, bilingual serialization, locked student UI and draft isolation. Live save/preview testing remains after upload.

## Version 5 — Year-wise PYQs and separate admin
Upload/replace all eight app files: index.html, admin.html, style.css, app.js, cloud.js, ar.js, ui.js and README.md. Keep existing mitosis.png and other media.

Admin link: https://nk7108715-source.github.io/NEET-UG-Pro-/admin.html . Bookmark this link. The student app has no Admin button; the separate page still requires the same UID-authorized login. Hiding the link is not the security boundary: Firestore rules continue to enforce UID permissions. Both pages share the same origin and Firebase session.

PYQs group by numeric year, then Main NEET / Re-NEET. Only paper types with published questions appear. One combined practice per year/type; no additional Set/Code screen. Admin selects year and paper type when adding/editing PYQs. Old yearless PYQs remain visible in Earlier uploads; edit them to assign a year. Current year through 1988 is supported, descending. Existing question IDs and bookmarks remain unchanged when edited.

The hero appears only on Home; other screens show their own content. Header and language selector remain. No admin shortcut is present in student A&R screen, even when the admin session is active.

Banner placement is prepared as an invisible slot on Home/PYQ/Chapters. No real banners are served, and no fake banner is displayed. Slot stays hidden until future Android ad integration. No banners on questions, mind maps or admin. A native ad implementation and real-device placement QA are still required.

No Firebase rules changes required. No cloud content is overwritten by uploading these files. Live deployment is performed by the user.
