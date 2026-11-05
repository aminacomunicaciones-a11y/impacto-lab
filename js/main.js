/* Impacto Lab · web oficial. Sin librerías, sin analítica, sin cookies.
   Todo lo pesado (vídeo) se carga solo cuando hace falta y nunca si el
   visitante pide poco movimiento o ahorro de datos. */
(function () {
  'use strict';
  var d = document, w = window, root = d.documentElement;
  var quieto = /[?&]quieto\b/.test(location.search);
  if (quieto) {
    root.classList.add('quieto');
    // para capturas: imágenes sin pereza y salto directo a la sección pedida (?ir=arena)
    var ir = (location.search.match(/[?&]ir=([a-z]+)/) || [])[1];
    w.addEventListener('load', function () {
      $$('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; });
      if (ir && d.getElementById(ir)) setTimeout(function () { d.getElementById(ir).scrollIntoView({ behavior: 'instant', block: 'start' }); }, 50);
    });
  }
  var reduce = quieto || w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var autoplayOK = !reduce && !saveData;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  /* textos de este script en cada idioma (el idioma lo marca <html lang>) */
  var LG = (root.lang || 'es').slice(0, 2);
  var TXS = {
    es: { boot: ['Preparando la sala de ensayo…', 'Calibrando la barrera…', 'Contando oficinistas…', 'Abriendo la alcantarilla…'], clip: 'Ver clip', play: 'Reproducir: ', clip2: 'clip', on: 'Sonido: sí', off: 'Sonido: no' },
    en: { boot: ['Setting up the test room…', 'Calibrating the barrier…', 'Counting office workers…', 'Opening the manhole…'], clip: 'Watch clip', play: 'Play: ', clip2: 'clip', on: 'Sound: on', off: 'Sound: off' },
    pt: { boot: ['Preparando a sala de testes…', 'Calibrando a barreira…', 'Contando funcionários…', 'Abrindo o bueiro…'], clip: 'Ver clipe', play: 'Reproduzir: ', clip2: 'clipe', on: 'Som: sim', off: 'Som: não' }
  };
  var TX = TXS[LG] || TXS.es;

  /* ---------- arranque ---------- */
  var boot = $('#boot'), body = d.body;
  var seen = false;
  try { seen = sessionStorage.getItem('il-boot') === '1'; } catch (e) {}
  if (location.hash) seen = true;
  function start() {
    if (body.classList.contains('go')) return;
    body.classList.add('go');
    if (boot) boot.classList.add('off');
    try { sessionStorage.setItem('il-boot', '1'); } catch (e) {}
    // el título cae letra a letra y, cuando aterriza la última, el flash y la sacudida
    var letters = $$('#hero h1 span');
    letters.forEach(function (s, i) { s.style.animationDelay = (0.15 + i * 0.07) + 's'; });
    if (!reduce) {
      var t = 150 + letters.length * 70 + 300;
      setTimeout(function () {
        var f = $('#flash');
        if (f) { f.style.transition = 'none'; f.style.opacity = '.85'; requestAnimationFrame(function () { f.style.transition = 'opacity .5s ease-out'; f.style.opacity = '0'; }); }
        body.classList.add('shake');
        setTimeout(function () { body.classList.remove('shake'); }, 400);
      }, t);
    }
    setTimeout(function () { $('#hud').classList.add('on'); }, reduce ? 0 : 1400);
    setTimeout(function () { body.classList.add('settled'); }, reduce ? 0 : 2200);
  }
  if (reduce || seen || !boot) {
    root.classList.add('no-boot');
    if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
  } else {
    var msgs = TX.boot;
    var m = $('#bootMsg'), k = 0;
    requestAnimationFrame(function () { boot.classList.add('run'); });
    var iv = setInterval(function () { k++; if (m && msgs[k]) m.textContent = msgs[k]; }, 230);
    // la pantalla de arranque dura menos de un segundo: antes eran 1,65 s y retrasaba que se viera la portada
    setTimeout(function () { clearInterval(iv); start(); }, 950);
    $('#bootSkip').addEventListener('click', function () { clearInterval(iv); start(); });
  }

  /* ---------- letras del título ---------- */
  var h1 = $('#hero h1');
  if (h1 && !h1.dataset.split) {
    var txt = h1.textContent.trim();
    h1.setAttribute('aria-label', txt);
    h1.innerHTML = txt.split(' ').map(function (word) {
      return '<span aria-hidden="true">' + word.split('').map(function (ch) { return '<span>' + ch + '</span>'; }).join('') + '</span>';
    }).join('<span class="sp" aria-hidden="true"> </span>');
    h1.dataset.split = '1';
  }

  /* ---------- vídeos perezosos ---------- */
  // Cada .vid lleva data-src (y data-webm si lo hubiera). El <video> se crea al acercarse,
  // se reproduce solo mientras se ve y se para al salir. Con poco movimiento o ahorro de
  // datos no arranca nada: se queda la imagen con un botón de reproducir.
  var vids = $$('.vid[data-src]');
  function build(box) {
    if (box.dataset.built) return $('video', box);
    box.dataset.built = '1';
    var v = d.createElement('video');
    v.muted = true; v.loop = box.dataset.loop !== '0'; v.playsInline = true; v.preload = 'metadata';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
    if (box.dataset.controls === '1') { v.controls = true; v.loop = false; v.muted = false; v.preload = 'auto'; }
    var poster = $('img', box); if (poster) v.poster = poster.currentSrc || poster.src;
    v.src = box.dataset.src;
    v.addEventListener('playing', function () { v.classList.add('ready'); box.classList.add('playing'); });
    box.insertBefore(v, box.firstChild);
    return v;
  }
  function unload(box) {
    var v = $('video', box); if (!v) return;
    try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
    v.remove(); delete box.dataset.built; box.classList.remove('playing');
  }
  function tryPlay(v, box) {
    var p = v.play();
    if (p && p.catch) p.catch(function () { if (box && !$('.play', box)) { playBtn(box); } });
  }
  function playBtn(box) {
    var b = d.createElement('button'); b.className = 'play'; b.type = 'button';
    b.innerHTML = '<b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg></b><span>' + (box.dataset.label || TX.clip) + '</span>';
    b.setAttribute('aria-label', TX.play + (box.dataset.label || TX.clip2));
    b.addEventListener('click', function () {
      var v = build(box);
      if (box.dataset.controls === '1') { v.muted = false; }
      tryPlay(v); b.remove();
    });
    box.appendChild(b);
  }
  var io = 'IntersectionObserver' in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var box = e.target, v = $('video', box);
      if (e.isIntersecting) {
        clearTimeout(box._drop);
        if (!v) v = build(box);
        if (!v.controls) tryPlay(v, box);
      } else if (v && !v.controls) {
        v.pause();
        // lejos de la pantalla, el vídeo se suelta del todo: en un móvil cada <video> vivo cuesta memoria
        clearTimeout(box._drop);
        box._drop = setTimeout(function () { unload(box); }, 2500);
      }
    });
  }, { rootMargin: '200px 0px' }) : null;
  // El vídeo de la portada (4,4 MB) no se pide al entrar: primero se ve su fotograma y el vídeo arranca al primer gesto
  // (tocar, deslizar, rueda, tecla) o a los 6 s de cargar la página. Así la portada se pinta antes en móviles flojos.
  var heroWait = [];
  function heroGo() {
    if (!heroWait) return;
    var q = heroWait; heroWait = null;
    ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) { w.removeEventListener(ev, heroGo, true); });
    q.forEach(function (box) { io.observe(box); });
  }
  vids.forEach(function (box) {
    if (box.dataset.controls === '1' || !autoplayOK || !io) { playBtn(box); return; }
    if (box.closest('#hero')) { heroWait.push(box); return; }
    io.observe(box);
  });
  if (heroWait.length) {
    ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach(function (ev) { w.addEventListener(ev, heroGo, { capture: true, passive: true }); });
    var heroT = function () { setTimeout(heroGo, 6000); };
    if (d.readyState === 'complete') heroT(); else w.addEventListener('load', heroT);
  } else heroWait = null;

  /* ---------- sonido opcional (apagado por defecto) ---------- */
  var snd = $('#btnSound'), soundOn = false;
  function applySound() {
    $$('.vid[data-sound="1"] video').forEach(function (v) { v.muted = !soundOn; });
    snd.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
    $('#sndTxt').textContent = soundOn ? TX.on : TX.off;
  }
  if (snd) snd.addEventListener('click', function () {
    soundOn = !soundOn;
    if (soundOn) $$('.vid[data-sound="1"]').forEach(function (box) { if (!$('video', box)) { build(box); } });
    applySound();
    $$('.vid[data-sound="1"] video').forEach(function (v) { if (v.paused) tryPlay(v); });
  });
  // si el sonido está activo, solo suena el clip que se ve
  if (io && snd) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { var v = $('video', e.target); if (v) v.muted = !(soundOn && e.isIntersecting && e.intersectionRatio > .5); });
    }, { threshold: [0, .5, 1] });
    $$('.vid[data-sound="1"]').forEach(function (b) { sio.observe(b); });
  }

  /* ---------- revelados al hacer scroll ---------- */
  var rv = $$('.rv,.wipe'), pending = rv.slice();
  if (io && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { rio.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });
  // red de seguridad: lo que ya ha pasado por la pantalla se queda a la vista aunque el observador no haya avisado
  function sweep() {
    if (!pending.length) return;
    var lim = w.innerHeight * 1.05;
    pending = pending.filter(function (el) {
      if (el.classList.contains('in')) return false;
      if (el.getBoundingClientRect().top < lim) { el.classList.add('in'); return false; }
      return true;
    });
  }

  /* ---------- instrumentos: oleada = sección, pantalla = lo que queda por ver ---------- */
  var secs = $$('main section[id]'), roSec = $('#roSec'), roName = $('#roName'), integ = $('#integ'), fill = $('#integFill'), pct = $('#integPct');
  var dock = $('#dock'), cats = $$('#dock .cat');
  var ticking = false;
  function paint() {
    ticking = false;
    var y = w.scrollY || root.scrollTop, h = root.scrollHeight - w.innerHeight;
    var left = h > 0 ? Math.max(0, 1 - y / h) : 1;
    if (fill) fill.style.transform = 'scaleX(' + left.toFixed(4) + ')';
    if (pct) pct.textContent = Math.round(left * 100) + '%';
    if (integ) integ.classList.toggle('low', left < .25);
    var cur = null, mid = y + w.innerHeight * .4;
    secs.forEach(function (s) { if (s.offsetTop <= mid) cur = s; });
    if (cur) {
      var n = secs.indexOf(cur);
      if (roSec) roSec.textContent = (n < 9 ? '0' : '') + (n + 1);
      if (roName) roName.textContent = cur.dataset.name || '';
      cats.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + cur.id); });
    }
    if (dock) dock.classList.toggle('on', y > w.innerHeight * .55);
    sweep();
  }
  w.addEventListener('scroll', paint, { passive: true });
  w.addEventListener('resize', paint);
  paint();

  /* ---------- arsenal: pestañas del bastidor ---------- */
  var tabs = $$('.tab'), panels = $$('.panel');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      panels.forEach(function (p) { p.classList.toggle('on', p.id === t.getAttribute('aria-controls')); });
      t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- lista de espera: la dirección del formulario está en js/lista.js ---------- */
  var WL = (typeof w.WAITLIST_URL === 'string' && /^https:\/\//.test(w.WAITLIST_URL)) ? w.WAITLIST_URL : '';
  $$('[data-waitlist]').forEach(function (a) {
    if (WL) { a.href = WL; a.removeAttribute('aria-disabled'); a.classList.remove('off'); }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.classList.add('off'); }
  });
  $$('[data-waitlist-off]').forEach(function (e) { e.hidden = !!WL; });

  /* ---------- contador de la portada ---------- */
  var cnt = $('#roArms');
  if (cnt && !reduce) {
    var target = parseInt(cnt.dataset.n, 10) || 0, t0 = null;
    // a saltos de 100 ms (no a cada fotograma): cada cambio de texto obliga a recolocar la página
    function step() { if (!t0) t0 = Date.now(); var k = Math.min(1, (Date.now() - t0) / 1400); k = 1 - Math.pow(1 - k, 3); cnt.textContent = Math.round(target * k); if (k < 1) setTimeout(step, 100); }
    setTimeout(step, seen ? 300 : 1500);
  }
})();
