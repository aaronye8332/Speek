const root = document.getElementById('root');

const STORAGE_KEYS = {
  accounts: 'speek-accounts',
  gallery: 'speek-gallery',
};

const state = {
  view: 'landing',
  account: null,
  gallery: loadGallery(),
  tool: 'pencil',
  color: '#111827',
  isDrawing: false,
};

function loadGallery() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.gallery) || '[]');
  } catch {
    return [];
  }
}

function saveGallery() {
  localStorage.setItem(STORAGE_KEYS.gallery, JSON.stringify(state.gallery));
}

function saveAccount(account) {
  const accounts = loadAccounts();
  accounts.push(account);
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts) || '[]');
  } catch {
    return [];
  }
}

function findAccount(username, password) {
  return loadAccounts().find((account) => account.username === username && account.password === password);
}

function render() {
  if (state.view === 'landing') {
    root.innerHTML = `
      <section class="hero-card">
        <h1>Speak</h1>
        <p>Create an account, enter the studio, and bring your characters to life.</p>
        <div class="button-grid">
          <button class="action-btn" data-action="signup">Sign up</button>
          <button class="action-btn" data-action="login">Log in</button>
          <button class="action-btn" data-action="guest">Guest</button>
          <button class="action-btn secondary" data-action="info">More info</button>
        </div>
      </section>
    `;
  } else if (state.view === 'signup') {
    root.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <h2>Create your account</h2>
          <button class="text-btn" data-action="back-home">Back</button>
        </div>
        <form id="signup-form" class="stack-form">
          <label>
            <span>Create username</span>
            <input name="username" required placeholder="Choose a username" />
          </label>
          <label>
            <span>Create password</span>
            <input type="password" name="password" required placeholder="Create a strong password" />
          </label>
          <label class="checkbox-row">
            <input type="checkbox" name="ageCheck" />
            <span>Age Check</span>
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" required placeholder="you@example.com" />
          </label>
          <label>
            <span>Phone number</span>
            <input name="phone" required placeholder="(555) 123-4567" />
          </label>
          <button class="action-btn" type="submit">Check</button>
        </form>
        <p id="signup-message" class="message"></p>
      </section>
    `;
  } else if (state.view === 'login') {
    root.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <h2>Log in</h2>
          <button class="text-btn" data-action="back-home">Back</button>
        </div>
        <form id="login-form" class="stack-form">
          <label>
            <span>Username</span>
            <input name="username" required placeholder="Enter your username" />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" required placeholder="Enter your password" />
          </label>
          <button class="action-btn" type="submit">Continue</button>
        </form>
        <p id="login-message" class="message"></p>
      </section>
    `;
  } else if (state.view === 'info') {
    root.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <h2>More info</h2>
          <button class="text-btn" data-action="back-home">Back</button>
        </div>
        <div class="info-block">
          <p>Speak is a simple prototype for creating a character studio experience in the browser.</p>
          <p>Sign up to save your own sketches, or enter as a guest to try the drawing board.</p>
        </div>
      </section>
    `;
  } else if (state.view === 'project') {
    root.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <h2>${state.account ? `Welcome, ${state.account.username}` : 'Guest Studio'}</h2>
          <button class="text-btn" data-action="logout">Log out</button>
        </div>
        <div class="project-wrap">
          <button class="fab" id="new-character-btn" aria-label="Create new character">+</button>
          <div class="gallery-card">
            <h3>Your gallery</h3>
            ${state.gallery.length ? `
              <div class="gallery-grid">
                ${state.gallery.map((item) => `
                  <div class="gallery-item">
                    <img src="${item.dataUrl}" alt="Saved character" />
                    <span>${item.title}</span>
                  </div>
                `).join('')}
              </div>
            ` : '<p class="empty-state">No characters saved yet. Start drawing to build your gallery.</p>'}
          </div>
        </div>
      </section>
    `;
  } else if (state.view === 'canvas') {
    root.innerHTML = `
      <section class="panel">
        <div class="panel-header">
          <h2>Create a character</h2>
          <button class="text-btn" data-action="back-project">Back</button>
        </div>
        <div class="canvas-toolbar">
          <button class="tool-btn ${state.tool === 'pencil' ? 'active' : ''}" data-tool="pencil">Pencil</button>
          <button class="tool-btn ${state.tool === 'marker' ? 'active' : ''}" data-tool="marker">Marker</button>
          <input type="color" id="color-picker" value="${state.color}" />
          <button class="action-btn" id="save-canvas-btn">Save to gallery</button>
        </div>
        <canvas id="drawing-canvas" width="720" height="420"></canvas>
        <p id="canvas-message" class="message"></p>
      </section>
    `;
    requestAnimationFrame(initCanvas);
  }

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      handleAction(action);
    });
  });

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      const username = String(formData.get('username') || '').trim();
      const password = String(formData.get('password') || '').trim();
      const ageCheck = Boolean(formData.get('ageCheck'));
      const email = String(formData.get('email') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const message = document.getElementById('signup-message');

      if (!username || !password || password.length < 6) {
        message.textContent = 'Please choose a username and a password with at least 6 characters.';
        return;
      }

      if (!ageCheck) {
        message.textContent = 'You need to confirm the age check to continue.';
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        message.textContent = 'Please enter a valid email address.';
        return;
      }

      if (phone.length < 7) {
        message.textContent = 'Please enter a valid phone number.';
        return;
      }

      const existing = loadAccounts().some((account) => account.username === username);
      if (existing) {
        message.textContent = 'That username already exists. Please choose another one.';
        return;
      }

      const account = { username, password, email, phone };
      saveAccount(account);
      state.account = account;
      state.view = 'project';
      message.textContent = 'Account created successfully!';
      render();
    });
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const username = String(formData.get('username') || '').trim();
      const password = String(formData.get('password') || '').trim();
      const message = document.getElementById('login-message');

      const account = findAccount(username, password);
      if (!account) {
        message.textContent = 'No matching account found. Please sign up first.';
        return;
      }

      state.account = account;
      state.view = 'project';
      render();
    });
  }

  const newCharacterButton = document.getElementById('new-character-btn');
  if (newCharacterButton) {
    newCharacterButton.addEventListener('click', () => {
      state.view = 'canvas';
      render();
    });
  }

  const saveCanvasButton = document.getElementById('save-canvas-btn');
  if (saveCanvasButton) {
    saveCanvasButton.addEventListener('click', () => {
      const canvas = document.getElementById('drawing-canvas');
      const message = document.getElementById('canvas-message');
      if (!canvas) {
        return;
      }
      const dataUrl = canvas.toDataURL('image/png');
      state.gallery.unshift({
        id: Date.now(),
        title: `Character ${state.gallery.length + 1}`,
        dataUrl,
      });
      saveGallery();
      state.view = 'project';
      message.textContent = 'Saved to your gallery.';
      render();
    });
  }

  document.querySelectorAll('[data-tool]').forEach((button) => {
    button.addEventListener('click', () => {
      state.tool = button.getAttribute('data-tool');
      render();
    });
  });

  const colorPicker = document.getElementById('color-picker');
  if (colorPicker) {
    colorPicker.addEventListener('input', (event) => {
      state.color = event.target.value;
    });
  }
}

