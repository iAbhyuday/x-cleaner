# X-Cleaner: Automated Tweet Deletion Tool

**X-Cleaner** is a lightweight Chrome Extension (Manifest V3) designed to help you clean up your X (Twitter) profile. It works directly within your browser DOM to identify, filter, and delete tweets based on a cutoff date, bypassing the need for a paid API.

---

## 🚀 Features

* **Date Filtering:** Select a cutoff date; only tweets posted *before* that date will be removed.
* **Auto-Scrolling:** Automatically scrolls down your profile to find and load older tweets.
* **Real-time Counter:** A live dashboard in the extension popup shows exactly how many tweets have been deleted in the current session.
* **Human-Like Delays:** Built-in pauses between deletions to reduce the risk of triggering anti-bot rate limits.
* **Auto-Stop:** Detects the end of your timeline and stops automatically when no more tweets are found.

---

## 🛠️ Installation (Developer Mode)

Since this is a custom tool, you must load it manually into Chrome:

1.  **Prepare the Folder:**
    * Create a folder on your computer named `x-cleaner`.
    * Place `manifest.json`, `popup.html`, and `popup.js` inside that folder.
2.  **Open Chrome Extensions:**
    * In your browser address bar, go to `chrome://extensions/`.
3.  **Enable Developer Mode:**
    * Toggle the switch in the **top right corner** to **On**.
4.  **Load the Extension:**
    * Click the **"Load unpacked"** button.
    * Select the `x-cleaner` folder you created.
5.  **Pin for Access:**
    * Click the "Puzzle" icon in your toolbar and pin **X-Cleaner** for quick access.

---

## 📖 How to Use

1.  Navigate to your **X Profile page** (e.g., `https://x.com/YourUsername`).
2.  Click the **X-Cleaner** icon in your browser toolbar.
3.  Select a **Cutoff Date** (all tweets older than this date will be deleted).
4.  Click **"Start Deleting"**.
5.  **Keep the tab active:** You will see the counter update in the popup as the script works.

---

## ⚠️ Important Safety Information

### 1. Irreversibility
**Deletion is permanent.** X (Twitter) does not have a "Trash" or "Undo" feature for deleted posts. Use with caution.

### 2. Rate Limits & Shadowbanning
X monitors for automated behavior. 
* This script uses a **2-3 second delay** between actions to mimic human behavior.
* **Recommendation:** If you have thousands of tweets, run the script in batches of 300-500, then wait an hour before continuing.

### 3. Retweets
This script is currently configured to look for the **"Delete"** option. Because Retweets use the **"Undo Retweet"** label, they are skipped by default to prevent accidental removals of shared content.

---

## 🛠️ Troubleshooting
If X updates their website design, the script may stop finding buttons. To fix this:
1.  Right-click the "Three Dots" (More) button on a tweet and select **Inspect**.
2.  Note the `data-testid` value (usually `caret`).
3.  Update the corresponding value in `popup.js`.

---

## 📝 Technical Details
* **Manifest Version:** 3
* **API used:** `chrome.scripting`, `chrome.runtime` (Messaging)
* **Logic:** DOM-based traversal and simulated click events.
