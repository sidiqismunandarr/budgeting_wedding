/**
 * Our Wedding Budget — Perencana Anggaran Pernikahan
 * JavaScript Application Logic (app.js)
 */

// ==========================================================================
// 1. STATE & DEFAULT CONFIGURATION
// ==========================================================================
const STORAGE_KEY = 'our_wedding_budget_v1';

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Venue dan dekorasi', icon: 'flower-2', planned: 45000000 },
    { id: 'cat-2', name: 'Catering', icon: 'utensils', planned: 55000000 },
    { id: 'cat-3', name: 'Wedding attire', icon: 'shirt', planned: 15000000 },
    { id: 'cat-4', name: 'Makeup dan hairdo', icon: 'sparkles', planned: 8500000 },
    { id: 'cat-5', name: 'Fotografi dan videografi', icon: 'camera', planned: 14000000 },
    { id: 'cat-6', name: 'Undangan dan souvenir', icon: 'mail-open', planned: 6500000 },
    { id: 'cat-7', name: 'Wedding organizer', icon: 'clipboard-check', planned: 12000000 },
    { id: 'cat-8', name: 'Mahar dan seserahan', icon: 'gift', planned: 10000000 },
    { id: 'cat-9', name: 'Transportasi dan akomodasi', icon: 'car', planned: 5000000 },
    { id: 'cat-10', name: 'Administrasi pernikahan', icon: 'file-text', planned: 2500000 },
    { id: 'cat-11', name: 'Entertainment', icon: 'music', planned: 6000000 },
    { id: 'cat-12', name: 'Dana darurat', icon: 'shield-alert', planned: 10000000 },
    { id: 'cat-13', name: 'Lainnya', icon: 'more-horizontal', planned: 4000000 }
];

/**
 * Menghasilkan data default contoh untuk pertama kali aplikasi dibuka
 */
function getInitialDummyData() {
    // Set target tanggal pernikahan ~9 bulan dari hari ini
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 9);
    futureDate.setHours(9, 0, 0, 0);
    const isoFuture = new Date(futureDate.getTime() - (futureDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

    const todayStr = new Date().toISOString().slice(0, 10);

    return {
        settings: {
            partner1: 'Naya',
            partner2: 'Arka',
            weddingDate: isoFuture,
            location: 'Jakarta Selatan'
        },
        categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
        transactions: [
            {
                id: 'tx-1',
                name: 'Booking Fee Gedung & Taman',
                categoryId: 'cat-1',
                amount: 15000000,
                date: '2026-09-12',
                status: 'DP',
                source: 'Tabungan Bersama',
                notes: 'Pelunasan H-30 sebelum acara (Total paket 45jt)'
            },
            {
                id: 'tx-2',
                name: 'DP Catering 400 Pax',
                categoryId: 'cat-2',
                amount: 20000000,
                date: '2026-10-03',
                status: 'DP',
                source: 'Tabungan Bersama',
                notes: 'Include 4 gubukan & test food keluarga'
            },
            {
                id: 'tx-3',
                name: 'Paket Dokumentasi Foto & Cinematic',
                categoryId: 'cat-5',
                amount: 14000000,
                date: '2026-10-18',
                status: 'Lunas',
                source: 'Pasangan',
                notes: 'Lunas promo pameran pernikahan + bonus prewedding'
            },
            {
                id: 'tx-4',
                name: 'DP Wedding Organizer Hari-H',
                categoryId: 'cat-7',
                amount: 5000000,
                date: '2026-10-25',
                status: 'DP',
                source: 'Tabungan Bersama',
                notes: 'Tim 8 crew + MC Akad & Resepsi'
            },
            {
                id: 'tx-5',
                name: 'Cincin Kawin & Kotak Seserahan',
                categoryId: 'cat-8',
                amount: 8500000,
                date: '2026-11-02',
                status: 'Lunas',
                source: 'Saya',
                notes: 'Emas putih & berlian kecil'
            },
            {
                id: 'tx-6',
                name: 'Pelunasan Sisa Gedung & Dekorasi',
                categoryId: 'cat-1',
                amount: 30000000,
                date: todayStr,
                status: 'Belum Dibayar',
                source: 'Tabungan Bersama',
                notes: 'Jatuh tempo 1 bulan sebelum acara'
            }
        ],
        savings: {
            target: 180000000,
            monthlyTarget: 10000000,
            deposits: [
                { id: 'dep-1', depositor: 'Saya', amount: 25000000, date: '2026-07-01', note: 'Tabungan awal pernikahan' },
                { id: 'dep-2', depositor: 'Pasangan', amount: 30000000, date: '2026-07-01', note: 'Tabungan awal dari rekening khusus' },
                { id: 'dep-3', depositor: 'Saya', amount: 6000000, date: '2026-08-05', note: 'Setoran rutin Agustus' },
                { id: 'dep-4', depositor: 'Pasangan', amount: 7500000, date: '2026-08-05', note: 'Setoran rutin Agustus' },
                { id: 'dep-5', depositor: 'Saya', amount: 6000000, date: '2026-09-05', note: 'Setoran rutin September' },
                { id: 'dep-6', depositor: 'Pasangan', amount: 7500000, date: '2026-09-05', note: 'Setoran rutin September' },
                { id: 'dep-7', depositor: 'Saya', amount: 8000000, date: '2026-10-05', note: 'Setoran + sebagian bonus' },
                { id: 'dep-8', depositor: 'Pasangan', amount: 8000000, date: '2026-10-05', note: 'Setoran rutin Oktober' }
            ]
        }
    };
}

// Global Application State
let appState = loadState();
let activeTab = 'dashboard';

/**
 * Memuat state dari LocalStorage browser
 */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Validasi integritas kategori
            if (!parsed.categories || parsed.categories.length !== 13) {
                parsed.categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
            }
            if (!parsed.savings) {
                parsed.savings = { target: 180000000, monthlyTarget: 10000000, deposits: [] };
            }
            if (!parsed.transactions) {
                parsed.transactions = [];
            }
            return parsed;
        }
    } catch (e) {
        console.error('Gagal memuat localStorage:', e);
    }
    const initial = getInitialDummyData();
    saveState(initial);
    return initial;
}

