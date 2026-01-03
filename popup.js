// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TWEET_DELETED") {
    document.getElementById('counter').innerText = request.count;
    document.getElementById('status').innerText = "Working...";
  }
  if (request.type === "FINISHED") {
    document.getElementById('status').innerText = "Finished!";
  }
});

document.getElementById('startBtn').addEventListener('click', async () => {
  const dateValue = document.getElementById('cutoffDate').value;
  if (!dateValue) return alert("Please select a date!");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: runDeletion,
    args: [dateValue]
  });
});

function runDeletion(dateString) {
  const cutoff = new Date(dateString);
  let deletedCount = 0;
  
  const deleteLogic = async () => {
    while (true) {
      const tweets = document.querySelectorAll('article[data-testid="tweet"]');
      let foundInBatch = false;

      for (let tweet of tweets) {
        const timeEl = tweet.querySelector('time');
        if (!timeEl) continue;
        
        const tweetDate = new Date(timeEl.getAttribute('datetime'));
        
        if (tweetDate < cutoff) {
          foundInBatch = true;
          const caret = tweet.querySelector('[data-testid="caret"]');
          if (caret) {
            caret.click();
            await new Promise(r => setTimeout(r, 800));
            const del = Array.from(document.querySelectorAll('span')).find(el => el.textContent === 'Delete');
            if (del) {
              del.click();
              await new Promise(r => setTimeout(r, 800));
              const confirm = document.querySelector('[data-testid="confirmationSheetConfirm"]');
              if (confirm) {
                confirm.click();
                deletedCount++;
                // SEND MESSAGE TO POPUP
                chrome.runtime.sendMessage({type: "TWEET_DELETED", count: deletedCount});
                await new Promise(r => setTimeout(r, 2000));
              }
            }
          }
        }
      }

      // Scroll and check for end
      let oldHeight = document.body.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 3000));

      if (document.body.scrollHeight === oldHeight) {
        chrome.runtime.sendMessage({type: "FINISHED"});
        break;
      }
    }
  };
  
  deleteLogic();
}