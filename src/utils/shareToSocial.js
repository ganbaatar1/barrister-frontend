// 📁 src/utils/shareToSocial.js

export function getFacebookShareUrl({ url, quote = "", hashtag = "" }) {
    const fbBase = "https://www.facebook.com/sharer/sharer.php";
    const params = new URLSearchParams({ u: url, quote, hashtag });
    return `${fbBase}?${params.toString()}`;
  }
  
  export function getTwitterShareUrl({ url, text = "", hashtags = "" }) {
    const twBase = "https://twitter.com/intent/tweet";
    const params = new URLSearchParams({ url, text, hashtags });
    return `${twBase}?${params.toString()}`;
  }
  
  export function getLinkedInShareUrl({ url }) {
    const liBase = "https://www.linkedin.com/sharing/share-offsite/";
    return `${liBase}?url=${encodeURIComponent(url)}`;
  }
  