/**
 * Menyimpan state ke LocalStorage
 */
function saveState(stateToSave = appState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
        console.error('Gagal menyimpan ke localStorage:', e);
    }
}

// ==========================================================================
// 2. FORMATTING & HELPER FUNCTIONS
// ==========================================================================
function formatRupiah(num) {
    const val = Number(num) || 0;
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(val);
}

function formatDateIndo(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-sage-dark text-white' : 'bg-charcoal text-white';
    toast.className = `${bgClass} px-4 py-3 rounded-2xl shadow-lg text-xs font-medium flex items-center gap-2 transition-all duration-300 transform translate-y-0 opacity-100`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
        toast.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 2800);
}

// ==========================================================================
// 3. NAVIGATION & TABS
// ==========================================================================
function switchTab(tabName) {
    activeTab = tabName;

    // Sembunyikan semua tab content
    document.querySelectorAll('.tab-content').forEach(sec => sec.classList.add('hidden'));
    const targetSec = document.getElementById(`tab-${tabName}`);
    if (targetSec) targetSec.classList.remove('hidden');

    // Update Desktop Nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('bg-white', 'text-charcoal', 'shadow-xs');
            btn.classList.remove('text-charcoal-muted', 'hover:text-charcoal');
        } else {
            btn.classList.remove('bg-white', 'text-charcoal', 'shadow-xs');
            btn.classList.add('text-charcoal-muted', 'hover:text-charcoal');
        }
    });

    // Update Mobile Nav
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('text-sage-dark', 'bg-sage-light/70', 'font-bold');
            btn.classList.remove('text-charcoal-muted');
        } else {
            btn.classList.remove('text-sage-dark', 'bg-sage-light/70', 'font-bold');
            btn.classList.add('text-charcoal-muted');
        }
    });

    renderAll();
}

// ==========================================================================
// 4. METRIC & FINANCIAL CALCULATIONS
// ==========================================================================
function getFinancialMetrics() {
    const totalBudget = appState.categories.reduce((sum, c) => sum + Number(c.planned || 0), 0);

    // Pengeluaran aktual (DP + Lunas)
    const paidTransactions = appState.transactions.filter(t => t.status === 'DP' || t.status === 'Lunas');
    const totalSpent = paidTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Komitmen total (termasuk Belum Dibayar)
    const totalCommitted = appState.transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

    // Tabungan bersama
    const totalDeposited = appState.savings.deposits.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const p1Deposits = appState.savings.deposits
        .filter(d => d.depositor === 'Saya')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const p2Deposits = appState.savings.deposits
        .filter(d => d.depositor === 'Pasangan')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);

    // Pengeluaran langsung dari Tabungan Bersama
    const spentFromJoint = paidTransactions
        .filter(t => t.source === 'Tabungan Bersama')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const remainingBudget = totalBudget - totalSpent;

    return {
        totalBudget,
        totalSpent,
        totalCommitted,
        totalDeposited,
        p1Deposits,
        p2Deposits,
        spentFromJoint,
        remainingBudget
    };
}

