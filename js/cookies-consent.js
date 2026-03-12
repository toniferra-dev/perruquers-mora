/**
 * Sistema de gestión de consentimiento de cookies
 * Cumple con RGPD y LSSI-CE (legislación española)
 * Inspirado en el sistema de Nike.com
 */

class CookieConsent {
  constructor() {
    this.storageKey = 'perruquers-mora-cookie-consent';
    this.consentData = this.loadConsent();
    this.init();
  }

  init() {
    // Crear el HTML del banner y modal
    this.createBannerHTML();
    this.createModalHTML();

    // Agregar event listeners
    this.attachEventListeners();

    // Mostrar banner si no hay consentimiento previo
    if (!this.consentData) {
      this.showBanner();
    } else {
      // Aplicar cookies según consentimiento guardado
      this.applyCookieConsent();
    }

    // Crear botón flotante para reabrir configuración
    this.createSettingsButton();
  }

  createBannerHTML() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <h3>Tu privacidad es importante</h3>
          <p>Perruquers Mora procesa información sobre tu visita utilizando cookies que mejoran el rendimiento del sitio web, facilitan el uso de redes sociales y ofrecen contenido ajustado a tus intereses. Al hacer clic en "Aceptar todas", aceptas el uso de todas las cookies.</p>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-accept-all" class="cookie-btn cookie-btn-primary">Aceptar todas</button>
          <button id="cookie-open-settings" class="cookie-btn cookie-btn-secondary">Configuración de cookies</button>
          <button id="cookie-reject-all" class="cookie-btn cookie-btn-text">Rechazar todas</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
  }

  createModalHTML() {
    const modal = document.createElement('div');
    modal.id = 'cookie-settings-modal';
    modal.className = 'cookie-modal';
    modal.innerHTML = `
      <div class="cookie-modal-overlay"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2>Tu configuración de cookies</h2>
          <button id="cookie-modal-close" class="cookie-modal-close" aria-label="Cerrar">&times;</button>
        </div>
        <div class="cookie-modal-body">
          <p class="cookie-modal-intro">Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Puedes elegir qué tipos de cookies deseas permitir. Las cookies funcionales son necesarias para el funcionamiento básico del sitio y no se pueden desactivar.</p>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookies funcionales</h3>
                <span class="cookie-category-status">Siempre activas</span>
              </div>
            </div>
            <div class="cookie-category-description">
              <p>Estas cookies son necesarias para el funcionamiento básico del sitio web y, por lo tanto, están siempre activas. Incluyen cookies que permiten recordar tu sesión, gestionar el carrito de reservas y garantizar la seguridad del sitio.</p>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookies de rendimiento</h3>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-performance" name="performance">
                  <span class="cookie-toggle-slider"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-description">
              <p>Estas cookies nos permiten mejorar la funcionalidad del sitio web realizando un seguimiento del uso. En algunos casos, estas cookies mejoran la velocidad con la que podemos procesar tu solicitud y recordar tus preferencias del sitio.</p>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookies de personalización</h3>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-personalization" name="personalization">
                  <span class="cookie-toggle-slider"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-description">
              <p>Estas cookies permiten que el sitio recuerde las opciones que has elegido en el pasado, como tu idioma preferido, región o nombre de usuario, para proporcionarte una experiencia más personalizada.</p>
            </div>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <div class="cookie-category-info">
                <h3>Cookies de redes sociales y publicidad</h3>
                <label class="cookie-toggle">
                  <input type="checkbox" id="cookie-advertising" name="advertising">
                  <span class="cookie-toggle-slider"></span>
                </label>
              </div>
            </div>
            <div class="cookie-category-description">
              <p>Estas cookies permiten conectarte a tus redes sociales y compartir contenido de nuestro sitio web a través de las redes sociales. Las cookies de publicidad (de terceros) recopilan información para personalizar los anuncios según tus intereses.</p>
            </div>
          </div>

          <div class="cookie-modal-footer-info">
            <p>Para más información sobre cómo utilizamos las cookies, consulta nuestra <a href="cookies.html">Política de Cookies</a>.</p>
          </div>
        </div>
        <div class="cookie-modal-footer">
          <button id="cookie-save-settings" class="cookie-btn cookie-btn-primary">Guardar configuración</button>
          <button id="cookie-accept-all-modal" class="cookie-btn cookie-btn-secondary">Aceptar todas</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  createSettingsButton() {
    const button = document.createElement('button');
    button.id = 'cookie-settings-trigger';
    button.className = 'cookie-settings-trigger';
    button.innerHTML = '🍪';
    button.title = 'Configuración de cookies';
    button.style.display = this.consentData ? 'flex' : 'none';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      this.openModal();
    });
  }

  attachEventListeners() {
    // Banner buttons
    document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
      this.acceptAll();
    });

    document.getElementById('cookie-open-settings')?.addEventListener('click', () => {
      this.openModal();
    });

    document.getElementById('cookie-reject-all')?.addEventListener('click', () => {
      this.rejectAll();
    });

    // Modal buttons
    document.getElementById('cookie-modal-close')?.addEventListener('click', () => {
      this.closeModal();
    });

    document.getElementById('cookie-save-settings')?.addEventListener('click', () => {
      this.saveSettings();
    });

    document.getElementById('cookie-accept-all-modal')?.addEventListener('click', () => {
      this.acceptAll();
    });

    // Close modal on overlay click
    document.querySelector('.cookie-modal-overlay')?.addEventListener('click', () => {
      this.closeModal();
    });

    // Prevent modal content clicks from closing modal
    document.querySelector('.cookie-modal-content')?.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  showBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      setTimeout(() => {
        banner.classList.add('visible');
      }, 500);
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('visible');
      setTimeout(() => {
        banner.style.display = 'none';
      }, 300);
    }
  }

  openModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      // Cargar preferencias actuales si existen
      if (this.consentData) {
        document.getElementById('cookie-performance').checked = this.consentData.performance;
        document.getElementById('cookie-personalization').checked = this.consentData.personalization;
        document.getElementById('cookie-advertising').checked = this.consentData.advertising;
      }

      modal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }

  acceptAll() {
    const consent = {
      functional: true,
      performance: true,
      personalization: true,
      advertising: true,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyCookieConsent();
    this.showSettingsButton();
  }

  rejectAll() {
    const consent = {
      functional: true, // Las funcionales no se pueden rechazar
      performance: false,
      personalization: false,
      advertising: false,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyCookieConsent();
    this.showSettingsButton();
  }

  saveSettings() {
    const consent = {
      functional: true, // Siempre true
      performance: document.getElementById('cookie-performance').checked,
      personalization: document.getElementById('cookie-personalization').checked,
      advertising: document.getElementById('cookie-advertising').checked,
      timestamp: new Date().toISOString()
    };
    this.saveConsent(consent);
    this.hideBanner();
    this.closeModal();
    this.applyCookieConsent();
    this.showSettingsButton();
  }

  showSettingsButton() {
    const button = document.getElementById('cookie-settings-trigger');
    if (button) {
      button.style.display = 'flex';
    }
  }

  saveConsent(consent) {
    localStorage.setItem(this.storageKey, JSON.stringify(consent));
    this.consentData = consent;
  }

  loadConsent() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  applyCookieConsent() {
    // Aquí se pueden activar/desactivar scripts según el consentimiento

    if (this.consentData.performance) {
      this.enablePerformanceCookies();
    } else {
      this.disablePerformanceCookies();
    }

    if (this.consentData.personalization) {
      this.enablePersonalizationCookies();
    } else {
      this.disablePersonalizationCookies();
    }

    if (this.consentData.advertising) {
      this.enableAdvertisingCookies();
    } else {
      this.disableAdvertisingCookies();
    }
  }

  enablePerformanceCookies() {
    // Ejemplo: Google Analytics, etc.
    console.log('Cookies de rendimiento habilitadas');
    // Aquí se cargarían scripts como Google Analytics
    // Ejemplo:
    // if (typeof gtag !== 'undefined') {
    //   gtag('consent', 'update', {
    //     'analytics_storage': 'granted'
    //   });
    // }
  }

  disablePerformanceCookies() {
    console.log('Cookies de rendimiento deshabilitadas');
    // Aquí se deshabilitarían scripts de análisis
  }

  enablePersonalizationCookies() {
    console.log('Cookies de personalización habilitadas');
    // Aquí se cargarían scripts de personalización
  }

  disablePersonalizationCookies() {
    console.log('Cookies de personalización deshabilitadas');
  }

  enableAdvertisingCookies() {
    console.log('Cookies de publicidad habilitadas');
    // Aquí se cargarían scripts de publicidad y redes sociales
  }

  disableAdvertisingCookies() {
    console.log('Cookies de publicidad deshabilitadas');
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
  });
} else {
  new CookieConsent();
}
