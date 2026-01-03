/**
 * Ultimate X (Twitter) Deletion Script
 * Features: Auto-scroll, Date-filtering, and Auto-stop.
 */

const CONFIG = {
    // 1. SET YOUR DATE HERE (YYYY-MM-DD)
    // Only tweets posted BEFORE this date will be deleted.
    deleteBeforeDate: new Date('2024-01-01'), 
    
    // 2. TIMING (ms) - Increase these if your internet is slow
    scrollWait: 3000,   // Wait for new tweets to load after scroll
    actionWait: 1000,   // Wait between clicking buttons
    batchWait: 2000     // Wait between full tweet deletions
};

const startDeletion = async () => {
    let totalDeleted = 0;
    let lastHeight = 0;
    let sameHeightCount = 0;

    console.log(`🚀 Starting deletion. Target: Tweets before ${CONFIG.deleteBeforeDate.toDateString()}`);

    while (true) {
        // Find all tweets currently loaded
        const articles = document.querySelectorAll('article[data-testid="tweet"]');
        
        for (let article of articles) {
            try {
                // Check the date of the tweet
                const timeElement = article.querySelector('time');
                if (!timeElement) continue;
                
                const tweetDate = new Date(timeElement.getAttribute('datetime'));

                // Only proceed if the tweet is older than our target date
                if (tweetDate < CONFIG.deleteBeforeDate) {
                    const caret = article.querySelector('[data-testid="caret"]');
                    if (!caret) continue;

                    caret.click();
                    await new Promise(r => setTimeout(r, CONFIG.actionWait));

                    const deleteBtn = Array.from(document.querySelectorAll('span'))
                        .find(el => el.textContent === 'Delete');

                    if (deleteBtn) {
                        deleteBtn.click();
                        await new Promise(r => setTimeout(r, CONFIG.actionWait));

                        const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                        if (confirmBtn) {
                            confirmBtn.click();
                            totalDeleted++;
                            console.log(`✅ Deleted [${tweetDate.toDateString()}] - Total: ${totalDeleted}`);
                            await new Promise(r => setTimeout(r, CONFIG.batchWait));
                        }
                    }
                } else {
                    console.log(`⏭️ Skipping newer tweet: ${tweetDate.toDateString()}`);
                }
            } catch (err) {
                console.error("Error processing tweet, skipping...", err);
            }
        }

        // --- SCROLL & STOP LOGIC ---
        lastHeight = document.body.scrollHeight;
        window.scrollTo(0, document.body.scrollHeight);
        console.log("Scrolling for more...");
        
        await new Promise(r => setTimeout(r, CONFIG.scrollWait));

        // 1. Check if we've reached the absolute bottom (Height hasn't changed)
        if (document.body.scrollHeight === lastHeight) {
            sameHeightCount++;
            if (sameHeightCount >= 2) { // Try twice to be sure it's not just slow loading
                console.log("🏁 Reached end of profile. No more tweets to load.");
                break;
            }
        } else {
            sameHeightCount = 0;
        }

        // 2. Check for the "No more tweets" UI element
        if (document.querySelector('[data-testid="emptyState"]')) {
            console.log("🏁 Found 'Empty State' marker. Stopping.");
            break;
        }
    }
    
    console.log(`⭐ Task complete. Total tweets removed: ${totalDeleted}`);
};

startDeletion();