function getCategorySpent(categoryId) {
    return appState.transactions
        .filter(t => t.categoryId === categoryId && (t.status === 'DP' || t.status === 'Lunas'))
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
}

// ==========================================================================
// 5. RENDERING FUNCTIONS
// ==========================================================================
function renderAll() {
    renderHeaderAndCountdown();
    renderDashboard();
    renderBudgeting();
    populateCategorySelects();
    renderTransactions();
    renderSavings();
    if (window.lucide) {
        lucide.createIcons();
    }
}

function renderHeaderAndCountdown() {
    const { partner1, partner2, weddingDate, location } = appState.settings;
    document.getElementById('display-couple-names').textContent = `${partner1} & ${partner2}`;
    document.getElementById('display-wedding-location').textContent = location || 'Indonesia';

    const wDate = new Date(weddingDate);
    if (!isNaN(wDate.getTime())) {
        document.getElementById('display-wedding-date').textContent = wDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    // Update label nama pasangan di seluruh tampilan
    document.getElementById('dash-label-p1').textContent = partner1;
    document.getElementById('dash-label-p2').textContent = partner2;
    document.getElementById('sav-name-p1').textContent = `${partner1} (Saya)`;
    document.getElementById('sav-name-p2').textContent = `${partner2} (Pasangan)`;
    document.getElementById('radio-label-p1').textContent = partner1;
    document.getElementById('radio-label-p2').textContent = partner2;

    updateCountdownTimer();
}

function updateCountdownTimer() {
    const dateStr = appState.settings.weddingDate;
    const target = dateStr ? new Date(dateStr).getTime() : 0;
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');

    if (elDays) elDays.textContent = isNaN(days) ? 0 : days;
    if (elHours) elHours.textContent = isNaN(hours) ? '00' : String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = isNaN(minutes) ? '00' : String(minutes).padStart(2, '0');
}

function renderDashboard() {
    const m = getFinancialMetrics();
    const savTarget = Number(appState.savings.target) || 1;
    const savPct = Math.min(100, Math.round((m.totalDeposited / savTarget) * 100));
    const budgetUsedPct = m.totalBudget > 0 ? Math.round((m.totalSpent / m.totalBudget) * 100) : 0;

    // 4 Kartu Ringkasan Finansial
    document.getElementById('dash-total-budget').textContent = formatRupiah(m.totalBudget);
    document.getElementById('dash-total-spent').textContent = formatRupiah(m.totalSpent);
    document.getElementById('dash-committed-note').textContent = `Total komitmen vendor: ${formatRupiah(m.totalCommitted)}`;

    document.getElementById('dash-total-saved').textContent = formatRupiah(m.totalDeposited);
    document.getElementById('dash-saved-target-note').textContent = `Target: ${formatRupiah(appState.savings.target)}`;

    const remEl = document.getElementById('dash-remaining-budget');
    remEl.textContent = formatRupiah(m.remainingBudget);
    remEl.className = `text-xl sm:text-2xl font-bold tabular-nums ${m.remainingBudget < 0 ? 'text-red-600' : 'text-charcoal'}`;
    document.getElementById('dash-budget-usage-pct').textContent = `${budgetUsedPct}% dari target budget terpakai`;

    // Progress Tabungan di Dashboard
    document.getElementById('dash-savings-pct-badge').textContent = `${savPct}%`;
    document.getElementById('dash-savings-bar').style.width = `${savPct}%`;
    document.getElementById('dash-bar-current').textContent = formatRupiah(m.totalDeposited);
    document.getElementById('dash-bar-target').textContent = formatRupiah(appState.savings.target);
    document.getElementById('dash-val-p1').textContent = formatRupiah(m.p1Deposits);
    document.getElementById('dash-val-p2').textContent = formatRupiah(m.p2Deposits);

    // Top 5 Kategori Terbesar
    const topCats = [...appState.categories]
        .sort((a, b) => b.planned - a.planned)
        .slice(0, 5);

    const topCatContainer = document.getElementById('dash-top-categories');
    topCatContainer.innerHTML = topCats.map(cat => {
        const spent = getCategorySpent(cat.id);
        const pct = cat.planned > 0 ? Math.min(100, Math.round((spent / cat.planned) * 100)) : 0;
        const isOver = spent > cat.planned;

        return `
            <div>
                <div class="flex justify-between items-center text-xs mb-1.5">
                    <span class="font-semibold text-charcoal flex items-center gap-1.5">
                        <i data-lucide="${cat.icon}" class="w-3.5 h-3.5 text-sage-dark"></i>
                        ${cat.name}
                    </span>
                    <span class="tabular-nums text-charcoal-muted">
                        <strong class="${isOver ? 'text-red-600' : 'text-charcoal'}">${formatRupiah(spent)}</strong> / ${formatRupiah(cat.planned)}
                    </span>
                </div>
                <div class="w-full h-2.5 bg-beige rounded-full overflow-hidden">
                    <div class="h-full rounded-full ${isOver ? 'bg-red-400' : 'bg-sage'} transition-all duration-500" style="width: ${pct}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Status Pembayaran Transaksi
    const lunasTxs = appState.transactions.filter(t => t.status === 'Lunas');
    const dpTxs = appState.transactions.filter(t => t.status === 'DP');
    const belumTxs = appState.transactions.filter(t => t.status === 'Belum Dibayar');

    document.getElementById('stat-count-lunas').textContent = lunasTxs.length;
    document.getElementById('stat-sum-lunas').textContent = formatRupiah(lunasTxs.reduce((s, t) => s + Number(t.amount || 0), 0));

    document.getElementById('stat-count-dp').textContent = dpTxs.length;
    document.getElementById('stat-sum-dp').textContent = formatRupiah(dpTxs.reduce((s, t) => s + Number(t.amount || 0), 0));

    document.getElementById('stat-count-belum').textContent = belumTxs.length;
    document.getElementById('stat-sum-belum').textContent = formatRupiah(belumTxs.reduce((s, t) => s + Number(t.amount || 0), 0));

    // 4 Transaksi Terbaru
    const recentTxs = [...appState.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    const recentContainer = document.getElementById('dash-recent-transactions');
    if (recentTxs.length === 0) {
        recentContainer.innerHTML = `<p class="text-xs text-charcoal-muted text-center py-6">Belum ada transaksi tercatat.</p>`;
    } else {
        recentContainer.innerHTML = recentTxs.map(tx => {
            const cat = appState.categories.find(c => c.id === tx.categoryId);
            return `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-cream border border-beige-dark/50">
                    <div class="min-w-0 pr-2">
                        <div class="text-xs font-bold text-charcoal truncate">${tx.name}</div>
                        <div class="text-[11px] text-charcoal-muted flex items-center gap-1.5 mt-0.5">
                            <span>${cat ? cat.name : 'Lainnya'}</span>
                            <span>•</span>
                            <span>${formatDateIndo(tx.date)}</span>
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        <div class="text-xs font-bold text-charcoal tabular-nums">${formatRupiah(tx.amount)}</div>
                        ${getStatusBadgeHTML(tx.status)}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function renderBudgeting() {
    const m = getFinancialMetrics();
    document.getElementById('budget-page-total').textContent = formatRupiah(m.totalBudget);

    const grid = document.getElementById('categories-grid');
    grid.innerHTML = appState.categories.map((cat, idx) => {
        const spent = getCategorySpent(cat.id);
        const remaining = cat.planned - spent;
        const pct = cat.planned > 0 ? Math.round((spent / cat.planned) * 100) : (spent > 0 ? 100 : 0);
        const barWidth = Math.min(100, pct);
        const isOver = remaining < 0;

        return `
            <div class="bg-white rounded-3xl p-5 border ${isOver ? 'border-red-200' : 'border-beige-dark/60'} shadow-card hover:shadow-soft transition-all flex flex-col justify-between">
                <div>
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-2xl ${isOver ? 'bg-red-50 text-red-500' : 'bg-sage-light text-sage-dark'} flex items-center justify-center shrink-0">
                                <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <span class="text-[10px] font-semibold uppercase tracking-wider text-charcoal-muted">Pos #${idx + 1}</span>
                                <h3 class="text-sm font-bold text-charcoal leading-snug">${cat.name}</h3>
                            </div>
                        </div>
                        <button onclick="openEditBudgetModal('${cat.id}')" class="p-2 rounded-xl bg-cream hover:bg-beige text-charcoal-muted hover:text-charcoal transition" title="Edit Rencana Budget">
                            <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                        </button>
                    </div>

                    <!-- Amounts Breakdown -->
                    <div class="space-y-1.5 text-xs bg-cream/80 p-3.5 rounded-2xl border border-beige-dark/40">
                        <div class="flex justify-between">
                            <span class="text-charcoal-muted">Direncanakan:</span>
                            <button onclick="openEditBudgetModal('${cat.id}')" class="font-bold text-charcoal hover:text-sage-dark underline decoration-dotted tabular-nums">
                                ${formatRupiah(cat.planned)}
                            </button>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-charcoal-muted">Dikeluarkan:</span>
                            <span class="font-semibold text-charcoal tabular-nums">${formatRupiah(spent)}</span>
                        </div>
                        <div class="flex justify-between pt-1.5 border-t border-beige-dark/50">
                            <span class="text-charcoal-muted">Sisa Anggaran:</span>
                            <span class="font-bold tabular-nums ${isOver ? 'text-red-600' : 'text-sage-dark'}">
                                ${isOver ? 'Over ' + formatRupiah(Math.abs(remaining)) : formatRupiah(remaining)}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-4">
                    <div class="flex justify-between text-[11px] font-semibold mb-1">
                        <span class="text-charcoal-muted">Penggunaan</span>
                        <span class="${isOver ? 'text-red-600' : 'text-sage-dark'}">${pct}%</span>
                    </div>
                    <div class="w-full h-2.5 bg-beige rounded-full overflow-hidden">
                        <div class="h-full rounded-full ${isOver ? 'bg-red-500' : (pct > 85 ? 'bg-amber-400' : 'bg-sage')} transition-all duration-500" style="width: ${barWidth}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getStatusBadgeHTML(status) {
    if (status === 'Lunas') {
        return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-light text-sage-dark border border-sage/30">Lunas</span>`;
    } else if (status === 'DP') {
        return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100/80 text-amber-800 border border-amber-200">DP</span>`;
    } else {
        return `<span class="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-softpink-light text-softpink-accent border border-softpink">Belum Dibayar</span>`;
    }
}

function populateCategorySelects() {
    const filterSel = document.getElementById('filter-category');
    const modalSel = document.getElementById('tx-category');
    const currentFilter = filterSel ? filterSel.value : 'ALL';

    if (filterSel) {
        filterSel.innerHTML = `<option value="ALL">Semua Kategori</option>` +
            appState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        filterSel.value = currentFilter || 'ALL';
    }

    if (modalSel) {
        modalSel.innerHTML = appState.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
}

function renderTransactions() {
    const searchInput = document.getElementById('filter-search');
    const catInput = document.getElementById('filter-category');
    const statusInput = document.getElementById('filter-status');
    const sourceInput = document.getElementById('filter-source');

    const search = (searchInput ? searchInput.value : '').toLowerCase();
    const catFilter = catInput ? catInput.value : 'ALL';
    const statusFilter = statusInput ? statusInput.value : 'ALL';
    const sourceFilter = sourceInput ? sourceInput.value : 'ALL';

    const filtered = appState.transactions.filter(tx => {
        const matchSearch = tx.name.toLowerCase().includes(search) || (tx.notes || '').toLowerCase().includes(search);
        const matchCat = catFilter === 'ALL' || tx.categoryId === catFilter;
        const matchStatus = statusFilter === 'ALL' || tx.status === statusFilter;
        const matchSource = sourceFilter === 'ALL' || tx.source === sourceFilter;
        return matchSearch && matchCat && matchStatus && matchSource;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalFilteredSum = filtered.reduce((s, t) => s + Number(t.amount || 0), 0);
    document.getElementById('tx-filtered-count').textContent = `Menampilkan ${filtered.length} dari ${appState.transactions.length} transaksi`;
    document.getElementById('tx-filtered-sum').textContent = formatRupiah(totalFilteredSum);

    const listEl = document.getElementById('transactions-list');
    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="bg-white rounded-3xl p-10 border border-beige-dark/60 text-center">
                <div class="w-12 h-12 rounded-2xl bg-beige mx-auto flex items-center justify-center text-charcoal-muted mb-3">
                    <i data-lucide="receipt" class="w-6 h-6"></i>
                </div>
                <h4 class="font-romantic text-xl font-bold text-charcoal">Tidak ada transaksi ditemukan</h4>
                <p class="text-xs text-charcoal-muted mt-1">Coba ubah kata kunci pencarian atau tambahkan transaksi baru.</p>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
        return;
    }

    listEl.innerHTML = filtered.map(tx => {
        const cat = appState.categories.find(c => c.id === tx.categoryId);
        const sourceLabel = tx.source === 'Saya' ? appState.settings.partner1 : (tx.source === 'Pasangan' ? appState.settings.partner2 : 'Tabungan Bersama');

        return `
            <div class="bg-white rounded-3xl p-4 sm:p-5 border border-beige-dark/60 shadow-card hover:shadow-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3.5">
                    <div class="w-11 h-11 rounded-2xl bg-cream border border-beige-dark/60 flex items-center justify-center text-sage-dark shrink-0 mt-0.5">
                        <i data-lucide="${cat ? cat.icon : 'receipt'}" class="w-5 h-5"></i>
                    </div>
                    <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                            <h4 class="text-sm font-bold text-charcoal">${tx.name}</h4>
                            ${getStatusBadgeHTML(tx.status)}
                        </div>
                        <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-charcoal-muted">
                            <span class="font-medium text-sage-dark">${cat ? cat.name : 'Lainnya'}</span>
                            <span>•</span>
                            <span>${formatDateIndo(tx.date)}</span>
                            <span>•</span>
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-beige/70 text-charcoal text-[11px]">
                                <i data-lucide="wallet-cards" class="w-3 h-3"></i> ${sourceLabel}
                            </span>
                        </div>
                        ${tx.notes ? `<p class="text-xs text-charcoal-muted italic pt-0.5">"${tx.notes}"</p>` : ''}
                    </div>
                </div>

                <div class="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-beige gap-2 shrink-0">
                    <div class="text-base font-bold text-charcoal tabular-nums">${formatRupiah(tx.amount)}</div>
                    <div class="flex items-center gap-1.5">
                        <button onclick="openTransactionModal('${tx.id}')" class="p-2 rounded-xl bg-cream hover:bg-beige text-charcoal-muted hover:text-charcoal transition" title="Edit Transaksi">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                        </button>
                        <button onclick="confirmDeleteTransaction('${tx.id}')" class="p-2 rounded-xl bg-softpink-light/60 hover:bg-softpink text-softpink-accent hover:text-red-700 transition" title="Hapus Transaksi">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    if (window.lucide) lucide.createIcons();
}

function renderSavings() {
    const m = getFinancialMetrics();
    const target = Number(appState.savings.target) || 1;
    const pct = Math.min(100, Math.round((m.totalDeposited / target) * 100));
    const remaining = Math.max(0, appState.savings.target - m.totalDeposited);

    document.getElementById('sav-current-balance').textContent = formatRupiah(m.totalDeposited);
    document.getElementById('sav-net-note').textContent = `Terpakai transaksi bersama: ${formatRupiah(m.spentFromJoint)}`;
    document.getElementById('sav-target-amount').textContent = formatRupiah(appState.savings.target);
    document.getElementById('sav-pct-text').textContent = `${pct}% dari target tercapai`;
    document.getElementById('sav-remaining-target').textContent = formatRupiah(remaining);
    document.getElementById('sav-monthly-target-note').textContent = `Target setoran rutin: ${formatRupiah(appState.savings.monthlyTarget)}/bln`;

    document.getElementById('sav-bar-label').textContent = `${pct}%`;
    document.getElementById('sav-main-bar').style.width = `${pct}%`;

    // Perbandingan Kontribusi Pasangan
    const totalContrib = m.p1Deposits + m.p2Deposits;
    const p1Pct = totalContrib > 0 ? Math.round((m.p1Deposits / totalContrib) * 100) : 50;
    const p2Pct = totalContrib > 0 ? (100 - p1Pct) : 50;

    document.getElementById('contrib-bar-p1').style.width = `${p1Pct}%`;
    document.getElementById('contrib-bar-p2').style.width = `${p2Pct}%`;

    document.getElementById('sav-amount-p1').textContent = formatRupiah(m.p1Deposits);
    document.getElementById('sav-pct-p1').textContent = `${totalContrib > 0 ? p1Pct : 0}%`;

    document.getElementById('sav-amount-p2').textContent = formatRupiah(m.p2Deposits);
    document.getElementById('sav-pct-p2').textContent = `${totalContrib > 0 ? p2Pct : 0}%`;

    // Riwayat Setoran
    const sortedDeposits = [...appState.savings.deposits].sort((a, b) => new Date(b.date) - new Date(a.date));
    document.getElementById('dep-history-count').textContent = `${sortedDeposits.length} Setoran`;

    const listEl = document.getElementById('deposits-list');
    if (sortedDeposits.length === 0) {
        listEl.innerHTML = `<p class="text-xs text-charcoal-muted text-center py-8">Belum ada riwayat setoran tabungan.</p>`;
    } else {
        listEl.innerHTML = sortedDeposits.map(dep => {
            const isP1 = dep.depositor === 'Saya';
            const personName = isP1 ? appState.settings.partner1 : appState.settings.partner2;
            return `
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-cream border border-beige-dark/50 hover:border-beige-dark transition">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-10 h-10 rounded-2xl ${isP1 ? 'bg-sage-light text-sage-dark' : 'bg-softpink-light text-softpink-accent'} flex items-center justify-center font-bold text-sm shrink-0">
                            ${personName.charAt(0).toUpperCase()}
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-charcoal">${personName}</span>
                                <span class="text-[11px] text-charcoal-muted">• ${formatDateIndo(dep.date)}</span>
                            </div>
                            <p class="text-xs text-charcoal-muted truncate">${dep.note || 'Setoran tabungan pernikahan'}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2.5 shrink-0 pl-2">
                        <span class="text-sm font-bold ${isP1 ? 'text-sage-dark' : 'text-softpink-accent'} tabular-nums">
                            +${formatRupiah(dep.amount)}
                        </span>
                        <button onclick="confirmDeleteDeposit('${dep.id}')" class="p-1.5 rounded-xl hover:bg-softpink-light text-charcoal-muted hover:text-red-600 transition" title="Hapus Setoran">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// ==========================================================================
// 6. MODAL & FORM HANDLERS
// ==========================================================================
function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    el.classList.add('flex');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('hidden');
    el.classList.remove('flex');
}

// 1. Transaction Modal Handlers
function openTransactionModal(txId = null) {
    populateCategorySelects();
    const form = document.getElementById('form-transaction');
    if (form) form.reset();

    if (txId) {
        const tx = appState.transactions.find(t => t.id === txId);
        if (!tx) return;
        document.getElementById('modal-tx-title').textContent = 'Edit Transaksi';
        document.getElementById('tx-id').value = tx.id;
        document.getElementById('tx-name').value = tx.name;
        document.getElementById('tx-category').value = tx.categoryId;
        document.getElementById('tx-amount').value = tx.amount;
        document.getElementById('tx-date').value = tx.date;
        document.getElementById('tx-status').value = tx.status;
        document.getElementById('tx-source').value = tx.source;
        document.getElementById('tx-notes').value = tx.notes || '';
    } else {
        document.getElementById('modal-tx-title').textContent = 'Tambah Transaksi Baru';
        document.getElementById('tx-id').value = '';
        document.getElementById('tx-date').value = new Date().toISOString().slice(0, 10);
    }
    openModal('modal-transaction');
}

function handleTransactionSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('tx-id').value;
    const payload = {
        id: id || 'tx-' + Date.now(),
        name: document.getElementById('tx-name').value.trim(),
        categoryId: document.getElementById('tx-category').value,
        amount: Number(document.getElementById('tx-amount').value),
        date: document.getElementById('tx-date').value,
        status: document.getElementById('tx-status').value,
        source: document.getElementById('tx-source').value,
        notes: document.getElementById('tx-notes').value.trim()
    };

    if (id) {
        const idx = appState.transactions.findIndex(t => t.id === id);
        if (idx !== -1) appState.transactions[idx] = payload;
        showToast('Transaksi berhasil diperbarui');
    } else {
        appState.transactions.push(payload);
        showToast('Transaksi baru berhasil dicatat');
    }

    saveState();
    closeModal('modal-transaction');
    renderAll();
}

function confirmDeleteTransaction(txId) {
    openConfirmDialog(
        'Hapus Transaksi?',
        'Catatan transaksi ini akan dihapus secara permanen dari anggaran.',
        () => {
            appState.transactions = appState.transactions.filter(t => t.id !== txId);
            saveState();
            renderAll();
            showToast('Transaksi telah dihapus');
        }
    );
}

// 2. Edit Category Budget Modal Handlers
function openEditBudgetModal(catId) {
    const cat = appState.categories.find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('edit-cat-id').value = cat.id;
    document.getElementById('edit-cat-name').textContent = cat.name;
    document.getElementById('edit-cat-amount').value = cat.planned;
    openModal('modal-edit-budget');
}

function handleEditBudgetSubmit(e) {
    e.preventDefault();
    const catId = document.getElementById('edit-cat-id').value;
    const amount = Number(document.getElementById('edit-cat-amount').value);
    const cat = appState.categories.find(c => c.id === catId);
    if (cat) {
        cat.planned = amount;
        saveState();
        renderAll();
        showToast(`Budget "${cat.name}" diperbarui`);
    }
    closeModal('modal-edit-budget');
}

// 3. Savings Deposit & Goal Handlers
function handleDepositSubmit(e) {
    e.preventDefault();
    const depositor = document.querySelector('input[name="depositor"]:checked').value;
    const amount = Number(document.getElementById('dep-amount').value);
    const date = document.getElementById('dep-date').value;
    const note = document.getElementById('dep-note').value.trim();

    appState.savings.deposits.push({
        id: 'dep-' + Date.now(),
        depositor,
        amount,
        date,
        note
    });

    saveState();
    document.getElementById('dep-amount').value = '';
    document.getElementById('dep-note').value = '';
    renderAll();
    showToast('Setoran tabungan berhasil dicatat!');
}

function confirmDeleteDeposit(depId) {
    openConfirmDialog(
        'Hapus Riwayat Setoran?',
        'Saldo tabungan bersama akan disesuaikan kembali setelah setoran dihapus.',
        () => {
            appState.savings.deposits = appState.savings.deposits.filter(d => d.id !== depId);
            saveState();
            renderAll();
            showToast('Riwayat setoran dihapus');
        }
    );
}

function openSavingsGoalModal() {
    document.getElementById('input-savings-target').value = appState.savings.target;
    document.getElementById('input-monthly-target').value = appState.savings.monthlyTarget;
    openModal('modal-savings-goal');
}

function handleSavingsGoalSubmit(e) {
    e.preventDefault();
    appState.savings.target = Number(document.getElementById('input-savings-target').value);
    appState.savings.monthlyTarget = Number(document.getElementById('input-monthly-target').value);
    saveState();
    closeModal('modal-savings-goal');
    renderAll();
    showToast('Target tabungan berhasil diperbarui');
}

// 4. Settings Modal & Data Reset Handlers
function openSettingsModal() {
    document.getElementById('set-p1-name').value = appState.settings.partner1;
    document.getElementById('set-p2-name').value = appState.settings.partner2;
    document.getElementById('set-wedding-date').value = appState.settings.weddingDate;
    document.getElementById('set-location').value = appState.settings.location || '';
    openModal('modal-settings');
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    appState.settings.partner1 = document.getElementById('set-p1-name').value.trim() || 'Saya';
    appState.settings.partner2 = document.getElementById('set-p2-name').value.trim() || 'Pasangan';
    appState.settings.weddingDate = document.getElementById('set-wedding-date').value;
    appState.settings.location = document.getElementById('set-location').value.trim();

    saveState();
    closeModal('modal-settings');
    renderAll();
    showToast('Pengaturan pernikahan disimpan');
}

function resetToDummyData() {
    closeModal('modal-settings');
    openConfirmDialog(
        'Muat Data Contoh?',
        'Data saat ini akan diganti dengan contoh anggaran pernikahan Naya & Arka.',
        () => {
            appState = getInitialDummyData();
            saveState();
            renderAll();
            showToast('Data contoh berhasil dimuat');
        }
    );
}

function clearAllData() {
    closeModal('modal-settings');
    openConfirmDialog(
        'Kosongkan Semua Data?',
        'Semua nominal anggaran, transaksi, dan tabungan akan direset menjadi 0.',
        () => {
            appState.categories.forEach(c => c.planned = 0);
            appState.transactions = [];
            appState.savings.deposits = [];
            appState.savings.target = 100000000;
            appState.savings.monthlyTarget = 5000000;
            saveState();
            renderAll();
            showToast('Semua data berhasil dikosongkan');
        }
    );
}

// 5. Custom Modal Confirm Dialog
function openConfirmDialog(title, message, onConfirm) {
    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    const yesBtn = document.getElementById('confirm-yes-btn');
    yesBtn.onclick = () => {
        closeModal('modal-confirm');
        onConfirm();
    };
    openModal('modal-confirm');
}

// ==========================================================================
// 7. INITIALIZATION (DOM READY)
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // Set tanggal hari ini di formulir setoran tabungan
    const depDateInput = document.getElementById('dep-date');
    if (depDateInput) {
        depDateInput.value = new Date().toISOString().slice(0, 10);
    }

    // Tampilkan Dashboard sebagai tab default
    switchTab('dashboard');

    // Update timer hitung mundur setiap 30 detik
    setInterval(updateCountdownTimer, 30000);

    // Inisialisasi ikon Lucide
    if (window.lucide) {
        lucide.createIcons();
    }
});

