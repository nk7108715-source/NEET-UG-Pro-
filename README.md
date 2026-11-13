# NEET UG Pro — fresh web starter

New code, no Video section. No student login. Default English, Hindi and bilingual modes. Sample MCQs, chapter/paper grouping, explanations, local bookmarks, result history, JSON import/export and local mind-map image preview work without a backend.

The sample questions are demonstrations, not authenticated NEET PYQs. There is no secure admin login, shared content database, APK, paid access or real ad integration yet. Local browser data does not migrate automatically from the previous repository/origin. Export your old data before switching.

## Android mobile / GitHub Pages
1. Extract this ZIP on your phone.
2. Create your new GitHub repository.
3. Upload index.html, style.css and app.js to its root (not the ZIP itself).
4. Commit. Settings → Pages → Deploy from a branch → main → /(root) → Save.
5. Open the Pages URL after deployment completes. Content tools lets you download the bilingual JSON template and import questions locally.

## Next implementation stages
Configure a shared cloud question bank and Firebase Authentication for admin only, with server-enforced admin authorization. Do not put admin passwords in HTML. Students must be able to read published free content without login.

Then package for Android and integrate native AdMob callbacks. Chapter rule: at most one interstitial attempt on the first completed practice per chapter per calendar day. PYQ rule: one attempt after a completed paper, subject to global frequency safeguards and availability. Never block progress on a failed/unavailable interstitial. Assertion & Reason: explicit rewarded-ad opt-in, grant a 24-hour set unlock only after the reward callback; no reward on dismissal/failure. No ads are simulated here. Screenshots remain allowed. Mock tests and paid plans are deferred.

Before release: verify cloud security rules, privacy disclosures, accessibility, ad lifecycle, data migration and real-device behavior. This is an initial coding deliverable, not a Play Store-ready release.
