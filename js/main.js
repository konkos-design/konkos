/* konkos.design - one script. Works without GSAP: nothing stays hidden if it fails to load. */
(function () {
  'use strict';
  var KD = window.KD || {}, T = window.I18N || {}, WORKS = KD.works || [];
  var doc = document.documentElement;
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var hasGsap = function () { return typeof window.gsap !== 'undefined' && !rm; };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---------------- language ---------------- */
  var lang = doc.dataset.lang === 'ua' ? 'ua' : 'en';
  var t = function (k) { var d = T[lang] || T.en; return k in d ? d[k] : T.en[k]; };
  function applyLang(first) {
    doc.lang = lang === 'ua' ? 'uk' : 'en'; doc.dataset.lang = lang;
    document.title = t('_title');
    $$('[data-i18n]').forEach(function (el) { var v = t(el.dataset.i18n); if (typeof v === 'string') el.textContent = v; });
    $$('[data-i18n-html]').forEach(function (el) { var v = t(el.dataset.i18nHtml); if (typeof v === 'string') el.innerHTML = v; });
    $$('[data-i18n-list]').forEach(function (el) {
      var arr = t(el.dataset.i18nList); if (!Array.isArray(arr)) return;
      $$(':scope > *', el).forEach(function (c, i) { if (arr[i] != null) c.textContent = arr[i]; });
    });
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    $$('.n-works').forEach(function (b) { b.textContent = WORKS.length; });
    syncThemeBtn();
    splitWords($('#h1'));
    if (!first) { buildGrid(); renderContacts(); fillBand(); measureSteps(); }
  }
  $$('.lang button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang; store.set('kd-lang', lang);
      var swap = function () { applyLang(false); if (window.ScrollTrigger) ScrollTrigger.refresh(); };
      if (hasGsap()) gsap.to('.hero__copy > :not(.strip)', { opacity: 0, y: 8, duration: .18, onComplete: function () {
        swap(); gsap.to('.hero__copy > :not(.strip)', { opacity: 1, y: 0, duration: .5, ease: 'expo.out' });
        gsap.from('#h1 .w', { yPercent: 60, opacity: 0, duration: .7, stagger: .04, ease: 'expo.out' });
      } }); else swap();
    });
  });

  /* ---------------- theme ---------------- */
  var themeBtn = $('#themeBtn'), clayScenes = [];
  function syncThemeBtn() {
    var dark = doc.dataset.theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', t(dark ? 'theme_light' : 'theme_dark'));
    $('#themeColor').setAttribute('content', dark ? '#0F0F0E' : '#F6EEE5');
  }
  function clayColors() {
    var dark = doc.dataset.theme === 'dark';
    clayScenes.forEach(function (s) { if (s.kind === 'k') s.api.setColors(dark ? 0xEEE5D8 : 0x161514, dark ? 0x161514 : 0xEEE5D8); });
  }
  themeBtn.addEventListener('click', function () {
    doc.dataset.theme = doc.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set('kd-theme', doc.dataset.theme); syncThemeBtn(); clayColors();
  });

  /* ---------------- header, active link, mobile bar ---------------- */
  var hdr = $('#hdr'), bar = $('#bar');
  if ('IntersectionObserver' in window) {
    var navLinks = $$('.nav a');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['work', 'process', 'price', 'faq', 'about', 'start', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    var near = {};
    var bo = new IntersectionObserver(function (es) { es.forEach(function (e) { near[e.target.id] = e.isIntersecting; }); bar.classList.toggle('is-hidden', !!(near.start || near.contact)); }, { threshold: .05 });
    bo.observe($('#start')); bo.observe($('#contact'));
  }

  /* ---------------- hero wall + mobile strip ---------------- */
  var img = function (id, kind) { return 'img/work/' + id + '-' + kind + '.webp'; };
  (function buildWall() {
    var cols = $$('.wall__col'); if (!cols.length) return;
    var lists = [[], [], []];
    WORKS.forEach(function (w, i) { lists[i % 3].push(w); });
    cols.forEach(function (col, c) {
      var html = lists[c].map(function (w, i) {
        var m = (i + c) % 3 === 1;
        return '<div class="wall__card' + (m ? ' wall__card--m' : '') + '"><img src="' + img(w.id, m ? 'm' : 'd-720') + '" alt="" loading="' + (i < 3 ? 'eager' : 'lazy') + '" decoding="async"></div>';
      }).join('');
      col.innerHTML = html + html;
    });
    var strip = $('#strip');
    if (strip) { var s = WORKS.map(function (w) { return '<img src="' + img(w.id, 'm') + '" alt="" loading="lazy" width="390" height="844">'; }).join(''); strip.innerHTML = s + s; }
  })();

  /* ---------------- marquee band ---------------- */
  function fillBand() {
    var tr = $('.band__track'); if (!tr) return;
    var row = tr.parentNode;
    $$('.band__track', row).slice(1).forEach(function (x) { x.remove(); });
    var clone = tr.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); row.appendChild(clone);
  }
  fillBand();

  /* ---------------- offer: steps light up in order ---------------- */
  (function offer() {
    var seq = $$('.offer__in > li'); if (!seq.length) return;
    var hovering = false, i = 0, timer = 0;
    var light = function (n) { seq.forEach(function (el, k) { el.classList.toggle('is-lit', k === n); }); };
    var tick = function () { light(i); i = (i + 1) % seq.length; };
    var start = function () { if (rm || timer) return; timer = setInterval(function () { if (!hovering) tick(); }, 650); };
    var stop = function () { clearInterval(timer); timer = 0; light(-1); };
    $$('.offer__step').forEach(function (s, k) {
      var on = function () { hovering = true; light(-1); var a = seq[seq.indexOf(s) + 1]; if (a) a.classList.add('is-lit'); };
      var off = function () { hovering = false; light(-1); };
      s.addEventListener('pointerenter', on); s.addEventListener('focus', on);
      s.addEventListener('pointerleave', off); s.addEventListener('blur', off);
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }, { threshold: .5 }).observe($('.offer'));
  })();

  /* ---------------- work grid ---------------- */
  var grid = $('#grid'), moreWrap = $('#more'), moreBtn = $('#moreBtn');
  var VISIBLE = 9, state = { trade: '' }, expanded = false, cards = [], motionReady = false;
  function buildGrid() {
    if (!grid) return;
    grid.innerHTML = WORKS.map(function (w, i) {
      var idea = (w.idea && (w.idea[lang] || w.idea.en)) || '';
      var meta = ((T[lang] || T.en).trade || {})[w.trade] + ' · ' + ((T[lang] || T.en).country || {})[w.country];
      return '<li class="card' + (i >= VISIBLE ? ' is-extra' : '') + '" data-id="' + w.id + '" data-trade="' + w.trade + '">' +
        '<button type="button" class="card__a" aria-label="' + esc(w.name) + '">' +
          '<div class="card__shots"><img class="card__d" src="' + img(w.id, 'd-720') + '" alt="' + esc(w.name) + '" width="720" height="450" loading="lazy" decoding="async">' +
          '<img class="card__m" src="' + img(w.id, 'm') + '" alt="" width="390" height="844" loading="lazy" decoding="async"></div>' +
          '<div class="card__meta"><h3>' + esc(w.name) + '</h3><span class="t">' + esc(meta) + '</span><span class="idea">' + esc(idea) + '</span></div>' +
        '</button></li>';
    }).join('');
    cards = $$('.card', grid);
    cards.forEach(function (c) { c.querySelector('.card__a').addEventListener('click', function () { openSheet(c.dataset.id, c); }); });
    applyFilter(false);
    if (motionReady) { revealCards(cards.filter(isShown)); cardParallax(); }
  }
  var isShown = function (c) { return !c.hidden && !(grid.classList.contains('is-collapsed') && c.classList.contains('is-extra')); };
  function applyFilter(animate) {
    var filtering = !!state.trade;
    cards.forEach(function (c) { c.hidden = filtering && c.dataset.trade !== state.trade; });
    grid.classList.toggle('is-collapsed', !filtering && !expanded);
    moreWrap.hidden = filtering || expanded;
    $$('#filters .chip').forEach(function (b) {
      b.setAttribute('aria-pressed', String((b.dataset.f || '') === state.trade));
      $('small', b).textContent = WORKS.filter(function (w) { return !b.dataset.f || w.trade === b.dataset.f; }).length;
    });
    if (animate && hasGsap()) gsap.fromTo(cards.filter(isShown), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .04, ease: 'expo.out', overwrite: true });
    if (window.ScrollTrigger && motionReady) requestAnimationFrame(function () { ScrollTrigger.refresh(); measureSteps(); });
  }
  $$('#filters .chip').forEach(function (b) { b.addEventListener('click', function () { state.trade = b.dataset.f || ''; applyFilter(true); }); });
  moreBtn.addEventListener('click', function () {
    var before = cards.filter(isShown).length; expanded = true; applyFilter(false);
    var fresh = cards.filter(isShown).slice(before);
    if (hasGsap()) gsap.fromTo(fresh, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .04, ease: 'expo.out' });
    if (fresh[0]) fresh[0].querySelector('.card__a').focus({ preventScroll: true });
  });

  /* ---------------- project sheet ---------------- */
  var sheet = $('#sheet'), list = [], idx = 0, lastCard = null;
  var byId = {}; WORKS.forEach(function (w) { byId[w.id] = w; });
  function fit() { var f = $('#sheetFrame'), box = f.parentNode.getBoundingClientRect(); var s = box.width / 390; f.style.setProperty('--s', s.toFixed(4)); f.style.height = (box.height / s) + 'px'; }
  function live(on) {
    var f = $('#sheetFrame'), w = list[idx];
    sheet.classList.toggle('is-live', on && !!w.repo);
    if (on && w.repo) { f.src = KD.base + w.repo + '/'; fit(); requestAnimationFrame(fit); f.focus({ preventScroll: true }); }
    else f.src = 'about:blank';
  }
  function fillSheet() {
    var w = list[idx], d = T[lang] || T.en;
    $('#sheetTitle').textContent = w.name;
    $('#sheetIdea').textContent = (w.idea && (w.idea[lang] || w.idea.en)) || '';
    $('#sheetTrade').textContent = d.trade[w.trade];
    $('#sheetCountry').textContent = d.country[w.country];
    $('#sheetLang').textContent = d.langs[w.lang] || w.lang;
    $('#sheetD').src = img(w.id, 'd'); $('#sheetD').alt = w.name;
    $('#sheetM').src = img(w.id, 'm');
    $('#sheetTry').hidden = !w.repo;
    $('#sheetCount').textContent = d.count.replace('{i}', idx + 1).replace('{n}', list.length);
    $('#sheetPrev').hidden = $('#sheetNext').hidden = list.length < 2;
    if (hasGsap()) gsap.fromTo('.sheet__info > *, .sheet__shots', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45, stagger: .04, ease: 'expo.out' });
  }
  function go(step) { live(false); idx = (idx + step + list.length) % list.length; fillSheet(); }
  function openSheet(id, card) {
    lastCard = card;
    list = cards.filter(function (c) { return !c.hidden; }).map(function (c) { return byId[c.dataset.id]; });
    idx = Math.max(0, list.findIndex(function (w) { return w.id === id; }));
    fillSheet();
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  sheet.addEventListener('close', function () { live(false); document.body.style.overflow = ''; if (lastCard) lastCard.querySelector('.card__a').focus({ preventScroll: true }); });
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  $('#sheetClose').addEventListener('click', function () { sheet.close(); });
  $('#sheetPrev').addEventListener('click', function () { go(-1); });
  $('#sheetNext').addEventListener('click', function () { go(1); });
  $('#sheetTry').addEventListener('click', function () { live(true); });
  $('#sheetBack').addEventListener('click', function () { live(false); });
  window.addEventListener('resize', function () { if (sheet.classList.contains('is-live')) fit(); });

  /* ---------------- contacts: form buttons + footer ---------------- */
  var C = KD.contacts || {};
  var ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 15.4c-1.2 0-2.4-.2-3.5-.6-.4-.1-.7 0-1 .2l-1.6 2c-2.8-1.4-5.5-3.9-6.9-6.8l2-1.7c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.5-.4-1-1-1H4.2c-.5 0-1.2.2-1.2 1C3 13.3 10.7 21 20 21c.7 0 1-.6 1-1.2v-3.4c0-.6-.5-1-1-1z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 7l8 6 8-6"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2A9.8 9.8 0 0 0 3.6 17l-1.4 4.8 5-1.3A9.8 9.8 0 1 0 12 2.2zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2c0 1.2.9 2.3 1 2.5.1.1 1.7 2.6 4.1 3.7 1.5.7 2.1.7 2.9.6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.3z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 4.2 18.4 19.4c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.4-.1-.6-.6-.2L5.9 12.9 1.1 11.4c-1-.3-1-1 .2-1.5L20.3 2.6c.9-.3 1.6.2 1.3 1.6z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7.4H16l.4-3h-2.9V8.8c0-.8.2-1.4 1.4-1.4h1.6V4.7a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.1H7.8v3h2.6V21h3.1z"/></svg>'
  };
  var LABEL = { phone: 'Phone', email: 'Email', whatsapp: 'WhatsApp', telegram: 'Telegram', instagram: 'Instagram', facebook: 'Facebook' };
  var val = function (k) { return String(C[k] || '').trim(); };
  var HREF = {
    phone: function (v) { return 'tel:' + v.replace(/[^\d+]/g, ''); }, email: function (v) { return 'mailto:' + v; },
    whatsapp: function (v) { return 'https://wa.me/' + v.replace(/\D/g, ''); }, telegram: function (v) { return 'https://t.me/' + v.replace(/^@/, ''); },
    instagram: function (v) { return 'https://instagram.com/' + v.replace(/^@/, ''); }, facebook: function (v) { return v; }
  };
  var SHOW = {
    phone: function (v) { return v; }, email: function (v) { return v; }, whatsapp: function (v) { return val('phone') && val('phone').replace(/\D/g, '') === v.replace(/\D/g, '') ? val('phone') : '+' + v.replace(/\D/g, ''); },
    telegram: function (v) { return '@' + v.replace(/^@/, ''); }, instagram: function (v) { return '@' + v.replace(/^@/, ''); }, facebook: function () { return 'konkos.design'; }
  };
  function item(k) {
    var v = val(k), name = k === 'phone' ? t('c_phone') : LABEL[k];
    if (!v) return '<li><span class="soon"><b class="ic-c">' + ICON[k] + '</b><span>' + name + '<small>' + esc(t('c_soon')) + '</small></span></span></li>';
    var ext = /^(https|mailto)/.test(HREF[k](v)) && k !== 'email' ? ' target="_blank" rel="noopener"' : '';
    return '<li><a href="' + esc(HREF[k](v)) + '"' + ext + '><b class="ic-c">' + ICON[k] + '</b><span>' + name + '<small>' + esc(SHOW[k](v)) + '</small></span></a></li>';
  }
  function message() {
    var f = $('#form'), v = function (n) { return (f.elements[n].value || '').trim(); };
    var L = [t('m_hello'), t('m_ask'), '', t('m_biz') + ': ' + v('biz')];
    if (v('link')) L.push(t('m_link') + ': ' + v('link'));
    if (v('city')) L.push(t('m_city') + ': ' + v('city'));
    if (v('note')) L.push('', v('note'));
    return L.join('\n');
  }
  function valid() {
    var i = $('#form').elements.biz, ok = !!i.value.trim();
    i.classList.toggle('err', !ok); $('#formErr').hidden = ok; if (!ok) i.focus();
    return ok;
  }
  function renderContacts() {
    $('#ftrContact').innerHTML = ['phone', 'email', 'whatsapp', 'telegram'].map(item).join('');
    $('#ftrSocial').innerHTML = ['instagram', 'facebook'].map(item).join('');
    var send = $('#send'); send.innerHTML = '';
    var add = function (k, label, fn, primary) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'btn ' + (primary ? 'btn--ink' : 'btn--line');
      b.innerHTML = ICON[k] + '<span>' + esc(label) + '</span>';
      b.addEventListener('click', function () { if (valid()) fn(); }); send.appendChild(b);
    };
    var first = true;
    if (val('whatsapp')) { add('whatsapp', t('send_wa'), function () { window.open(HREF.whatsapp(val('whatsapp')) + '?text=' + encodeURIComponent(message()), '_blank'); }, first); first = false; }
    if (val('telegram')) { add('telegram', t('send_tg'), function () {
      var go2 = function () { window.open(HREF.telegram(val('telegram')), '_blank'); };
      if (navigator.clipboard) navigator.clipboard.writeText(message()).then(function () { note(t('tg_copied')); go2(); }, go2); else go2();
    }, first); first = false; }
    if (val('email')) { add('email', t('send_mail'), function () { location.href = 'mailto:' + val('email') + '?subject=' + encodeURIComponent(t('m_ask')) + '&body=' + encodeURIComponent(message()); }, first); first = false; }
    $('#formHint').hidden = first;
    if (first) send.innerHTML = '<p class="form__hint">' + esc(t('no_contacts')) + '</p>';
  }
  function note(txt) { var p = $('#formHint'); p.textContent = txt; setTimeout(function () { p.textContent = t('l_hint'); }, 3200); }
  $('#form').addEventListener('submit', function (e) { e.preventDefault(); var b = $('#send .btn'); if (b) b.click(); });
  $('#form').elements.biz.addEventListener('input', function () { this.classList.remove('err'); $('#formErr').hidden = true; });
  $('#year').textContent = new Date().getFullYear();

  /* ---------------- process line: drawn from the real scroll position every frame ---------------- */
  var steps = $('#steps'), stepLis = $$('#steps li'), stepTops = [], lineMax = 0;
  function measureSteps() {
    if (!steps) return;
    stepTops = stepLis.map(function (li) { return li.offsetTop; });
    lineMax = stepTops[stepTops.length - 1];
    steps.style.setProperty('--lmax', lineMax + 'px');
  }
  function drawSteps() {
    if (!steps) return;
    var r = steps.getBoundingClientRect();
    var reach = innerHeight * .62 - r.top - 28;                // how far the "reading line" has come, in px from the first circle
    steps.style.setProperty('--lh', clamp(reach, 0, lineMax) + 'px');
    stepLis.forEach(function (li, i) { li.classList.toggle('is-on', reach >= stepTops[i] - 1); });
  }

  /* ---------------- scroll loop (header, steps) ---------------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { ticking = false; hdr.classList.toggle('is-scrolled', window.scrollY > 16); drawSteps(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measureSteps(); onScroll(); });
  window.addEventListener('load', function () { measureSteps(); onScroll(); });

  /* ---------------- 3D tilt for clay renders ---------------- */
  if (fine && !rm) $$('[data-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--ry', ((x - .5) * 14).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((.5 - y) * 12).toFixed(2) + 'deg');
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%'); el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
  });

  /* ---------------- clay 3D scenes, loaded on approach ---------------- */
  (function clay() {
    var hosts = $$('[data-clay]'); if (!hosts.length || !('IntersectionObserver' in window)) return;
    var loaded = false;
    var ob = new IntersectionObserver(function (es) {
      if (loaded || !es.some(function (e) { return e.isIntersecting; })) return;
      loaded = true; ob.disconnect();
      var sc = document.createElement('script');
      sc.src = 'js/clay.bundle.js';
      sc.onload = function () {
        try {
          var apis = window.KDClay.mount();
          clayScenes = apis.map(function (api, i) { return { kind: hosts[i].dataset.clay, api: api }; });
          clayColors();
        } catch (e) { console.warn('3D skipped', e); }
      };
      document.body.appendChild(sc);
    }, { rootMargin: '700px 0px' });
    hosts.forEach(function (h) { ob.observe(h); });
  })();

  /* ---------------- headline split ---------------- */
  function splitWords(el) {
    if (!el) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + esc(w) + '</span>'; }).join(' ');
  }

  applyLang(true);
  buildGrid();
  renderContacts();
  measureSteps(); drawSteps();

  /* ---------------- motion (GSAP) ---------------- */
  function revealCards(list) {
    if (!hasGsap() || !list.length) return;
    gsap.set(list, { opacity: 0, y: 32 });
    ScrollTrigger.batch(list, { start: 'top 92%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .07, ease: 'expo.out', overwrite: true }); } });
  }
  var cardTweens = [];
  function cardParallax() {
    cardTweens.forEach(function (tw) { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); }); cardTweens = [];
    if (!hasGsap() || !window.matchMedia('(min-width: 900px)').matches) return;
    cards.forEach(function (c, i) {
      var d = $('.card__d', c), m = $('.card__m', c), k = i % 3 === 1 ? 1.6 : 1;
      cardTweens.push(gsap.fromTo(m, { '--pm': (34 * k) + 'px' }, { '--pm': (-34 * k) + 'px', ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: .6 } }));
      cardTweens.push(gsap.fromTo(d, { '--pd': (10 * k) + 'px' }, { '--pd': (-10 * k) + 'px', ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: .6 } }));
    });
  }
  function motion() {
    if (!hasGsap()) { doc.classList.add('rm'); doc.classList.remove('js-anim'); return; }
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    motionReady = true;
    var mm = gsap.matchMedia();

    /* hero entrance */
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro.from('#pill', { y: 12, opacity: 0, duration: .8 }, .05)
         .from('#h1 .w', { yPercent: 70, opacity: 0, duration: 1.1, stagger: .06 }, .12)
         .from('#pitch, .hero__cta', { y: 18, opacity: 0, duration: .9, stagger: .09 }, .5)
         .from('.facts li', { y: 14, opacity: 0, duration: .8, stagger: .07 }, .75)
         .from('.strip', { y: 30, opacity: 0, duration: 1.2 }, .6);
    gsap.set('.hero__copy > *', { opacity: 1 });
    doc.classList.remove('js-anim');
    $$('.facts b[data-count]').forEach(function (b) {
      var o = { v: 0 }, n = +b.dataset.count;
      gsap.to(o, { v: n, duration: n > 1 ? 1.6 : .6, ease: 'power3.out', delay: .9, onUpdate: function () { b.textContent = Math.round(o.v) || (n === 1 ? 1 : 0); } });
    });

    /* the wall: three separate layers so nothing fights - #wall scrolls, #wallTilt enters, #wallPlane follows the mouse */
    gsap.set('#wall', { opacity: 1 });
    mm.add('(min-width: 900px)', function () {
      var wall = $('#wall'), plane = $('#wallPlane');
      intro.from('#wallTilt', { y: 160, opacity: 0, duration: 1.9 }, .15);
      gsap.set(plane, { rotationX: 50, rotationZ: -16 });
      var tz = gsap.quickTo(plane, 'rotationZ', { duration: 1.3, ease: 'power3.out' });
      var tx = gsap.quickTo(plane, 'rotationX', { duration: 1.3, ease: 'power3.out' });
      var inView = true;
      var onMove = function (e) { if (!inView || e.pointerType === 'touch') return; tz(-16 + (e.clientX / innerWidth - .5) * 7); tx(50 - (e.clientY / innerHeight - .5) * 9); };
      window.addEventListener('pointermove', onMove, { passive: true });
      gsap.fromTo(wall, { y: 0 }, { y: -180, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true } });
      ScrollTrigger.create({ trigger: '.hero', start: 'top bottom', end: 'bottom top', onToggle: function (s) { inView = s.isActive; wall.classList.toggle('is-off', !s.isActive); } });
      gsap.to('[data-par-copy]', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6 } });
      return function () { window.removeEventListener('pointermove', onMove); };
    });

    /* section heads rise in, then drift a little (parallax) */
    $$('.sec__head').forEach(function (el) {
      gsap.from(el.querySelectorAll('h2, .lead'), { y: 30, opacity: 0, duration: 1, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    mm.add('(min-width: 900px)', function () {
      $$('[data-par-head]').forEach(function (el) {
        gsap.fromTo(el, { y: 40 }, { y: -40, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      });
      $$('[data-par]').forEach(function (el) {
        var a = +el.dataset.par;
        gsap.fromTo(el, { yPercent: a }, { yPercent: -a, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: .8 } });
      });
      gsap.fromTo('.art--browser', { y: 60 }, { y: -40, ease: 'none', scrollTrigger: { trigger: '.faq', start: 'top bottom', end: 'bottom top', scrub: .8 } });
      gsap.fromTo('.receipt', { y: 70 }, { y: -50, ease: 'none', scrollTrigger: { trigger: '.price', start: 'top bottom', end: 'bottom top', scrub: .8 } });
      gsap.from('.stamp', { scale: 1.8, opacity: 0, duration: .7, ease: 'back.out(2.2)', scrollTrigger: { trigger: '.receipt', start: 'top 80%', once: true } });
    });

    /* data-rv items rise in once */
    var rv = $$('[data-rv]');
    gsap.set(rv, { opacity: 0, y: 32 });
    ScrollTrigger.batch(rv, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'expo.out', overwrite: true }); } });
    revealCards(cards.filter(isShown));
    cardParallax();

    /* marquee: runs on its own, speeds up and turns with scroll */
    var track = $$('.band__track');
    if (track.length) {
      var w = 0, x = 0, dir = 1, boost = 0;
      var measure = function () { w = $('.band__track').offsetWidth; };
      measure();
      gsap.ticker.add(function (_, dt) {
        var tr = $$('.band__track'); if (!w) return;
        x -= (0.045 + boost) * dt * dir; boost *= 0.92;
        if (x <= -w) x += w; if (x > 0) x -= w;
        tr.forEach(function (el) { el.style.transform = 'translate3d(' + x + 'px,0,0)'; });
      });
      ScrollTrigger.create({ trigger: '.band', start: 'top bottom', end: 'bottom top', onUpdate: function (s) { dir = s.direction; boost = Math.min(Math.abs(s.getVelocity()) / 4000, .6); } });
      window.addEventListener('resize', measure);
      if (document.fonts) document.fonts.ready.then(measure);
    }

    /* magnetic primary buttons (mouse only) */
    mm.add('(hover: hover) and (pointer: fine)', function () {
      $$('[data-mag]').forEach(function (b) {
        var span = b.querySelector('span');
        b.addEventListener('pointermove', function (e) { var r = b.getBoundingClientRect(), dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
          gsap.to(b, { x: dx * .18, y: dy * .25, duration: .5, ease: 'power3.out' }); gsap.to(span, { x: dx * .08, y: dy * .1, duration: .5, ease: 'power3.out' }); });
        b.addEventListener('pointerleave', function () { gsap.to([b, span], { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }); });
      });
    });

    var refresh = function () { ScrollTrigger.refresh(); measureSteps(); drawSteps(); };
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  }
  motion();
})();
