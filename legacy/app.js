/**
 * Responsive Preview Tool
 * Displays website previews across multiple device viewports
 */

// Device configurations
// Device configurations
const DEVICES = [
    {
        id: 'iphone-se',
        name: 'iPhone SE',
        width: 375,
        height: 667,
        category: 'mobile',
        icon: 'phone'
    },
    {
        id: 'iphone-14-pro-max',
        name: 'iPhone 14 Pro Max',
        width: 430,
        height: 932,
        category: 'mobile',
        icon: 'phone'
    },
    {
        id: 'pixel-7',
        name: 'Pixel 7',
        width: 412,
        height: 915,
        category: 'mobile',
        icon: 'phone'
    },
    {
        id: 'samsung-s23-ultra',
        name: 'Samsung S23 Ultra',
        width: 412,
        height: 919,
        category: 'mobile',
        icon: 'phone'
    },
    {
        id: 'ipad-mini',
        name: 'iPad Mini',
        width: 768,
        height: 1024,
        category: 'tablet',
        icon: 'tablet'
    },
    {
        id: 'ipad-air',
        name: 'iPad Air',
        width: 820,
        height: 1180,
        category: 'tablet',
        icon: 'tablet'
    },
    {
        id: 'ipad-pro',
        name: 'iPad Pro 12.9"',
        width: 1024,
        height: 1366,
        category: 'tablet',
        icon: 'tablet'
    },
    {
        id: 'macbook-air',
        name: 'MacBook Air',
        width: 1280,
        height: 832,
        category: 'laptop',
        icon: 'laptop'
    },
    {
        id: 'desktop',
        name: 'Desktop HD',
        width: 1920,
        height: 1080,
        category: 'desktop',
        icon: 'desktop'
    }
];

// State
let activeDevices = new Set(DEVICES.map(d => d.id));
let currentUrl = '';
let currentZoomMode = 'auto';

