const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navMenu = document.querySelector('[data-nav-menu]');
const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const year = document.querySelector('[data-year]');

if (year) {
  year.textContent = new Date().getFullYear();
}

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 12);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
});

navMenu?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navMenu.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

// --- Gmail compose popup (Order Now buttons) ---
const GMAIL_TO = 'runtyjudge74@gmail.com';
const GMAIL_SUBJECT = 'Website Development Inquiry';
const GMAIL_BODY = [
  'Hello Faheem,',
  '',
  'I would like to enquire about a website.',
  '',
  'Business Name:',
  '',
  'Business Type:',
  '',
  'Type of Website:',
  '',
  'Pages Required:',
  '',
  'Additional Information:',
  '',
  'Regards,',
].join('\n');

const openGmailCompose = (to, subject, body) => {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body });
  const url = `https://mail.google.com/mail/?${params.toString()}`;
  const width = 720;
  const height = 680;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);
  const popup = window.open(
    url,
    'gmail-compose',
    `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`
  );

  // Popup blocked or failed to open: fall back to the default mail handler.
  if (!popup) {
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
};

document.querySelectorAll('.js-gmail-order').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openGmailCompose(GMAIL_TO, GMAIL_SUBJECT, GMAIL_BODY);
  });
});

// --- Animated ribbon graphic (hero visual) ---
const RIBBON_COLORS = ['#22d3c0', '#38bdf8', '#6366f1', '#a855f7', '#d946ef', '#ec4899', '#fb7185'];

const hexToRgb = (hex) => {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
};

const rgbToHex = (rgb) =>
  `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

const ribbonColorAt = (t) => {
  const clamped = Math.min(Math.max(t, 0), 1);
  const scaled = clamped * (RIBBON_COLORS.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(index + 1, RIBBON_COLORS.length - 1);
  const localT = scaled - index;
  const from = hexToRgb(RIBBON_COLORS[index]);
  const to = hexToRgb(RIBBON_COLORS[nextIndex]);
  const mixed = from.map((channel, i) => channel + (to[i] - channel) * localT);
  return rgbToHex(mixed);
};

const buildRibbon = (container) => {
  const svgNS = 'http://www.w3.org/2000/svg';
  const width = 700;
  const height = 420;
  const stripCount = 72;

  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Animated flowing ribbon graphic');

  for (let i = 0; i < stripCount; i += 1) {
    const t = i / (stripCount - 1);
    const x = t * width;
    const wave = Math.sin(t * Math.PI * 2.4) * 74;
    const y = height / 2 + wave;
    const rotate = Math.sin(t * Math.PI * 2.4 + 0.3) * 30;
    const stripHeight = 80 + Math.sin(t * Math.PI) * 130;
    const stripWidth = width / stripCount - 2.4;

    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('class', 'ribbon-strip');
    rect.setAttribute('x', (-stripWidth / 2).toString());
    rect.setAttribute('y', (-stripHeight / 2).toString());
    rect.setAttribute('width', stripWidth.toString());
    rect.setAttribute('height', stripHeight.toString());
    rect.setAttribute('rx', '2.4');
    rect.setAttribute('fill', ribbonColorAt(t));
    rect.setAttribute('opacity', '0.94');
    rect.setAttribute(
      'transform',
      `translate(${x} ${y}) rotate(${rotate})`
    );
    rect.style.setProperty('--strip-rotate', `${rotate}deg`);
    rect.style.setProperty('--float-from', `${-6 - (i % 5)}px`);
    rect.style.setProperty('--float-to', `${6 + (i % 5)}px`);
    rect.style.animationDuration = `${3.4 + (i % 6) * 0.35}s`;
    rect.style.animationDelay = `${(i % 8) * 0.12}s`;

    svg.appendChild(rect);
  }

  container.appendChild(svg);
};

const ribbonContainer = document.querySelector('[data-ribbon]');
if (ribbonContainer) {
  buildRibbon(ribbonContainer);
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector("button[type='submit']");
  const formData = new FormData(form);

  formStatus.textContent = 'Sending your message...';
  formStatus.classList.remove('is-error');
  submitButton.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    form.reset();
    formStatus.textContent = 'Thanks. Your message has been sent successfully.';
  } catch (error) {
    formStatus.textContent = 'Something went wrong. Please email the address shown on this page directly.';
    formStatus.classList.add('is-error');
  } finally {
    submitButton.disabled = false;
  }
});