function initCanvas() {
  const canvas = document.getElementById('drawing-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (event) => {
    state.isDrawing = true;
    const point = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!state.isDrawing) {
      return;
    }
    const point = getPoint(event);
    ctx.strokeStyle = state.color;
    ctx.lineWidth = state.tool === 'marker' ? 10 : 3;
    ctx.globalAlpha = state.tool === 'marker' ? 0.45 : 1;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    state.isDrawing = false;
    ctx.beginPath();
  };

  canvas.addEventListener('pointerdown', startDrawing);
  canvas.addEventListener('pointermove', draw);
  canvas.addEventListener('pointerup', stopDrawing);
  canvas.addEventListener('pointerleave', stopDrawing);
}

function handleAction(action) {
  if (action === 'signup') {
    state.view = 'signup';
    render();
  } else if (action === 'login') {
    state.view = 'login';
    render();
  } else if (action === 'guest') {
    state.account = null;
    state.view = 'project';
    render();
  } else if (action === 'info') {
    state.view = 'info';
    render();
  } else if (action === 'back-home') {
    state.view = 'landing';
    render();
  } else if (action === 'back-project') {
    state.view = 'project';
    render();
  } else if (action === 'logout') {
    state.account = null;
    state.view = 'landing';
    render();
  }
}

render();
