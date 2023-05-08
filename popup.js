function downloadImage(url, index) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `image_${index + 1}.png`;
      downloadLink.click();
      URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error('Error downloading image:', error);
    });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'imageUrls') {
    const imagePreviewsElement = document.getElementById('image-previews');
    imagePreviewsElement.innerHTML = '';

    request.imageUrls.forEach((url, index) => {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'image-container';
      imageContainer.style.backgroundImage = `url(${url})`;
      imageContainer.addEventListener('click', () => {
        const confirmed = confirm('Do you want to download this image?');
        if (confirmed) {
          downloadImage(url, index);
        }
      });

      imagePreviewsElement.appendChild(imageContainer);
    });
  }
});

// Send the message to get image URLs immediately when the popup opens
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'getImageUrls' });
});

