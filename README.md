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
