var autoplayAllowed = false;
var autoplayRequiresMute = false;
var player;
var wrapperDiv;
var duration_ad = 15000;
var adTagAdsense =
  "https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_image&client=ca-video-pub-3166493188367342&description_url=http%3A%2F%2Fwww.tinmoi.vn&videoad_start_delay=0&hl=en&max_ad_duration=15000&sdmax=30000";
var Application = function (src_video) {
  this.mainPlayer = document.getElementById("mainPlayer");
  getVideoDuration(src_video)
    .then(function (duration) {
      if (duration <= 5) {
        duration_ad = 5000;
      } else if (duration <= 15) {
        duration_ad = 15000;
      } else if (duration <= 30) {
        duration_ad = 30000;
      } else {
        duration_ad = 30000;
      }
    })
    .catch(function (error) {
      console.error(error);
    });
  function getVideoDuration(videoPath) {
    var video = document.createElement("video");
    video.src = videoPath;

    return new Promise(function (resolve, reject) {
      video.addEventListener("loadedmetadata", function () {
        var duration = video.duration;
        resolve(duration);
      });
      video.addEventListener("error", function () {
        reject("Error loading the video");
      });
    });
  }
  function checkUnmutedAutoplaySupport() {
    canAutoplay.video({ timeout: 100, muted: false }).then(function (response) {
      if (response.result === false) {
        // Unmuted autoplay is not allowed.
        checkMutedAutoplaySupport();
      } else {
        // Unmuted autoplay is allowed.
        autoplayAllowed = true;
        autoplayRequiresMute = false;
        initPlayer();
      }
    });
  }

  function checkMutedAutoplaySupport() {
    canAutoplay.video({ timeout: 100, muted: true }).then(function (response) {
      if (response.result === false) {
        // Muted autoplay is not allowed.
        autoplayAllowed = false;
        autoplayRequiresMute = false;
        // this.mainPlayer.style.position = "fixed";
        // this.mainPlayer.style.bottom = 0;
        // this.mainPlayer.style.left = 0;
      } else {
        // Muted autoplay is allowed.
        autoplayAllowed = true;
        autoplayRequiresMute = true;
      }
      initPlayer();
    });
  }

  function initPlayer() {
    var vjsOptions = {
      autoplay: autoplayAllowed,
      muted: autoplayRequiresMute,
      debug: true,
    };
    player = videojs("content_video", vjsOptions);
    var imaOptions = {
      id: "content_video",
      adTagUrl: adTagAdsense,
      // 'https://googleads.g.doubleclick.net/pagead/ads?ad_type=video_text_image&client=ca-video-pub-4968145218643279&videoad_start_delay=0&description_url=http%3A%2F%2Fwww.google.com&max_ad_duration=30000&adtest=on'
      // "https://pubads.g.doubleclick.net/gampad/ads?iu=/22486823495/video_instream&description_url=https%3A%2F%2Fnetlink.vn%2F&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
      // "https://pubads.g.doubleclick.net/gampad/ads?iu=/93656639,52958642/outstream_video_OO&description_url=https%3A%2F%2Fnetlink.vn%2F&tfcd=0&npa=0&sz=300x250%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
    };

    player.ima(imaOptions);
    // player.ima.requestAds();

    if (!autoplayAllowed) {
      if (
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/Android/i)
      ) {
        startEvent = "touchend";
      }
      wrapperDiv = document.getElementById("content_video");
      wrapperDiv.addEventListener(startEvent, initAdDisplayContainer);
    }
  }
  function initAdDisplayContainer() {
    player.ima.initializeAdDisplayContainer();
    wrapperDiv.removeEventListener(startEvent, initAdDisplayContainer);
  }
  var startEvent = "click";
  checkUnmutedAutoplaySupport();
};
