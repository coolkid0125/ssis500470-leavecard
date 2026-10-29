# SSIS Leave Card Portal (CSC Form 6 Ledger)

Cleaned and fixed production-ready code for **San Simon Integrated School Personnel Leave Card System**.

---

## 📁 Project Structure

```text
ssis-leave-card/
├── api/
│   └── index.js     # Vercel Serverless Gateway (pulls Index.html live from Apps Script)
├── index.html       # Standalone frontend backup
├── Code.gs          # Google Apps Script backend code (paste into Google Sheet)
├── vercel.json      # Vercel rewrite configuration
└── README.md        # Setup, deployment & sync documentation
```

---

## ⚡ How The 100% Automatic Sync Works (Apps Script ↔ Vercel)

> **"Can I edit Index.html in Apps Script and have Vercel update automatically WITHOUT touching GitHub?"**

**YES! That is now enabled.**

With the **Vercel Gateway (`api/index.js`)**:
1. When a user visits your Vercel URL (e.g., `https://ssis-leave-card.vercel.app/`), Vercel dynamically requests the newest `Index.html` directly from your Google Apps Script Web App (`action=getAppHtml`).
2. **You only upload to GitHub ONCE.** After uploading `api/index.js` and `vercel.json` to GitHub, you **NEVER** need to touch GitHub again!
3. Whenever you edit `Index.html` in Google Apps Script, simply publish a new deployment version:
   * Click **Deploy** > **Manage deployments** > **Edit** > Version: **New version** > **Deploy**.
4. The instant you click Deploy, **your Vercel site updates immediately!**

1. **Spreadsheet Data Updates (Instant)**:
   - Your Vercel website does **not** store static data. Instead, it makes direct, live API calls (`fetch`) to your Google Apps Script endpoint (`API_ENDPOINT`).
   - Every time a user opens or refreshes the Vercel URL, or clicks a staff member, it pulls the latest records **directly from your Google Sheet**.
   - When an admin files leave or adds credits through the Vercel site, it saves directly to the Google Sheet and refreshes the balances in real time. **Zero rebuilds or redeploys on Vercel are needed.**

2. **Apps Script Code Updates**:
   - If you modify the backend logic in `Code.gs`, Google Apps Script requires you to publish the change to the active Web App deployment:
     1. Click **Deploy** > **Manage deployments**.
     2. Click the **Pencil (Edit)** icon on your active deployment.
     3. Under **Version**, select **New version**.
     4. Click **Deploy**.
   - Because the Web App URL remains identical, **Vercel will immediately start using your updated backend code without touching Vercel!**

3. **Frontend Code Updates (GitHub → Vercel)**:
   - When you push frontend updates (like changes to `index.html`) to your GitHub repository, **Vercel detects the commit and automatically redeploys your site in under 15 seconds.**

---

## ⚙️ Configuration in Google Sheet (`Header` Tab)

In your Google Spreadsheet, open the **`Header`** sheet tab. You can configure any of the following key-value pairs (Column A = Field Name, Column B = Value):

| Column A (Field Name) | Column B (Value Example) | Description |
| :--- | :--- | :--- |
| `School Name` | `SAN SIMON INTEGRATED SCHOOL` | Header school banner text |
| `Logo Direct URL` | `https://drive.google.com/file/d/...` | Direct URL or Google Drive link for the school seal |
| `Address` | `San Simon, Pampanga` | Printed and header address line |
| `Contact` | `(045) 123-4567` | Header phone / contact info |
| `Email` | `sansimon.is@deped.gov.ph` | Header email address |
| `Admin PIN` | `1234` | Security PIN to unlock the "+ File Leave" and "+ Add Credits" buttons |
| **`Portal URL`** *(New)* | `https://ssis500470.vercel.app/` | **Dynamic link for the "Back to SSIS Portal" button** *(accepts `Portal URL`, `Portal Link`, or `SSIS Portal URL`)* |
| **`Portal Name`** *(New)* | `SSIS Portal` | Label text for the button (default: `Back to SSIS Portal`) |
| **`Portal Logo`** *(New)* | `https://drive.google.com/...` | Custom icon URL for the portal button (optional) |

