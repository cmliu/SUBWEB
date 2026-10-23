import './assets/css/main.css';
import { backendConfig, externalConfig, targetConfig } from './config.js';
import { buildSubUrl, parseBackendVersion, supportsUaPrefix, usesUaPrefix, validateUa } from './suburl.js';

let subUrl = '';
// backend url -> { extended, version } from /version
const backendInfo = new Map();

// Theme management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'system';
        this.init();
    }

    init() {
        this.updateTheme();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        const themeDropdown = document.getElementById('themeDropdown');
        const themeButtons = document.querySelectorAll('[data-theme]');

        if (themeToggle && themeDropdown) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                themeDropdown.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!themeDropdown.contains(e.target) && !themeToggle.contains(e.target)) {
                    themeDropdown.classList.add('hidden');
                }
            });
        }

        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                this.setTheme(theme);
                if (themeDropdown) {
                    themeDropdown.classList.add('hidden');
                }
            });
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.updateTheme();
            }
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.updateTheme();
    }

    updateTheme() {
        const html = document.documentElement;
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');

        let isDark = false;
        
        if (this.currentTheme === 'dark') {
            isDark = true;
        } else if (this.currentTheme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        if (isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Update button appearance
        if (themeIcon && themeText) {
            switch (this.currentTheme) {
                case 'light':
                    themeIcon.className = 'fas fa-sun mr-2 text-sm';
                    themeText.textContent = '浅色';
                    break;
                case 'dark':
                    themeIcon.className = 'fas fa-moon mr-2 text-sm';
                    themeText.textContent = '深色';
                    break;
                case 'system':
                    themeIcon.className = 'fas fa-desktop mr-2 text-sm';
                    themeText.textContent = '系统';
                    break;
            }
        }
    }
}

// Mobile Advanced Options Modal Management
let mobileAdvancedOptions = {
    emoji: true,
    append_type: true,
    append_info: true,
    scv: false,
    udp: false,
    list: false,
    sort: false,
    fdn: false,
    insert: false
};

function updateMobileAdvancedButton() {
    const selectedCount = Object.values(mobileAdvancedOptions).filter(val => val).length;
    const toggleText = document.getElementById('advancedToggleText');
    if (toggleText) {
        toggleText.textContent = selectedCount > 0 ? `高级选项 (${selectedCount})` : '高级选项';
    }
}

function syncMobileAdvancedOptions() {
    // Sync from desktop checkboxes to mobile modal
    const desktopOptions = ['emoji', 'append_type', 'append_info', 'scv', 'udp', 'list', 'sort', 'fdn', 'insert'];
    desktopOptions.forEach(option => {
        const desktopCheckbox = document.getElementById(option);
        if (desktopCheckbox) {
            mobileAdvancedOptions[option] = desktopCheckbox.checked;
        }
    });
    updateMobileAdvancedModal();
    updateMobileAdvancedButton();
}

function updateMobileAdvancedModal() {
    // Update mobile modal UI based on current options
    Object.keys(mobileAdvancedOptions).forEach(option => {
        const card = document.querySelector(`[data-option="${option}"]`);
        if (card) {
            if (mobileAdvancedOptions[option]) {
                card.classList.add('mobile-option-checked');
            } else {
                card.classList.remove('mobile-option-checked');
            }
        }
    });
}

function applyMobileAdvancedOptions() {
    // Apply mobile options to desktop checkboxes
    Object.keys(mobileAdvancedOptions).forEach(option => {
        const desktopCheckbox = document.getElementById(option);
        if (desktopCheckbox) {
            desktopCheckbox.checked = mobileAdvancedOptions[option];
        }
    });
}

function handleMobileAdvancedToggle(optionName) {
    console.log('Toggling option:', optionName, 'from', mobileAdvancedOptions[optionName], 'to', !mobileAdvancedOptions[optionName]);
    mobileAdvancedOptions[optionName] = !mobileAdvancedOptions[optionName];
    updateMobileAdvancedModal();
    updateMobileAdvancedButton();
    
    // 立即应用到桌面端checkbox
    const desktopCheckbox = document.getElementById(optionName);
    if (desktopCheckbox) {
        desktopCheckbox.checked = mobileAdvancedOptions[optionName];
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Optimize DOM queries with caching
const domCache = new Map();

function getCachedElement(id) {
    if (!domCache.has(id)) {
        const element = document.getElementById(id);
        if (element) {
            domCache.set(id, element);
        }
        return element;
    }
    return domCache.get(id);
}

// Clear cache when needed
function clearDOMCache() {
    domCache.clear();
}

const TOAST_VISIBLE_DURATION = 3500;
const TOAST_ANIMATION_DURATION = 300;
const MAX_VISIBLE_TOASTS = 5;

function isMobileViewport() {
    return window.innerWidth < 640;
}

function getToastContainer() {
    return getCachedElement('toastContainer');
}

function clearToastTimers(toast) {
    if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
        toast.hideTimeout = null;
    }
    if (toast.cleanupTimeout) {
        clearTimeout(toast.cleanupTimeout);
        toast.cleanupTimeout = null;
    }
}

function animateToastOut(toast) {
    if (!toast || toast.dataset.closing === '1') return;

    toast.dataset.closing = '1';
    clearToastTimers(toast);

    const currentIsMobile = isMobileViewport();
    toast.style.transition = `transform ${TOAST_ANIMATION_DURATION}ms ease, opacity ${TOAST_ANIMATION_DURATION}ms ease`;
    toast.style.transform = currentIsMobile ? 'translateY(-16px)' : 'translateX(calc(100% + 12px))';
    toast.style.opacity = '0';

    toast.cleanupTimeout = setTimeout(() => {
        clearToastTimers(toast);
        toast.remove();
    }, TOAST_ANIMATION_DURATION);
}

function createToastElement(message, type) {
    const icons = {
        success: '<i class="fas fa-check-circle text-green-500 text-xl"></i>',
        error: '<i class="fas fa-exclamation-circle text-red-500 text-xl"></i>',
        info: '<i class="fas fa-info-circle text-blue-500 text-xl"></i>',
        warning: '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>'
    };

    const borderClass =
        type === 'success' ? 'border-green-200/50 dark:border-green-700/50' :
        type === 'error' ? 'border-red-200/50 dark:border-red-700/50' :
        type === 'warning' ? 'border-yellow-200/50 dark:border-yellow-700/50' :
        'border-blue-200/50 dark:border-blue-700/50';

    const toast = document.createElement('div');
    toast.dataset.toastItem = '1';
    toast.className = 'pointer-events-auto w-full sm:w-auto sm:max-w-md';
    toast.innerHTML = `
        <div class="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 border border-gray-200/50 dark:border-gray-600/50 ${borderClass}">
            <div class="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center" data-toast-icon></div>
            <div class="flex-grow min-w-0">
                <p class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 break-all" data-toast-message></p>
            </div>
            <button type="button" class="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-sm sm:text-base" aria-label="关闭提示">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    const messageElement = toast.querySelector('[data-toast-message]');
    if (messageElement) {
        messageElement.textContent = message;
    }

    const iconElement = toast.querySelector('[data-toast-icon]');
    if (iconElement) {
        iconElement.innerHTML = icons[type] || icons.info;
    }

    const closeBtn = toast.querySelector('button');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideToast(toast);
        });
    }

    return toast;
}

// Toast notification function with optimized DOM operations
function showToast(message, type = 'info') {
    const container = getToastContainer();
    if (!container) return;

    const toast = createToastElement(message, type);
    container.appendChild(toast);

    const oldestToasts = container.querySelectorAll('[data-toast-item="1"]');
    if (oldestToasts.length > MAX_VISIBLE_TOASTS) {
        animateToastOut(oldestToasts[0]);
    }

    // Enter animation
    const mobile = isMobileViewport();
    toast.style.transition = `transform ${TOAST_ANIMATION_DURATION}ms ease, opacity ${TOAST_ANIMATION_DURATION}ms ease`;
    toast.style.transform = mobile ? 'translateY(-16px)' : 'translateX(calc(100% + 12px))';
    toast.style.opacity = '0';

    // Force reflow to ensure start state is committed before animating in
    void toast.offsetHeight;

    requestAnimationFrame(() => {
        if (toast.dataset.closing === '1') return;
        toast.style.transform = mobile ? 'translateY(0)' : 'translateX(0)';
        toast.style.opacity = '1';
    });

    // Hide toast after visible duration
    toast.hideTimeout = setTimeout(() => {
        animateToastOut(toast);
    }, TOAST_VISIBLE_DURATION);
}

// Hide toast function for close button with cached DOM
function hideToast(toast = null) {
    if (toast && toast.dataset.toastItem === '1') {
        animateToastOut(toast);
        return;
    }

    const container = getToastContainer();
    if (!container) return;

    const activeToasts = container.querySelectorAll('[data-toast-item="1"]');
    const latestToast = activeToasts[activeToasts.length - 1];
    if (latestToast) {
        animateToastOut(latestToast);
    }
}

// Make hideToast globally available for HTML onclick
window.hideToast = hideToast;

function copyText(copyStr) {
    navigator.clipboard.writeText(copyStr).then(() => {
        showToast('复制成功~', 'success');
    }, () => {
        showToast('复制失败, 请手动选择复制', 'error');
    });
}

function backendLabel(backend) {
    const info = backend.version;
    if (info && info.extended) return `${backend.label} [Extended ${info.version}]`;
    return backend.label;
}

function isValidConfigRef(config) {
    try {
        new URL(config);
        return true;
    } catch (e) {
        return /^[\w.\-\/]+\.(ini|toml|ya?ml|conf)$/i.test(config);
    }
}

// The ua: source prefix only works on SubConverter-Extended >= v1.10.4 with Clash output.
async function ensureUaSupported(data) {
    if (!usesUaPrefix(data)) return true;
    const err = validateUa(data.ua);
    if (err) {
        showToast(err, 'error');
        return false;
    }
    if ((data.target || '').split('&')[0] !== 'clash') {
        showToast('订阅 UA 仅适用于 Clash 输出', 'error');
        return false;
    }
    let info = backendInfo.get(data.backend);
    if (!info) info = await checkBackendVersion(data.backend);
    if (!supportsUaPrefix(info)) {
        showToast('订阅 UA 需要 SubConverter-Extended v1.10.4 及以上的后端', 'error');
        return false;
    }
    return true;
}

function generateSubUrl(data) {
    const newSubUrl = buildSubUrl(data);
    subUrl = newSubUrl;
    $('#result').val(subUrl);
    
    // Show result section with animation
    const resultSection = document.getElementById('resultSection');
    if (resultSection) {
        resultSection.style.display = 'block';
        setTimeout(() => {
            resultSection.classList.remove('opacity-0', 'translate-y-4');
            resultSection.classList.add('opacity-100', 'translate-y-0');
        }, 100);
    }
    
    // Show copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.style.display = 'inline-flex';
    }
    
    copyText(subUrl);
}

// Initialize form elements with cached DOM access
function initializeForm() {
    // Populate target select
    const targetSelect = getCachedElement('target');
    if (targetSelect && targetSelect.options.length === 0) { // Only populate if empty
        targetConfig.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.label;
            targetSelect.appendChild(opt);
        });
    }

    // Populate config select
    const configSelect = getCachedElement('config');
    if (configSelect && configSelect.options.length === 0) { // Only populate if empty
        externalConfig.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.label;
            
            group.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                
                // Set default selection for "默认版-功能齐全"
                if (option.label === '默认版-功能齐全') {
                    opt.selected = true;
                }
                
                optgroup.appendChild(opt);
            });
            
            configSelect.appendChild(optgroup);
        });
    }

    // Backend select is now handled by initializeBackends function
    
    // Add backend change listener for header selector
    const backendHeaderSelect = document.getElementById('backendHeader');
    if (backendHeaderSelect) {
        backendHeaderSelect.addEventListener('change', handleBackendChange);
    }
}

// Handle backend selection change
function handleBackendChange() {
    // Only handle header backend selector now
    const backendSelect = document.getElementById('backendHeader');
    const customBackendContainer = document.getElementById('customBackendContainerHeader');
    const customBackendInput = document.getElementById('customBackendHeader');
    
    if (!backendSelect) return;
    
    if (backendSelect.value === 'custom') {
        // Show with animation
        if (customBackendContainer) {
            customBackendContainer.style.display = 'block';
            customBackendContainer.classList.remove('hidden');
            // Focus on input after a short delay
            setTimeout(() => {
                if (customBackendInput) customBackendInput.focus();
            }, 300);
        }
        if (customBackendInput) customBackendInput.required = true;
    } else {
        // Hide with animation
        if (customBackendContainer) {
            customBackendContainer.classList.add('hidden');
            setTimeout(() => {
                customBackendContainer.style.display = 'none';
            }, 300);
        }
        if (customBackendInput) {
            customBackendInput.required = false;
            customBackendInput.value = '';
        }
    }
    
    // Update header button text
    updateBackendButtonLabel();
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    
    // Get backend from header selector instead of form
    const backendHeaderSelect = document.getElementById('backendHeader');
    let backend = backendHeaderSelect ? backendHeaderSelect.value : '';
    
    // If custom backend is selected, use the custom input value
    if (backend === 'custom') {
        const customBackendHeader = document.getElementById('customBackendHeader');
        backend = customBackendHeader ? customBackendHeader.value.trim() : '';
        // Validate custom backend URL
        if (!backend) {
            showToast('请输入自定义后端地址', 'error');
            return;
        }
        // Smart auto-completion for backend URL
        backend = autoCompleteBackendUrl(backend);
    }
    
    if (!backend) {
        showToast('请选择后端服务', 'error');
        return;
    }
    
    // Get config value - either from select or custom input
    let config = '';
    const customConfigToggle = document.getElementById('customConfigToggle');
    if (customConfigToggle && customConfigToggle.checked) {
        // Use custom config
        const customConfigInput = document.getElementById('customConfig');
        config = customConfigInput ? customConfigInput.value.trim() : '';
        if (!config) {
            showToast('请输入自定义配置链接', 'error');
            return;
        }
        // Validate URL format
        if (!isValidConfigRef(config)) {
            showToast('自定义配置格式不正确，请输入有效的URL或后端本地路径（如 config/xxx.ini）', 'error');
            return;
        }
    } else {
        // Use regular config select
        config = formData.get('config');
    }
    
    const data = {
        url: formData.get('url'),
        target: formData.get('target'),
        backend: backend,
        config: config,
        include: formData.get('include'),
        exclude: formData.get('exclude'),
        name: formData.get('name'),
        emoji: formData.get('emoji') === 'on' ? 'true' : 'false',
        append_type: formData.get('append_type') === 'on' ? 'true' : 'false',
        append_info: formData.get('append_info') === 'on' ? 'true' : 'false',
        scv: formData.get('scv') === 'on' ? 'true' : 'false',
        udp: formData.get('udp') === 'on' ? 'true' : 'false',
        list: formData.get('list') === 'on' ? 'true' : 'false',
        sort: formData.get('sort') === 'on' ? 'true' : 'false',
        fdn: formData.get('fdn') === 'on' ? 'true' : 'false',
        insert: formData.get('insert') === 'on' ? 'true' : 'false',
        ua: (formData.get('ua') || '').trim()
    };
    
    if (!(await ensureUaSupported(data))) return;
    generateSubUrl(data);
}

// Import to Clash handler
function handleImportToClash() {
    if (!subUrl) {
        showToast('未生成新的订阅链接', 'error');
        return;
    }
    
    const url = `clash://install-config?url=${encodeURIComponent(subUrl)}`;
    window.open(url);
}

// Copy button handler
function handleCopy() {
    const result = document.getElementById('result');
    if (result && result.value) {
        copyText(result.value);
    }
}

// QR Code button handler
function handleQrCode() {
    const result = document.getElementById('result');
    if (!result || !result.value) {
        showToast('未生成订阅链接', 'error');
        return;
    }
    
    const modal = document.getElementById('qrModal');
    const canvas = document.getElementById('qrCodeCanvas');
    
    if (!modal || !canvas) return;
    
    // Check if QRCode is available
    if (typeof QRCode === 'undefined') {
        showToast('二维码库加载失败，请刷新页面重试', 'error');
        return;
    }
    
    try {
        // Clear previous QR code
        canvas.innerHTML = '';
        
        // Determine colors based on theme
        const isDarkMode = document.documentElement.classList.contains('dark');
        const colorDark = isDarkMode ? '#FFFFFF' : '#1F2937';
        const colorLight = isDarkMode ? '#1F2937' : '#FFFFFF';
        
        // Create QR code using qrcodejs library
        new QRCode(canvas, {
            text: result.value,
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Show modal
        modal.classList.remove('hidden');
        showToast('二维码生成成功', 'success');
    } catch (error) {
        showToast('二维码生成失败', 'error');
    }
}

// Clash QR Code button handler
async function handleClashQrCode() {
    // Get form data first
    const form = document.getElementById('optionsForm');
    if (!form) {
        showToast('表单未找到', 'error');
        return;
    }
    
    const formData = new FormData(form);
    
    // Get backend from header selector
    const backendHeaderSelect = document.getElementById('backendHeader');
    let backend = backendHeaderSelect ? backendHeaderSelect.value : '';
    
    // If custom backend is selected, use the custom input value
    if (backend === 'custom') {
        const customBackendHeader = document.getElementById('customBackendHeader');
        backend = customBackendHeader ? customBackendHeader.value.trim() : '';
        // Validate custom backend URL
        if (!backend) {
            showToast('请输入自定义后端地址', 'error');
            return;
        }
        // Smart auto-completion for backend URL
        backend = autoCompleteBackendUrl(backend);
    }
    
    if (!backend) {
        showToast('请选择后端服务', 'error');
        return;
    }
    
    const url = formData.get('url');
    const target = formData.get('target');
    
    if (!url || !target) {
        showToast('请填写订阅链接和选择客户端类型', 'error');
        return;
    }
    
    // Get config value - either from select or custom input
    let config = '';
    const customConfigToggle = document.getElementById('customConfigToggle');
    if (customConfigToggle && customConfigToggle.checked) {
        // Use custom config
        const customConfigInput = document.getElementById('customConfig');
        config = customConfigInput ? customConfigInput.value.trim() : '';
        if (!config) {
            showToast('请输入自定义配置链接', 'error');
            return;
        }
        // Validate URL format
        if (!isValidConfigRef(config)) {
            showToast('自定义配置格式不正确，请输入有效的URL或后端本地路径（如 config/xxx.ini）', 'error');
            return;
        }
    } else {
        // Use regular config select
        config = formData.get('config');
    }
    
    const data = {
        url: url,
        target: target,
        backend: backend,
        config: config,
        include: formData.get('include'),
        exclude: formData.get('exclude'),
        name: formData.get('name'),
        emoji: formData.get('emoji') === 'on' ? 'true' : 'false',
        append_type: formData.get('append_type') === 'on' ? 'true' : 'false',
        append_info: formData.get('append_info') === 'on' ? 'true' : 'false',
        scv: formData.get('scv') === 'on' ? 'true' : 'false',
        udp: formData.get('udp') === 'on' ? 'true' : 'false',
        list: formData.get('list') === 'on' ? 'true' : 'false',
        sort: formData.get('sort') === 'on' ? 'true' : 'false',
        fdn: formData.get('fdn') === 'on' ? 'true' : 'false',
        insert: formData.get('insert') === 'on' ? 'true' : 'false',
        ua: (formData.get('ua') || '').trim()
    };
    
    // Generate subscription URL
    if (!(await ensureUaSupported(data))) return;
    const newSubUrl = buildSubUrl(data);
    
    subUrl = newSubUrl;
    
    const modal = document.getElementById('qrModal');
    const canvas = document.getElementById('qrCodeCanvas');
    
    if (!modal || !canvas) return;
    
    // Check if QRCode is available
    if (typeof QRCode === 'undefined') {
        showToast('二维码库加载失败，请刷新页面重试', 'error');
        return;
    }
    
    // Generate Clash import URL
    const clashUrl = `clash://install-config?url=${encodeURIComponent(subUrl)}`;
    
    try {
        // Clear previous QR code
        canvas.innerHTML = '';
        
        // Determine colors based on theme
        const isDarkMode = document.documentElement.classList.contains('dark');
        const colorDark = isDarkMode ? '#FFFFFF' : '#1F2937';
        const colorLight = isDarkMode ? '#1F2937' : '#FFFFFF';
        
        // Create QR code using qrcodejs library
        new QRCode(canvas, {
            text: clashUrl,
            width: 256,
            height: 256,
            colorDark: colorDark,
            colorLight: colorLight,
            correctLevel: QRCode.CorrectLevel.M
        });
        
        // Show modal
        modal.classList.remove('hidden');
        showToast('Clash导入二维码生成成功', 'success');
    } catch (error) {
        showToast('Clash二维码生成失败', 'error');
    }
}

// Check backend version with optimized performance
async function checkBackendVersion(backend) {
    try {
        // Extract base URL by removing '/sub?' or '/sub' from the end
        const baseUrl = backend.replace(/\/sub\?$/, '').replace(/\/sub$/, '');
        const versionUrl = baseUrl + '/version';
        
        const controller = new AbortController();
        // Reduce timeout for mobile performance
        const timeoutMs = window.innerWidth < 768 ? 3000 : 5000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        const response = await fetch(versionUrl, {
            method: 'GET',
            mode: 'cors',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const info = parseBackendVersion(await response.text());
            if (info) backendInfo.set(backend, info);
            return info;
        }
        return null;
    } catch (error) {
        return null;
    }
}

// Update backend button label
function updateBackendButtonLabel() {
    const backendHeaderSelect = document.getElementById('backendHeader');
    const selectedBackendName = document.getElementById('selectedBackendName');
    
    if (backendHeaderSelect && selectedBackendName) {
        const selectedOption = backendHeaderSelect.options[backendHeaderSelect.selectedIndex];
        if (selectedOption) {
            let label = selectedOption.textContent;
            // Remove special indicators
            label = label.replace(/ ⚡.*$/, '').replace(/ \(\d+ms\)$/, '');
            selectedBackendName.textContent = label;
        }
    }
}

// Initialize and check backends
async function initializeBackends() {
    // Only initialize header selector now
    const backendHeaderSelect = document.getElementById('backendHeader');
    if (!backendHeaderSelect) return;
    
    // Show loading state with icon
    backendHeaderSelect.innerHTML = '<option value="">🔄 正在检测可用后端...</option>';
    backendHeaderSelect.disabled = true;
    
    // Show detection progress
    showToast('开始检测后端服务...', 'info');
    
    // Store results as they come in
    const backendResults = new Map();
    let currentSelected = null;
    let hasSelectedInitial = false;
    
    // Function to update backend list
    const updateBackendList = () => {
        const availableBackends = Array.from(backendResults.values())
            .filter(result => result.success)
            .sort((a, b) => a.responseTime - b.responseTime);
            
        if (availableBackends.length === 0) return;
        
        // Clear current options
        backendHeaderSelect.innerHTML = '';
        
        // Check if Lfree backend is available
        const lfreeBackend = availableBackends.find(backend => 
            backend.label.includes('Lfree提供') || backend.value.includes('api.sub.zaoy.cn')
        );
        
        let shouldSelectLfree = false;
        
        if (lfreeBackend) {
            // If we haven't selected initial backend or current selected is not Lfree, select Lfree
            if (!hasSelectedInitial || (currentSelected && !currentSelected.label.includes('Lfree提供'))) {
                shouldSelectLfree = true;
            }
            
            // Add Lfree backend first
            const lfreeOpt = document.createElement('option');
            lfreeOpt.value = lfreeBackend.value;
            lfreeOpt.textContent = `${backendLabel(lfreeBackend)} ⚡ 推荐`;
            lfreeOpt.selected = shouldSelectLfree;
            backendHeaderSelect.appendChild(lfreeOpt);
            
            if (shouldSelectLfree) {
                currentSelected = lfreeBackend;
                if (hasSelectedInitial) {
                    showToast(`✨ 检测到Lfree负载均衡后端，已自动切换！响应时间 ${lfreeBackend.responseTime}ms`, 'success');
                }
            }
            
            // Add other backends
            const otherBackends = availableBackends.filter(backend => backend !== lfreeBackend);
            otherBackends.forEach(backend => {
                const opt = document.createElement('option');
                opt.value = backend.value;
                opt.textContent = backendLabel(backend);
                backendHeaderSelect.appendChild(opt);
            });
        } else {
            // No Lfree backend, select fastest available
            availableBackends.forEach((backend, index) => {
                const opt = document.createElement('option');
                opt.value = backend.value;
                if (index === 0 && !hasSelectedInitial) {
                    opt.textContent = `${backendLabel(backend)} ⚡ 最快`;
                    opt.selected = true;
                    currentSelected = backend;
                } else {
                    opt.textContent = backendLabel(backend);
                }
                backendHeaderSelect.appendChild(opt);
            });
        }
        
        // Add custom backend option
        const customOpt = document.createElement('option');
        customOpt.value = 'custom';
        customOpt.textContent = '自建本地服务';
        backendHeaderSelect.appendChild(customOpt);
        
        backendHeaderSelect.disabled = false;
        updateBackendButtonLabel();
        
        if (!hasSelectedInitial) {
            hasSelectedInitial = true;
            const avgTime = Math.round(availableBackends.reduce((sum, b) => sum + b.responseTime, 0) / availableBackends.length);
            if (lfreeBackend && shouldSelectLfree) {
                showToast(`✨ 已自动选择Lfree负载均衡后端，响应时间 ${lfreeBackend.responseTime}ms`, 'success');
            } else {
                showToast(`已选择最快后端，响应时间 ${currentSelected.responseTime}ms`, 'success');
            }
        }
    };
    
    // Check all backends in parallel with optimized concurrency
    const maxConcurrent = window.innerWidth < 768 ? 3 : 6; // Limit concurrent requests on mobile
    const backendChunks = [];
    for (let i = 0; i < backendConfig.length; i += maxConcurrent) {
        backendChunks.push(backendConfig.slice(i, i + maxConcurrent));
    }
    
    // Process in chunks for better mobile performance
    for (const chunk of backendChunks) {
        const chunkPromises = chunk.map(async (backend, index) => {
            // Stagger the requests to avoid overwhelming the network
            const globalIndex = backendChunks.flat().indexOf(backend);
            await new Promise(resolve => setTimeout(resolve, globalIndex * 100));
            
            const startTime = Date.now();
            try {
                const version = await checkBackendVersion(backend.value);
                const responseTime = Date.now() - startTime;
                
                if (version) {
                    const result = {
                        ...backend,
                        version: version,
                        responseTime: responseTime,
                        label: backend.label,
                        success: true
                    };
                    
                    backendResults.set(backend.value, result);
                    updateBackendList();
                    
                    return result;
                }
            } catch (error) {
                // Backend failed
            }
            
            backendResults.set(backend.value, { ...backend, success: false });
            return null;
        });
        
        // Wait for current chunk to complete before starting next
        await Promise.all(chunkPromises);
    }
    
    // Wait at least 1 second, then show initial results if any
    setTimeout(() => {
        if (!hasSelectedInitial && backendResults.size > 0) {
            updateBackendList();
        }
    }, 1000);
    
    // Wait for all checks to complete
    // await Promise.all(checkPromises); // 移除此行，因为已经在上面处理完成
    
    // Final update in case we didn't have any results after 1 second
    if (backendResults.size > 0) {
        const successfulBackends = Array.from(backendResults.values()).filter(r => r.success);
        if (successfulBackends.length === 0) {
            // Fallback to original list if no backends respond
            backendHeaderSelect.innerHTML = '';
            backendConfig.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.label;
                backendHeaderSelect.appendChild(opt);
            });
            
            // Add custom backend option
            const customOpt = document.createElement('option');
            customOpt.value = 'custom';
            customOpt.textContent = '自建本地服务';
            backendHeaderSelect.appendChild(customOpt);
            
            showToast('未检测到可用的后端服务，请手动选择', 'warning');
            backendHeaderSelect.disabled = false;
        } else {
            updateBackendList();
        }
    }
    
    updateBackendButtonLabel();
}

// Smart auto-completion for backend URL
function autoCompleteBackendUrl(url) {
    // Remove trailing spaces
    url = url.trim();
    
    // If URL ends with just the domain (no trailing slash), add /sub?
    // Example: https://api.sub.zaoy.cn -> https://api.sub.zaoy.cn/sub?
    if (url.match(/^https?:\/\/[^\/]+$/) && !url.includes('/sub')) {
        return url + '/sub?';
    }
    
    // If URL ends with trailing slash only, add ?
    // Example: https://api.sub.zaoy.cn/ -> https://api.sub.zaoy.cn/?
    if (url.match(/^https?:\/\/[^\/]+\/$/) && !url.includes('/sub')) {
        return url + '?';
    }
    
    // If URL already has /sub but no query string, add ?
    // Example: https://api.sub.zaoy.cn/sub -> https://api.sub.zaoy.cn/sub?
    if (url.endsWith('/sub') && !url.includes('?')) {
        return url + '?';
    }
    
    // If URL already has query parameters, keep as is
    if (url.includes('?')) {
        return url;
    }
    
    // Default fallback: add /sub? if no /sub exists and no trailing slash
    if (!url.includes('/sub') && !url.endsWith('/')) {
        return url + '/sub?';
    }
    
    return url;
}

// Handle custom config toggle
function handleCustomConfigToggle() {
    const toggle = document.getElementById('customConfigToggle');
    const configSelectContainer = document.getElementById('configSelectContainer');
    const customConfigContainer = document.getElementById('customConfigContainer');
    const customConfigInput = document.getElementById('customConfig');
    
    if (!toggle || !configSelectContainer || !customConfigContainer) return;
    
    if (toggle.checked) {
        // Show custom input, hide select
        configSelectContainer.classList.add('hidden');
        customConfigContainer.classList.remove('hidden');
        if (customConfigInput) {
            customConfigInput.focus();
            customConfigInput.required = true;
        }
        showToast('已切换到自定义配置模式', 'info');
    } else {
        // Show select, hide custom input
        configSelectContainer.classList.remove('hidden');
        customConfigContainer.classList.add('hidden');
        if (customConfigInput) {
            customConfigInput.required = false;
            customConfigInput.value = '';
        }
        showToast('已切换到预设配置模式', 'info');
    }
}

// Initialize on document ready
$(document).ready(() => {
    // Initialize form elements
    initializeForm();
    
    // Check backend versions
    initializeBackends();
    
    // Custom config toggle
    const customConfigToggle = document.getElementById('customConfigToggle');
    if (customConfigToggle) {
        customConfigToggle.addEventListener('change', handleCustomConfigToggle);
    }
    
    // Backend dropdown toggle
    const backendToggle = document.getElementById('backendToggle');
    const backendDropdown = document.getElementById('backendDropdown');
    const backendHeaderSelect = document.getElementById('backendHeader');
    
    if (backendToggle && backendDropdown) {
        backendToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            backendDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!backendDropdown.contains(e.target) && !backendToggle.contains(e.target)) {
                backendDropdown.classList.add('hidden');
            }
        });
    }
    
    // Add change listener for header backend selector
    if (backendHeaderSelect) {
        backendHeaderSelect.addEventListener('change', () => {
            syncBackendSelectors('backendHeader');
            // Close dropdown after selection
            if (backendDropdown) {
                backendDropdown.classList.add('hidden');
            }
        });
    }
    
    // Form submission
    const form = document.getElementById('optionsForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Import to Clash button
    const importBtn = document.getElementById('importToClash');
    if (importBtn) {
        importBtn.addEventListener('click', handleImportToClash);
    }
    
    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopy);
    }
    
    // QR Code button
    const qrBtn = document.getElementById('qrBtn');
    if (qrBtn) {
        qrBtn.addEventListener('click', handleQrCode);
    }
    
    // Clash QR Code button
    const clashQrBtn = document.getElementById('clashQrBtn');
    if (clashQrBtn) {
        clashQrBtn.addEventListener('click', handleClashQrCode);
    }
    
    // QR Modal close buttons
    const closeQrModal = document.getElementById('closeQrModal');
    const qrModal = document.getElementById('qrModal');
    
    if (closeQrModal && qrModal) {
        closeQrModal.addEventListener('click', () => {
            qrModal.classList.add('hidden');
        });
        
        // Close modal when clicking outside
        qrModal.addEventListener('click', (e) => {
            if (e.target === qrModal) {
                qrModal.classList.add('hidden');
            }
        });
    }
    
    // Refresh backends buttons - only header refresh button now
    const refreshBtn = document.getElementById('refreshBackendsHeader');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('animate-spin');
            refreshBtn.disabled = true;
            
            await initializeBackends();
            
            icon.classList.remove('animate-spin');
            refreshBtn.disabled = false;
        });
    }
    
    // Mobile Advanced Options Modal
    const mobileAdvancedToggle = document.getElementById('mobileAdvancedToggle');
    const mobileAdvancedModal = document.getElementById('mobileAdvancedModal');
    const closeMobileAdvancedModal = document.getElementById('closeMobileAdvancedModal');
    const advancedToggleIcon = document.getElementById('advancedToggleIcon');

    // Initialize mobile advanced options
    syncMobileAdvancedOptions();

    if (mobileAdvancedToggle) {
        mobileAdvancedToggle.addEventListener('click', () => {
            syncMobileAdvancedOptions();
            mobileAdvancedModal.classList.remove('hidden');
            if (advancedToggleIcon) {
                advancedToggleIcon.classList.add('rotate-180');
            }
        });
    }

    if (closeMobileAdvancedModal) {
        closeMobileAdvancedModal.addEventListener('click', () => {
            mobileAdvancedModal.classList.add('hidden');
            if (advancedToggleIcon) {
                advancedToggleIcon.classList.remove('rotate-180');
            }
        });
    }

    // Mobile advanced option toggles
    const mobileOptionCards = document.querySelectorAll('.mobile-option-card[data-option]');
    mobileOptionCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const optionName = card.getAttribute('data-option');
            if (optionName) {
                console.log('Clicking option:', optionName); // Debug log
                handleMobileAdvancedToggle(optionName);
            }
        });
        
        // Also add touch events for better mobile support
        card.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const optionName = card.getAttribute('data-option');
            if (optionName) {
                console.log('Touch option:', optionName); // Debug log
                handleMobileAdvancedToggle(optionName);
            }
        });
    });

    // Close modal when clicking outside
    if (mobileAdvancedModal) {
        mobileAdvancedModal.addEventListener('click', (e) => {
            if (e.target === mobileAdvancedModal) {
                mobileAdvancedModal.classList.add('hidden');
                if (advancedToggleIcon) {
                    advancedToggleIcon.classList.remove('rotate-180');
                }
            }
        });
    }

    // Mobile Bottom Action Buttons
    const generateBtnMobile = document.getElementById('generateBtnMobile');
    const importToClashMobile = document.getElementById('importToClashMobile');
    const clashQrBtnMobile = document.getElementById('clashQrBtnMobile');

    if (generateBtnMobile) {
        generateBtnMobile.addEventListener('click', () => {
            // 验证必填字段
            const form = document.getElementById('optionsForm');
            const urlInput = document.getElementById('url');
            const targetSelect = document.getElementById('target');
            const backendHeaderSelect = document.getElementById('backendHeader');
            
            if (!form) {
                showToast('表单未找到', 'error');
                return;
            }
            
            // 验证订阅链接
            if (!urlInput || !urlInput.value.trim()) {
                showToast('请填写订阅链接', 'error');
                urlInput?.focus();
                return;
            }
            
            // 验证客户端类型
            if (!targetSelect || !targetSelect.value) {
                showToast('请选择客户端类型', 'error');
                return;
            }
            
            // 验证后端服务
            if (!backendHeaderSelect || !backendHeaderSelect.value) {
                showToast('请选择后端服务', 'error');
                return;
            }
            
            // 如果选择了自定义后端，验证自定义后端地址
            if (backendHeaderSelect.value === 'custom') {
                const customBackendHeader = document.getElementById('customBackendHeader');
                if (!customBackendHeader || !customBackendHeader.value.trim()) {
                    showToast('请输入自定义后端地址', 'error');
                    return;
                }
            }
            
            // 如果开启了自定义配置，验证自定义配置链接
            const customConfigToggle = document.getElementById('customConfigToggle');
            if (customConfigToggle && customConfigToggle.checked) {
                const customConfigInput = document.getElementById('customConfig');
                if (!customConfigInput || !customConfigInput.value.trim()) {
                    showToast('请输入自定义配置链接', 'error');
                    return;
                }
                // 验证URL格式
                try {
                    new URL(customConfigInput.value.trim());
                } catch (e) {
                    showToast('自定义配置链接格式不正确，请输入有效的URL', 'error');
                    return;
                }
            }
            
            // 所有验证通过，触发表单提交
            form.dispatchEvent(new Event('submit'));
        });
    }

    if (importToClashMobile) {
        importToClashMobile.addEventListener('click', handleImportToClash);
    }

    if (clashQrBtnMobile) {
        clashQrBtnMobile.addEventListener('click', handleClashQrCode);
    }

    // Show welcome message
    setTimeout(() => {
        showToast('欢迎使用 在线订阅转换工具！', 'info');
    }, 500);
});
