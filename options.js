document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['closeOldTab', 'includeQueryParams'], (data) => {
    document.getElementById('closeOldTab').checked = data.closeOldTab || false;
    document.getElementById('includeQueryParams').checked = data.includeQueryParams || false;
  });

  document.querySelectorAll('input[type="checkbox"]').forEach((elm) => {
    elm.addEventListener('change', saveOptions);
  });
});

function saveOptions() {
  const closeOldTab = document.getElementById('closeOldTab').checked;
  const includeQueryParams = document.getElementById('includeQueryParams').checked;

  chrome.storage.sync.set({ closeOldTab, includeQueryParams });
}
