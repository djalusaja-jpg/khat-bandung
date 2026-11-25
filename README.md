# KHAT BANDUNG — Starter MVP

Starter project for the KHAT BANDUNG member/community app.

## Included
- Responsive web/PWA front-end (installable from a supported mobile browser)
- Member registration form with all requested fields
- Member card view with QR code payload
- Event attendance screen (camera scanner integration is a next setup step)
- Cash ledger, committee, and agenda screens
- Google Apps Script backend starter for Google Sheets + Drive
- Capacitor setup notes for packaging the web app as Android

## Important
This is a development starter, not a deployed production service. It does not yet have live Google credentials, deployed hosting, admin accounts, or a production security review. Do not enter real KTP addresses, emergency contacts, or member photos until the backend is deployed with access controls.

## 1. Run the web preview
Install Node.js 20+ then:

```bash
npm install
npm run dev
```

## 2. Connect Google Sheets / Drive
1. Create a Google Spreadsheet owned by the KHAT administrator.
2. Open Extensions → Apps Script.
3. Copy `google-apps-script/Code.gs` into the Apps Script editor.
4. Set Script Properties:
   - `SPREADSHEET_ID` = the spreadsheet ID
   - `ADMIN_EMAILS` = comma-separated admin email addresses
   - `DRIVE_FOLDER_ID` = Drive folder ID for member photos
5. Run `setupKhatSheets()` once and authorize.
6. Deploy as Web app. Choose access settings appropriate to your organization.
7. Add the deployment URL to `.env` as `VITE_API_URL`.

For production, use Google sign-in/OAuth or a secure identity provider and verify the user's role server-side. Never trust a role value sent by the browser. The Apps Script sample includes a basic email allowlist pattern but should be hardened before handling sensitive data.

## 3. Android
This project is a PWA first. Members can install it from Chrome's menu when hosted over HTTPS.
To create a native Android wrapper:

```bash
npm install
npm run build
npm install @capacitor/core @capacitor/cli
npx cap init "KHAT BANDUNG" "id.khatbandung.app"
npm install @capacitor/android
npx cap add android
npx cap copy android
npx cap open android
```

Build/sign the APK or AAB in Android Studio. An Android build requires Android Studio, signing configuration, and testing on real devices.

## 4. Before launch
- Upload official KHAT logo and define brand assets.
- Confirm admin email addresses and who may approve registrations.
- Decide whether member numbers are assigned automatically or by admin.
- Configure consent/privacy notice and retention rules for KTP addresses, emergency contacts, and photos.
- Test QR attendance against duplicate scans and offline/poor-network conditions.
- Restrict financial edits to admin/bendahara and keep an audit log.