// Icons SVG templates
const ICONS = {
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="2" width="14" height="20" rx="2"/>
        <circle cx="12" cy="18" r="1"/>
    </svg>`,
    tablet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <circle cx="12" cy="18" r="1"/>
    </svg>`,
    laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M2 17h20"/>
    </svg>`,
    desktop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
    </svg>`,
    error: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4M12 16h.01"/>
    </svg>`
};

// DOM Elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const previewGrid = document.getElementById('previewGrid');
const deviceToggles = document.getElementById('deviceToggles');
const zoomControls = document.querySelector('.zoom-buttons');
const errorMessage = document.getElementById('errorMessage');

/**
 * Initialize the application
 */
function init() {
    renderDeviceToggles();
    setupEventListeners();
    setupResizeListener();
}

/**
 * Render device toggle buttons
 */
function renderDeviceToggles() {
    deviceToggles.innerHTML = DEVICES.map(device => `
        <button 
            type="button" 
            class="device-toggle active" 
            data-device-id="${device.id}"
            title="${device.name} (${device.width}×${device.height})"
        >
            <span class="device-icon">${ICONS[device.icon]}</span>
            <span>${device.name}</span>
        </button>
    `).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Form submission
    urlForm.addEventListener('submit', handleFormSubmit);
    
    // Device toggle clicks
    deviceToggles.addEventListener('click', handleDeviceToggle);
    
    // Zoom control clicks
    if (zoomControls) {
        zoomControls.addEventListener('click', handleZoomChange);
    }
    
    // Input change - clear error
    urlInput.addEventListener('input', () => {
        errorMessage.textContent = '';
    });
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const url = urlInput.value.trim();
    
    if (!url) {
        showError('Please enter a URL');
        return;
    }
    
    const validatedUrl = validateAndNormalizeUrl(url);
    
    if (!validatedUrl) {
        showError('Please enter a valid URL');
        return;
    }
    
    currentUrl = validatedUrl;
    renderPreviews();
}

/**
 * Validate and normalize URL
 */
function validateAndNormalizeUrl(url) {
    let normalizedUrl = url;
    
    // Add protocol if missing
    if (!url.match(/^https?:\/\//i)) {
        normalizedUrl = 'https://' + url;
    }
    
    try {
        const urlObj = new URL(normalizedUrl);
        return urlObj.href;
    } catch (e) {
        return null;
    }
}

/**
 * Show error message
 */
function showError(message) {
    errorMessage.textContent = message;
}

/**
 * Handle device toggle
 */
function handleDeviceToggle(e) {
    const button = e.target.closest('.device-toggle');
    if (!button) return;
    
    const deviceId = button.dataset.deviceId;
    
    if (activeDevices.has(deviceId)) {
        // Don't allow deselecting all devices
        if (activeDevices.size === 1) return;
        activeDevices.delete(deviceId);
        button.classList.remove('active');
    } else {
        activeDevices.add(deviceId);
        button.classList.add('active');
    }
    
    // Re-render if we have a URL
    if (currentUrl) {
        renderPreviews();
    }
}

/**
 * Handle zoom level change
 */
function handleZoomChange(e) {
    const button = e.target.closest('.zoom-btn');
    if (!button) return;
    
    // Update active state
    document.querySelectorAll('.zoom-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    currentZoomMode = button.dataset.zoom;
    
    // Re-render if we have a URL
    if (currentUrl) {
        renderPreviews();
    }
}

/**
 * Render preview frames for all active devices
 */
function renderPreviews() {
    const activeDeviceList = DEVICES.filter(d => activeDevices.has(d.id));
    
    if (activeDeviceList.length === 0) {
        previewGrid.innerHTML = '<div class="empty-state"><p>Select at least one device</p></div>';
        previewGrid.classList.remove('has-content');
        return;
    }
    
    previewGrid.innerHTML = activeDeviceList.map((device, index) => 
        createDeviceFrame(device, index)
    ).join('');
    
    previewGrid.classList.add('has-content');
    
    // Load iframes after rendering
    activeDeviceList.forEach((device, index) => {
        setTimeout(() => {
            loadIframe(device);
        }, index * 100); // Stagger loading
    });
}

/**
 * Create device frame HTML
 */
function createDeviceFrame(device, index) {
    const scale = calculateScale(device);
    // Use Math.floor to strictly clip the container to prevent any scrollbar leakage
    const containerWidth = Math.floor(device.width * scale);
    const containerHeight = Math.floor(device.height * scale);
    
    // Add specific class for larger devices to allow grid spanning if needed
    const extraClass = (device.category === 'desktop' || device.category === 'laptop') ? 'device-large' : '';
    
    return `
        <div class="device-frame ${extraClass}" data-device-id="${device.id}" style="animation-delay: ${index * 0.1}s">
            <div class="device-header">
                <div class="device-info">
                    <span class="device-icon">${ICONS[device.icon]}</span>
                    <span class="device-name">${device.name}</span>
                </div>
                <span class="device-dimensions">${device.width} × ${device.height}</span>
            </div>
            <div class="device-viewport">
                <div class="iframe-container" style="width: ${containerWidth}px; height: ${containerHeight}px;">
                    <div class="iframe-loading" id="loading-${device.id}">
                        <div class="spinner"></div>
                        <span>Loading preview...</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Calculate scale factor for iframe to fit in viewport
 */
function calculateScale(device) {
    // If manual zoom is selected, use that
    if (currentZoomMode !== 'auto') {
        return parseFloat(currentZoomMode);
    }

    // Get available width from container
    // Subtract padding of the preview section
    const availableWidth = previewGrid.clientWidth - 32; 
    
    // Calculate scale to fit width
    let scale = availableWidth / device.width;
    
    // Cap at 1.0 to ensure 1:1 representation when space allows
    return Math.min(scale, 1.0);
}

/**
 * Load iframe for a device
 */
function loadIframe(device) {
    const container = document.querySelector(`[data-device-id="${device.id}"] .iframe-container`);
    if (!container) return;
    
    const loading = container.querySelector('.iframe-loading');
    const scale = calculateScale(device);
    
    const iframe = document.createElement('iframe');
    iframe.src = currentUrl;
    
    const finalWidth = device.width;
    
    // Set both attribute and style to be absolutely sure
    iframe.width = finalWidth;
    iframe.style.width = `${finalWidth}px`;
    
    iframe.height = device.height;
    iframe.style.height = `${device.height}px`;
    
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = 'top left';
    iframe.style.border = 'none'; // Ensure no border adds width
    
    iframe.sandbox = 'allow-scripts allow-same-origin allow-forms';
    iframe.loading = 'lazy';
    
    // Handle load
    iframe.addEventListener('load', () => {
        if (loading) {
            loading.style.display = 'none';
        }
    });
    
    // Handle error
    iframe.addEventListener('error', () => {
        showIframeError(container, device.id);
    });
    
    // Timeout for sites that block iframes
    const timeout = setTimeout(() => {
        // Check if iframe loaded successfully
        try {
            // This will throw if blocked by CORS
            const doc = iframe.contentDocument;
            if (!doc || !doc.body || doc.body.innerHTML === '') {
                showIframeError(container, device.id);
            }
        } catch (e) {
            // CORS blocked - iframe probably loaded fine
            if (loading) {
                loading.style.display = 'none';
            }
        }
    }, 5000);
    
    iframe.addEventListener('load', () => clearTimeout(timeout));
    
    container.appendChild(iframe);
}

/**
 * Show iframe error state
 */
function showIframeError(container, deviceId) {
    const loading = container.querySelector('.iframe-loading');
    if (loading) {
        loading.innerHTML = `
            <div class="iframe-error">
                ${ICONS.error}
                <p>This website blocked the preview</p>
            </div>
        `;
    }
}

/**
 * Calculate the width of the system scrollbar
 */
function getScrollbarWidth() {
    // Creating invisible container
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll'; // forcing scrollbar to appear
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
    outer.style.width = '100px';
    outer.style.height = '100px';
    document.body.appendChild(outer);

    // Creating inner element and placing it in the container
    const inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '100%';
    outer.appendChild(inner);

    // Calculating difference between container's full width and the child width
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

    // Removing temporary elements from the DOM
    outer.parentNode.removeChild(outer);

    // Fallback for Windows if calculation fails (returns 0) but we expect a scrollbar.
    // Windows scrollbars are typically 17px, but can be up to 24px with certain settings/zoom.
    // We use a safer buffer of 20px to ensure we hide it. 20px is a good balance between hiding the bar and not cutting too much content.
    const isWindows = navigator.platform.indexOf('Win') > -1 || navigator.userAgent.indexOf('Windows') > -1;
    
    if (scrollbarWidth === 0 && isWindows) {
        return 20; 
    }

    return scrollbarWidth;
}

/**
 * Setup resize listener to update previews dynamically
 */
function setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (currentUrl) {
                renderPreviews();
            }
        }, 200); // Debounce by 200ms
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
