(() => {
  'use strict';

  const content = window.siteContent;
  const app = document.getElementById('app');
  if (!content || !app) return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const worlds = content.worlds;
  const sketches = content.sketches;
  const collections = content.collections;
  const motionFeature = collections.find((item) => item.id === 'motion').videos[0];
  const requestedId = new URLSearchParams(window.location.search).get('project');
  const selectedProject = [...worlds, ...sketches, ...collections].find((item) => item.id === requestedId);
  let activeWorld = 0;

  const projectHref = (id) => `?project=${encodeURIComponent(id)}`;
  const navHref = (id) => `${projectHref(id)}&rail=open`;
  const asset = (path) => escapeHtml(path);
  const label = (item) => item.status === 'candidate' ? 'AI 辅助候选视觉 · 非最终渲染'
    : item.status === 'final-video' ? '动态概念 · 视频为主要作品'
      : item.assetStatus === 'reserved' ? '画面待确认'
        : collections.includes(item) ? '分类作品 · 候选选图' : '概念开发中';
  const contactLink = () => `<a class="contact-email" href="mailto:${escapeHtml(content.person.email)}">联系邮箱 · ${escapeHtml(content.person.email)} ↗</a>`;

  function galleryFigure(item) {
    if (!item.clay) return `<figure class="gallery-image"><img src="${asset(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy"><figcaption>${escapeHtml(item.caption)}</figcaption></figure>`;
    return `<figure class="gallery-image gallery-image-compare" data-clay-reveal>
      <div class="gallery-compare-frame" style="--image-ratio:${item.aspect || 16 / 9}"><img src="${asset(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy"><img class="gallery-clay" src="${asset(item.clay)}" alt="" aria-hidden="true" loading="lazy"></div>
      <figcaption>${escapeHtml(item.caption)} <button type="button" class="gallery-reveal-toggle" aria-pressed="false">查看灰模</button></figcaption>
    </figure>`;
  }

  function sidebar() {
    return `
      <aside class="rail" id="site-rail" aria-label="作品目录">
        <a class="brand" href="index.html" aria-label="YUYIYU，返回首页">
          <strong>YUYIYU</strong><span>概念设计 / 作品集展示</span>
        </a>
        <button class="rail-toggle" type="button" aria-label="展开作品目录" aria-controls="rail-navigation" aria-expanded="false">目录 <span aria-hidden="true">↗</span></button>
        <nav id="rail-navigation" class="rail-navigation" aria-label="作品导航">
          <details class="nav-group concept-group" open>
            <summary class="nav-heading">概念设计</summary>
            <div class="nav-children">${worlds.map((world, index) => `<a class="nav-link ${selectedProject?.id === world.id ? 'is-current' : ''}" ${selectedProject?.id === world.id ? 'aria-current="page"' : ''} href="${navHref(world.id)}"><span class="nav-number">0${index + 1}</span><span>${escapeHtml(world.title)}</span></a>`).join('')}</div>
            <a class="nav-heading sketch-heading" href="index.html?rail=open#sketches">/初步概念设计稿</a>
            <div class="nav-children">${sketches.map((sketch) => `<a class="nav-link ${selectedProject?.id === sketch.id ? 'is-current' : ''}" ${selectedProject?.id === sketch.id ? 'aria-current="page"' : ''} href="${navHref(sketch.id)}"><span class="nav-number">·</span><span>${escapeHtml(sketch.title)}</span></a>`).join('')}</div>
          </details>
          <div class="nav-group nav-group-secondary">
            <a class="nav-heading ${selectedProject?.id === 'stylized' ? 'is-current' : ''}" href="${navHref('stylized')}">风格化</a>
            <a class="nav-heading ${selectedProject?.id === 'commercial' ? 'is-current' : ''}" href="${navHref('commercial')}">电商渲染</a>
            <a class="nav-heading ${selectedProject?.id === 'motion' ? 'is-current' : ''}" href="${navHref('motion')}">视频专栏</a>
          </div>
        </nav>
        <span class="rail-foot">YUYIYU <span>© 2026</span></span>
      </aside>`;
  }

  function stage(world, index) {
    const hasImage = Boolean(world.cover);
    return `<section class="world-stage ${hasImage ? 'has-cover' : 'is-reserved'}" id="worlds" aria-label="当前展示：${escapeHtml(world.title)}">
      ${hasImage ? `<img class="stage-image" src="${asset(world.cover)}" alt="${escapeHtml(world.alt)}">` : `<div class="stage-empty" aria-hidden="true"><span>IMAGE RESERVED</span></div>`}
      <div class="stage-scrim"></div>
      <div class="stage-topline"><span>YUYIYU — SELECTED CONCEPTS</span><span>CONCEPT / VISUAL DEVELOPMENT</span></div>
      <div class="stage-copy">
        <p class="eyebrow">0${index + 1} / 0${worlds.length}　${escapeHtml(world.stateLabel)}</p>
        <h1>${escapeHtml(world.title)}</h1>
        <p class="stage-thesis">${escapeHtml(world.thesis)}</p>
        <p class="asset-label">${label(world)}</p>
        <a class="explore-link" href="${projectHref(world.id)}">概念展开 <span aria-hidden="true">↗</span></a>
      </div>
    </section>`;
  }

  function home() {
    return `${sidebar()}<main id="main-content" class="main-shell home-shell">
      <div id="stage-mount">${stage(worlds[activeWorld], activeWorld)}</div>
      <div class="filmstrip" role="group" aria-label="切换四个概念设计作品">
        ${worlds.map((world, index) => `<button class="film-item ${index === activeWorld ? 'is-active' : ''}" type="button" data-world-index="${index}" aria-label="切换到${escapeHtml(world.title)}" aria-pressed="${index === activeWorld}">
          ${world.cover ? `<img src="${asset(world.cover)}" alt="">` : '<span class="film-empty" aria-hidden="true"></span>'}
          <span class="film-caption"><small>0${index + 1}</small><strong>${escapeHtml(world.title)}</strong></span>
        </button>`).join('')}
      </div>
      <p class="view-hint">选择下方作品，点击「概念展开」查看独立作品页。</p>
      <section class="sketch-section" id="sketches"><div class="section-intro"><span class="section-kicker">STUDIES / OPEN SLOTS</span><h2>/初步概念设计稿</h2><p>钢琴空间与星空花海现已展示成品画面；机甲位置留待后续补充。</p></div>
        <div class="sketch-grid">${sketches.map((sketch) => `<a class="sketch-card${sketch.cover ? ' has-cover' : ''}" href="${projectHref(sketch.id)}">${sketch.cover ? `<img src="${asset(sketch.cover)}" alt="${escapeHtml(sketch.alt)}">` : '<span class="reserved-mark">IMAGE RESERVED</span>'}<strong>${escapeHtml(sketch.title)}</strong><span>${sketch.cover ? '查看作品 ↗' : '查看预留页 ↗'}</span></a>`).join('')}</div>
      </section>
      <section class="more-section" id="other-media"><div class="section-intro"><span class="section-kicker">OTHER PRACTICES</span><h2>更多视觉练习</h2><p>风格化、电商渲染与动态作品是主线之外的补充。</p></div>
        <div class="more-grid">
          <a class="more-card" id="stylized" href="${projectHref('stylized')}"><img src="assets/portfolio/flower.png" alt="花艺形态研究的视觉画面"><div><span>01 / STYLIZED</span><h3>风格化</h3><p>花艺形态与色彩研究。</p><small>展开多图展示 ↗</small></div></a>
          <a class="more-card" id="commercial" href="${projectHref('commercial')}"><img src="assets/portfolio/still-life.png" alt="器皿与植物的商业静物画面"><div><span>02 / COMMERCIAL</span><h3>电商渲染</h3><p>器皿、玻璃与植物的材质和光线。</p><small>展开多图展示 ↗</small></div></a>
          <a class="more-card more-card-motion" id="motion" href="${projectHref('motion')}"><img src="${asset(motionFeature.cover)}" alt="${escapeHtml(motionFeature.alt)}"><div><span>03 / MOTION</span><h3>视频专栏</h3><p class="motion-feature"><strong>${escapeHtml(motionFeature.title)}</strong><span>${escapeHtml(motionFeature.subtitle)}</span></p><small>展开视频专栏 ↗</small></div></a>
        </div>
      </section>
      <footer class="site-footer"><span>YUYIYU · 概念设计 / 作品集展示</span>${contactLink()}</footer>
    </main>`;
  }

  function videoCards(videos, page) {
    return videos.slice(page * 3, page * 3 + 3).map((video, offset) => `<a class="video-card" href="${escapeHtml(video.url)}" target="_blank" rel="noopener noreferrer" aria-label="观看视频：${escapeHtml(video.title)}"><div class="video-card-cover"><img src="${asset(video.cover)}" alt="${escapeHtml(video.alt)}"><span class="video-card-play" aria-hidden="true">↗</span></div><div class="video-card-copy"><span>0${page * 3 + offset + 1} / VIDEO</span><h3>${escapeHtml(video.title)}</h3><p>${escapeHtml(video.subtitle)}</p><small>前往 B 站观看 ↗</small></div></a>`).join('');
  }

  function detail(project) {
    const isSketch = sketches.includes(project);
    const isCollection = collections.includes(project);
    const currentIndex = worlds.indexOf(project);
    const next = isSketch || isCollection ? null : worlds[(currentIndex + 1) % worlds.length];
    const description = project.thesis || '这一项初步概念设计的展示素材尚待确认。';
    return `${sidebar()}<main id="main-content" class="main-shell detail-shell">
      <div class="detail-bar"><a href="index.html">← 返回概念展示</a><span>${isSketch ? '/初步概念设计稿' : isCollection ? escapeHtml(project.category) : `0${currentIndex + 1} / 0${worlds.length}`}</span></div>
      <header class="detail-hero ${project.cover ? 'has-cover' : 'is-reserved'}">
        ${project.cover ? `<img src="${asset(project.cover)}" alt="${escapeHtml(project.alt || project.title)}">` : `<div class="detail-empty"><span>IMAGE RESERVED</span><small>等待确认的作品图</small></div>`}
        <div class="detail-shade"></div>
        <div class="detail-title"><span>${isSketch ? 'CONCEPT STUDY' : isCollection ? escapeHtml(project.category) : 'SELECTED CONCEPT'}</span><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(description)}</p></div>
      </header>
      <div class="detail-body">
        <div class="detail-intro"><span>ABOUT THE CONCEPT</span><p>${escapeHtml(description)}</p></div>
        <div class="gallery-head"><h2>${project.videos ? '视频作品' : '画面与过程'}</h2><span>${project.videos ? '选择作品，前往 B 站观看' : project.gallery?.some((item) => item.clay) ? '左右移动鼠标，查看灰模或白膜参考' : isCollection ? '当前选图 + 后续可扩展位置' : isSketch && project.gallery?.length ? '已确认的成品画面' : '现有画面 + 后续可扩展位置'}</span></div>
        ${project.videos ? `<div class="video-gallery" id="video-gallery">${videoCards(project.videos, 0)}</div><div class="video-pager" aria-label="视频作品翻页"><span id="video-page-status" aria-live="polite">01 / ${String(Math.ceil(project.videos.length / 3)).padStart(2, '0')}</span><button type="button" data-video-page="previous" aria-label="上一页视频" disabled>←</button><button type="button" data-video-page="next" aria-label="下一页视频">→</button></div>` : `<div class="gallery-stack${project.id === 'stylized' ? ' stylized-gallery' : ''}">
          ${project.gallery ? project.gallery.map(galleryFigure).join('')
            : project.cover ? `<figure class="gallery-image ${project.galleryLayout === 'portrait' ? 'is-portrait' : ''}"><img src="${asset(project.cover)}" alt="${escapeHtml(project.alt || project.title)}"><figcaption>${label(project)} · ${escapeHtml(project.disclosure || '')}</figcaption></figure>`
              : `<div class="gallery-reserved"><span>01 / IMAGE RESERVED</span><p>这一画面尚未选定，保留原位。</p></div>`}
          ${project.id === 'commercial' || isSketch && project.gallery?.length ? '' : `<div class="gallery-reserved"><span>${isCollection ? '04' : '02'} / IMAGE RESERVED</span><p>为后续补充画面保留。</p></div>
          <div class="gallery-reserved"><span>${isCollection ? '05' : '03'} / IMAGE RESERVED</span><p>为后续补充过程稿保留。</p></div>`}
        </div>`}
        <aside class="making-note"><h2>展示说明</h2><p>${escapeHtml(project.disclosure || project.sourceNote || '')}</p>${project.sourceNote && project.disclosure ? `<p>${escapeHtml(project.sourceNote)}</p>` : ''}</aside>
        ${project.video?.id ? `<p class="video-note"><a href="https://www.bilibili.com/video/${encodeURIComponent(project.video.id)}" target="_blank" rel="noopener noreferrer">观看已发布动态作品 ↗</a><span>此链接需要联网；离线页面本身可正常浏览。</span></p>` : ''}
        <div class="detail-next">${next ? `<a href="${projectHref(next.id)}">NEXT <strong>${escapeHtml(next.title)}</strong><small class="next-kind">概设</small><span aria-hidden="true">↗</span></a>` : isCollection ? `<a href="${project.videos ? 'index.html' : 'index.html#other-media'}">${project.videos ? '返回展示首页' : '返回更多视觉练习'} ↗</a>` : `<a href="index.html#sketches">返回初步概念设计稿 ↗</a>`}</div>
      </div>
      <footer class="site-footer"><span>YUYIYU · 概念设计 / 作品集展示</span>${contactLink()}</footer>
    </main>`;
  }

  app.innerHTML = selectedProject ? detail(selectedProject) : home();
  const rail = document.getElementById('site-rail');
  const railToggle = rail.querySelector('.rail-toggle');
  if (new URLSearchParams(window.location.search).get('rail') === 'open') {
    rail.classList.add('is-navigation-open');
    try {
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete('rail');
      window.history.replaceState(null, '', cleanUrl.href);
    } catch { /* If file history is restricted, the rail still expands. */ }
  }
  rail.addEventListener('pointerleave', () => rail.classList.remove('is-navigation-open'));
  railToggle.addEventListener('click', () => {
    const expanded = rail.classList.toggle('is-open');
    railToggle.setAttribute('aria-expanded', String(expanded));
    railToggle.setAttribute('aria-label', expanded ? '收起作品目录' : '展开作品目录');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') rail.classList.remove('is-navigation-open');
    if (event.key === 'Escape' && rail.classList.contains('is-open')) {
      rail.classList.remove('is-open');
      railToggle.setAttribute('aria-expanded', 'false');
      railToggle.focus();
    }
  });

  document.querySelectorAll('[data-clay-reveal]').forEach((figure) => {
    const frame = figure.querySelector('.gallery-compare-frame');
    const button = figure.querySelector('.gallery-reveal-toggle');
    let pinned = false;
    const show = (percent) => figure.style.setProperty('--reveal', `${percent * 1.2 - 10}%`);
    frame.addEventListener('pointermove', (event) => {
      if (pinned) return;
      figure.classList.remove('is-returning');
      const bounds = frame.getBoundingClientRect();
      show(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
    });
    frame.addEventListener('pointerleave', () => {
      if (pinned) return;
      figure.classList.add('is-returning');
      show(0);
    });
    button.addEventListener('click', () => {
      pinned = !pinned;
      figure.classList.remove('is-returning');
      show(pinned ? 100 : 0);
      button.setAttribute('aria-pressed', String(pinned));
      button.textContent = pinned ? '查看渲染图' : '查看灰模';
    });
  });

  if (selectedProject?.videos && document.querySelectorAll('[data-video-page]').length === 2) {
    const buttons = document.querySelectorAll('[data-video-page]');
    const gallery = document.getElementById('video-gallery');
    const status = document.getElementById('video-page-status');
    const pages = Math.ceil(selectedProject.videos.length / 3);
    let page = 0;
    buttons[0].disabled = true;
    buttons[1].disabled = pages <= 1;
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      page = Math.max(0, Math.min(pages - 1, page + (index === 0 ? -1 : 1)));
      gallery.innerHTML = videoCards(selectedProject.videos, page);
      status.textContent = `${String(page + 1).padStart(2, '0')} / ${String(pages).padStart(2, '0')}`;
      buttons[0].disabled = page === 0;
      buttons[1].disabled = page === pages - 1;
    }));
  }

  if (!selectedProject) {
    document.querySelectorAll('[data-world-index]').forEach((button) => {
      button.addEventListener('click', () => {
        activeWorld = Number(button.dataset.worldIndex);
        document.getElementById('stage-mount').innerHTML = stage(worlds[activeWorld], activeWorld);
        document.querySelectorAll('[data-world-index]').forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
      });
    });
  }
})();
