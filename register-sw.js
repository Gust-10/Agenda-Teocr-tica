if ('serviceWorker' in navigator) {
  // Use a relative path to be more robust.
  // The 'defer' attribute in the script tag in index.html ensures this runs after the document is parsed.
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('ServiceWorker registration successful, scope:', registration.scope);
    })
    .catch(err => {
      console.error('ServiceWorker registration failed:', err);
    });
}