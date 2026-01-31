// ==UserScript==
// @name         Changjiang Yuketang xcloud video helper (minimal)
// @namespace    https://greasyfork.org/users/1566377-frank-678
// @version      0.1.0
// @description  为雨课堂长江站 xcloud 回放页添加：A/D 快进快退、空格暂停、R 设置倍速、右下角 mp4 直链下载（blob 源提示不支持）。
// @author       Frank-678
// @license      MIT
// @match        https://changjiang.yuketang.cn/v2/web/xcloud/video-student/*
// @run-at       document-idle
// @grant        none
// @homepageURL  https://github.com/Frank-678/Changjiang-Yuketang-xcloud-video-helper
// @supportURL   https://github.com/Frank-678/Changjiang-Yuketang-xcloud-video-helper/issues
// @downloadURL https://update.greasyfork.org/scripts/564640/Changjiang%20Yuketang%20xcloud%20video%20helper%20%28minimal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564640/Changjiang%20Yuketang%20xcloud%20video%20helper%20%28minimal%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  let video = null;
  let rate = 1;

  const bind = (v) => {
    video = v;
    video.playbackRate = rate;

    window.addEventListener('keydown', (e) => {
      if (!video) return;
      if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;

      if (e.code === 'KeyA') video.currentTime = Math.max(0, video.currentTime - 10);
      else if (e.code === 'KeyD') video.currentTime = Math.min(video.duration || Infinity, video.currentTime + 10);
      else if (e.code === 'Space') { e.preventDefault(); video.paused ? video.play() : video.pause(); }
      else if (e.code === 'KeyR') { // 按 R 输入倍速
        const x = prompt('rate?', String(rate));
        const r = Number(x);
        if (Number.isFinite(r) && r > 0) { rate = r; video.playbackRate = rate; }
      }
    }, true);

    const btn = document.createElement('button');
    btn.textContent = '下载';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 999999,
      padding: '10px 14px',
      border: '0',
      borderRadius: '10px',
      background: '#1C223B',
      color: '#fff',
      cursor: 'pointer'
    });

    btn.onclick = () => {
      const src = video.currentSrc || video.src;
      if (!src) return alert('未获取到视频地址');
      if (src.startsWith('blob:')) return alert('blob 源无法直接下载');
      window.open(src, '_blank');
    };

    document.body.appendChild(btn);
  };

  const findVideo = () => document.querySelector('#video-box video') || document.querySelector('video');

  const v0 = findVideo();
  if (v0) return bind(v0);

  const mo = new MutationObserver(() => {
    const v = findVideo();
    if (v) { mo.disconnect(); bind(v); }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