---

## 📊 Top Dashboard: Leave Balances & Annual Entitlements

The summary dashboard at the top of each personnel leave card now displays both **Cumulative Running Balances** and **Calendar Year (CY) Annual Usable Quotas**:

1. **Cumulative Leave Balances**:
   - 🏖️ **Vacation Leave (VL)**: Current cumulative balance (earned at 1.250 days/month).
   - 🩺 **Sick Leave (SL)**: Current cumulative balance (earned at 1.250 days/month).
   - ⏳ **Service Credits (COC/CTO)**: Accumulated compensatory service credits (DepEd SO).
2. **Annual Usable Leave Quotas (Calendar Year)**:
   - 🌿 **Forced Leave (FL)**: 5.000 days/year (with automatic CSC exemption detection if VL < 10 days).
   - ⭐ **Special Privilege Leave (SPL)**: 3.000 days/year.
   - 🧘 **Wellness Leave (WL)**: 5.000 days/year (Non-Teaching & Teaching).
3. **Smart Historical Sync**:
   - When switching the "Calendar Year" dropdown, the cards show the closing balance as of that specific calendar year; on the current year, it displays the live running balance.

---

## 🛠️ Key Fixes & Improvements Applied

1. **Security Fix in Admin Authentication**:
   - Previously, if an unexpected error or object was returned during PIN verification, JavaScript evaluated it as truthy, potentially unlocking admin tools.
   - Fixed to strictly verify `{ verified: true }` and reject any error objects.
   - Removed the rigid `maxlength="6"` restriction on the PIN field to support any PIN/password defined in your Google Sheet's `Header` tab.

2. **Selected Staff State in Sidebar**:
   - Added active styling (`.personnel-item.active`) so users can easily see which personnel's leave card is currently open.

3. **Mobile Drawer Backdrop**:
   - Added a smooth backdrop overlay on mobile devices so tapping outside closes the navigation drawer naturally.

4. **Running Balance Engine**:
   - Added safe numeric parsing (`isNaN` protection) to prevent any `NaN` values from propagating in the Vacation Leave, Sick Leave, and CTO balances.
   - Preserved all CSC Form 6 rules, deductible/non-deductible categories, and annual quota formulas (Forced Leave 5d, SPL 3d, Wellness Leave 5d).

5. **Direct Fetch & Redirection Handling**:
   - Added explicit `redirect: 'follow'` to `apiRequest` for both GET and POST to handle Google Apps Script 302 redirects seamlessly across browsers and mobile web.

---

## 🚀 Step 1: Update Google Apps Script (`Code.gs`)

1. Open your Google Spreadsheet (**Staff Directory & Leave Ledger**).
2. Go to **Extensions** > **Apps Script**.
3. Replace the contents of your script file with the code from [`Code.gs`](./Code.gs).
4. Click the **Save** (💾) icon.
5. Click **Deploy** > **Manage deployments**.
6. Select your existing Web App deployment, click the **Pencil (Edit)** icon.
7. Change **Version** to **New version**.
8. Ensure:
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone`
9. Click **Deploy**.

---

## 🌐 Step 2: Upload to GitHub

If you don't have the Git command line installed, you can do this directly in your web browser:

1. Go to [github.com](https://github.com) and log in.
2. Click the **+** icon in the top right > **New repository**.
3. Name it: `ssis-leave-card` (choose **Public** or **Private**).
4. Click **Create repository**.
5. On the repository page, click **uploading an existing file**.
6. Drag and drop:
   - `index.html`
   - `vercel.json`
   - `README.md`
7. Click **Commit changes**.

---

## ▲ Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New...** > **Project**.
3. Locate your `ssis-leave-card` repository from the list and click **Import**.
4. Leave **Framework Preset** as `Other` (Vercel automatically detects plain HTML).
5. Click **Deploy**.
6. In ~10 seconds, Vercel gives you your production URL (e.g., `https://ssis-leave-card.vercel.app`).
