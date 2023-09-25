// 正規表現パターン
const youtubePattern = /^(https?:\/\/)?(www\.)?youtube\.com.*/;
const soundcloudPattern = /^(https?:\/\/)?(www\.)?soundcloud\.com.*/;
const spotifyPattern = /^(https?:\/\/)?(open\.)?spotify\.com.*/;

// URLを判定する関数
function identifyDomain(url) {
  if (youtubePattern.test(url)) {
    return "youtube";
  } else if (soundcloudPattern.test(url)) {
    return "soundcloud";
  } else if (spotifyPattern.test(url)) {
    return "spotify";
  } else {
    return null;
  }
}

module.exports = identifyDomain;