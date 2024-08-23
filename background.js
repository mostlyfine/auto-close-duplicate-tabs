function normalizeUrl(url, config) {
  const parsedUrl = new URL(url);
  return config.includeQueryParams
    ? parsedUrl.origin + parsedUrl.pathname + parsedUrl.search
    : parsedUrl.origin + parsedUrl.pathname;
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const config = await chrome.storage.sync.get(['closeOldTab', 'includeQueryParams']);
    const normalizedNewUrl = normalizeUrl(changeInfo.url, config);

    const tabs = await chrome.tabs.query({});
    for (const existingTab of tabs) {
      if (existingTab.id !== tabId) {
        const normalizedExistingUrl = normalizeUrl(existingTab.url, config);

        if (normalizedNewUrl === normalizedExistingUrl) {
          if (config.closeOldTab) {
            await chrome.tabs.remove(existingTab.id);
            await chrome.tabs.update(tabId, { active: true });
          } else {
            await chrome.tabs.remove(tabId);
            await chrome.tabs.update(existingTab.id, { active: true });
          }
          break;
        }
      }
    }
  }
});
