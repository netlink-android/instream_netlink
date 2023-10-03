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
      "https://pubads.g.doubleclick.net/gampad/ads?iu=/22486823495/video_instream&description_url=https%3A%2F%2Fnetlink.vn%2F&tfcd=0&npa=0&sz=640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=",
    // "https://pubads.g.doubleclick.net/gampad/ads?iu=/93656639,52958642/outstream_video_OO&description_url=https%3A%2F%2Fnetlink.vn%2F&tfcd=0&npa=0&sz=300x250%7C640x480&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator="
  };
  player.ima(imaOptions);

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
