//https://pubads.g.doubleclick.net/gampad/ads?iu=/22486823495/video_instream&description_url=https%3A%2F%2Fnetlink.vn%2F&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=
/**
 * Copyright 2014 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var autoplayAllowed = false;
var autoplayRequiresMute = false;
var player;
var wrapperDiv;
var Application = function () {
  this.mainPlayer = document.getElementById("mainPlayer");
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
  // getVideoDuration("video_netlink.mp4")
  //   .then(function (duration) {
  //     console.log("Video duration: " + duration + " seconds");
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //   });
  // function getVideoDuration(videoPath) {
  //   var video = document.createElement("video");
  //   video.src = videoPath;

  //   return new Promise(function (resolve, reject) {
  //     video.addEventListener("loadedmetadata", function () {
  //       var duration = video.duration;
  //       resolve(duration);
  //     });
  //     video.addEventListener("error", function () {
  //       reject("Error loading the video");
  //     });
  //   });
  // }

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
      adTagUrl:
        "https://pubads.g.doubleclick.net/gampad/ads?" +
        "iu=/21775744923/external/single_ad_samples&sz=640x480&" +
        "cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&" +
        "gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&" +
        "impl=s&correlator=",
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

Application.prototype.adsManagerLoadedCallback = function () {
  var events = [
    google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
    google.ima.AdEvent.Type.CLICK,
    google.ima.AdEvent.Type.COMPLETE,
    google.ima.AdEvent.Type.FIRST_QUARTILE,
    google.ima.AdEvent.Type.LOADED,
    google.ima.AdEvent.Type.MIDPOINT,
    google.ima.AdEvent.Type.PAUSED,
    google.ima.AdEvent.Type.RESUMED,
    google.ima.AdEvent.Type.STARTED,
    google.ima.AdEvent.Type.THIRD_QUARTILE,
  ];

  for (var index = 0; index < events.length; index++) {
    this.player.ima.addEventListener(events[index], this.onAdEvent.bind(this));
  }

  this.player.on("adslog", this.onAdLog.bind(this));
};

Application.prototype.onAdLog = function (data) {
  this.log("Ad log: " + data.data.AdError);
};

Application.prototype.onAdEvent = function (event) {
  var message = "Ad event: " + event.type;
  this.log(message);
};

Application.prototype.log = function (message) {
  this.console.innerHTML = this.console.innerHTML + "<br/>" + message;
};
