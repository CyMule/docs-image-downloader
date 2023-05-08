// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getImageUrls') {
        const scriptTags = Array.from(document.querySelectorAll('script'));
        const imageUrls = [];

        scriptTags.forEach(script => {
            if (script.innerHTML.includes('https://lh3.googleusercontent.com')) {
                const urlRegex = /"https:\/\/lh3\.googleusercontent\.com[^"]+/g;
                const matches = script.innerHTML.match(urlRegex);
                if (matches) {
                    matches.forEach(match => {
                        const extractedUrl = match.slice(1);
                        imageUrls.push(extractedUrl);
                    });
                }
            }
        });

        chrome.runtime.sendMessage({ action: 'imageUrls', imageUrls: imageUrls });
    }
});

