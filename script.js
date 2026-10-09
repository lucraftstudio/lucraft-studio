'use strict';

const settings = window.LUCRAFT_SETTINGS;
const projectData = {
  morning: {
    title: 'Morning Club',
    brand: 'morning club.',
    category: 'Food & drink / Café website',
    image: 'assets/morning-club.jpg',
    alt: 'Bright café interior illustrating the Morning Club concept',
    kicker: 'Coffee. Good food. A little everyday joy.',
    headline: ['Your kind of', 'morning.'],
    caption: 'A good day starts here.',
    navLabel: 'A NEIGHBOURHOOD CAFÉ',
    description: 'A welcoming café website concept that gives visitors a feel for the brand and makes the menu, opening hours and contact information easy to find.',
    focus: 'A welcoming brand experience',
    features: ['Responsive layout for desktop and mobile', 'Menu showcase and café information', 'Address and opening hours', 'WhatsApp, email and social contact entry points']
  },
  interior: {
    title: 'Form & Field',
    brand: 'form & field',
    category: 'Interiors / Design studio website',
    image: 'assets/form-and-field.jpg',
    alt: 'Oak and linen living room from the Form & Field concept',
    kicker: 'Spaces made for living',
    headline: ['Considered spaces.', 'Everyday beauty.'],
    caption: 'A calmer kind of home.',
    navLabel: 'INTERIOR DESIGN STUDIO',
    description: 'An editorial interior design website concept with a considered material palette. The project gallery and material explorer give visitors a closer look at the studio’s approach.',
    focus: 'Project discovery & design storytelling',
    features: ['Filterable residential and commercial concept projects', 'Project detail panels with design briefs', 'Interactive material explorer', 'Design process, FAQs and a demo enquiry form']
  },
  fitness: {
    title: 'Move Studio',
    brand: 'MOVE STUDIO',
    category: 'Fitness / Training studio website',
    image: 'assets/move-studio.jpg',
    alt: 'Dumbbell training from the Move Studio concept',
    kicker: 'Strength. Energy. Your kind of progress.',
    headline: ['SHOW UP.', 'KEEP MOVING.'],
    caption: 'Your first rep starts here.',
    navLabel: 'STRENGTH & MOVEMENT',
    description: 'A bold fitness website concept that balances energy with useful information. Visitors can explore programmes, choose a sample session and compare membership options.',
    focus: 'Programme discovery & enquiry flow',
    features: ['Programme detail panels', 'Interactive sample weekly timetable', 'Monthly and three-month price comparison', 'Session and plan selection into a demo trial form']
  }
};

// Use only explicit secure web links for external destinations.
function safeWebUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

document.querySelectorAll('[data-demo]').forEach(link => {
  const url = safeWebUrl(settings.projects[link.dataset.demo]);
  if (url) link.href = url;
});

document.querySelectorAll('[data-email-link]').forEach(link => {
  link.textContent = settings.email;
  link.href = `mailto:${encodeURIComponent(settings.email)}`;
});
document.querySelector('#copyright-year').textContent = new Date().getFullYear();

const whatsappLink = document.querySelector('#whatsapp-link');
if (/^[1-9]\d{7,14}$/.test(settings.whatsappNumber)) {
  const message = 'Hi Lucraft Studio, I would like to discuss a website project.';
  whatsappLink.href = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
  whatsappLink.hidden = false;
}

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
matchMedia('(min-width: 861px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-preview]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.preview;
    const project = projectData[key];
    document.querySelectorAll('[data-preview]').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    document.querySelector('#preview-content').className = `preview-content preview-${key}`;
    document.querySelector('#preview-domain').textContent = `${project.title.toUpperCase()} / WEBSITE CONCEPT`;
    document.querySelector('#preview-brand').textContent = project.brand;
    document.querySelector('#preview-nav-label').textContent = project.navLabel;
    document.querySelector('#preview-kicker').textContent = project.kicker;
    const title = document.querySelector('#preview-title');
    title.replaceChildren(document.createTextNode(project.headline[0]), document.createElement('br'), document.createTextNode(project.headline[1]));
    const image = document.querySelector('#preview-image');
    image.src = project.image;
    image.alt = project.alt;
    document.querySelector('#preview-caption').textContent = project.caption;
  });
});

const projectDialog = document.querySelector('#project-dialog');
document.querySelectorAll('[data-detail]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.detail;
    const project = projectData[key];
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-category').textContent = project.category;
    document.querySelector('#dialog-description').textContent = project.description;
    document.querySelector('#dialog-focus').textContent = project.focus;
    const image = document.querySelector('#dialog-image');
    image.src = project.image;
    image.alt = project.alt;
    document.querySelector('#dialog-features').replaceChildren(...project.features.map(feature => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));
    document.querySelector('#dialog-demo').href = safeWebUrl(settings.projects[key]) || document.querySelector(`[data-demo="${key}"]`).href;
    projectDialog.showModal();
  });
});
projectDialog.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => {
  if (event.target !== projectDialog) return;
  const bounds = projectDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) projectDialog.close();
});

document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(settings.email);
    status.textContent = 'Email address copied.';
  } catch {
    status.textContent = `Please select and copy the address: ${settings.email}`;
  }
});

document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.querySelector('#enquiry-name').value.trim();
  const service = document.querySelector('#enquiry-service').value;
  const message = document.querySelector('#enquiry-message').value.trim();
  if (!name || !message) return;
  const subject = `Website enquiry — ${service}`;
  const body = `Hi Lucas,\n\nMy name is ${name}.\nI'm interested in: ${service}.\n\n${message}\n\nThanks,\n${name}`;
  document.querySelector('#draft-link').href = `mailto:${encodeURIComponent(settings.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.querySelector('#draft-status').hidden = false;
});
document.querySelectorAll('#enquiry-form input, #enquiry-form select, #enquiry-form textarea').forEach(field => {
  field.addEventListener('input', () => {
    document.querySelector('#draft-status').hidden = true;
  });
});
