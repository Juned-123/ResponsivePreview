export const DEVICES = [
    {
        id: 'all',
        name: 'All Devices',
        icon: 'devices',
        category: 'special'
    },
    {
        id: 'responsive',
        name: 'Responsive',
        width: 1200,
        height: 800,
        category: 'special',
        icon: 'responsive'
    },
    // Mobile
    { id: 'galaxy-fold', name: 'Galaxy Fold', width: 280, height: 653, category: 'mobile', icon: 'phone', showInAll: true },
    { id: 'galaxy-s8', name: 'Galaxy S8+', width: 360, height: 740, category: 'mobile', icon: 'phone' },
    { id: 'iphone-13-mini', name: 'iPhone 13 Mini', width: 360, height: 780, category: 'mobile', icon: 'phone' },
    { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667, category: 'mobile', icon: 'phone', showInAll: true },
    { id: 'iphone-14', name: 'iPhone 14', width: 393, height: 852, category: 'mobile', icon: 'phone' },
    { id: 'pixel-7', name: 'Pixel 7', width: 412, height: 915, category: 'mobile', icon: 'phone' },
    { id: 'samsung-s23-ultra', name: 'Samsung S23 Ultra', width: 412, height: 919, category: 'mobile', icon: 'phone' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'mobile', icon: 'phone', showInAll: true },
    { id: 'galaxy-z-fold', name: 'Galaxy Z Fold', width: 373, height: 904, category: 'mobile', icon: 'phone' },
    // Tablets
    { id: 'ipad-mini', name: 'iPad Mini', width: 768, height: 1024, category: 'tablet', icon: 'tablet', showInAll: true },
    { id: 'ipad-air', name: 'iPad Air', width: 820, height: 1180, category: 'tablet', icon: 'tablet' },
    { id: 'ipad-10th', name: 'iPad 10th Gen', width: 810, height: 1080, category: 'tablet', icon: 'tablet' },
    { id: 'ipad-pro-11', name: 'iPad Pro 11"', width: 834, height: 1194, category: 'tablet', icon: 'tablet' },
    { id: 'galaxy-tab-s9', name: 'Galaxy Tab S9', width: 800, height: 1280, category: 'tablet', icon: 'tablet' },
    { id: 'ipad-pro-12', name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet', icon: 'tablet', showInAll: true },
    { id: 'surface-pro-9', name: 'Surface Pro 9', width: 1440, height: 960, category: 'tablet', icon: 'tablet' },
    // Laptops
    { id: 'netbook', name: 'Netbook', width: 1024, height: 600, category: 'laptop', icon: 'laptop' },
    { id: 'macbook-air-13', name: 'MacBook Air 13"', width: 1280, height: 832, category: 'laptop', icon: 'laptop', showInAll: true },
    { id: 'chromebook', name: 'Chromebook', width: 1366, height: 768, category: 'laptop', icon: 'laptop' },
    { id: 'macbook-pro-14', name: 'MacBook Pro 14"', width: 1512, height: 982, category: 'laptop', icon: 'laptop' },
    { id: 'macbook-pro-16', name: 'MacBook Pro 16"', width: 1728, height: 1117, category: 'laptop', icon: 'laptop' },
    // Desktops
    { id: 'desktop-hd', name: 'Desktop HD', width: 1920, height: 1080, category: 'desktop', icon: 'desktop', showInAll: true },
    { id: 'monitor-qhd', name: 'QHD Monitor', width: 2560, height: 1440, category: 'desktop', icon: 'desktop' },
    { id: 'monitor-ultrawide', name: 'UltraWide Monitor', width: 3440, height: 1440, category: 'desktop', icon: 'desktop' },
    { id: 'monitor-4k', name: '4K Pro Display', width: 3840, height: 2160, category: 'desktop', icon: 'desktop' }
];

export const ICONS = {
    phone: `M12 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h0a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3Z M12 18h.01`,
    tablet: `M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z M12 18h.01`,
    laptop: `M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z M2 17h20`,
    desktop: `M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5Z M8 21h8 M12 17v4`,
    responsive: `M4 4h16v16H4z M9 4v16 M15 4v16 M4 9h16 M4 15h16`,
    devices: `M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z M2 7h20 M2 17h20`,
    error: `M12 8v4 M12 16h.01 M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z`
};
