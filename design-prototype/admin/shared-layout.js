/**
 * Shared Admin Layout — Header + Sidebar
 * Include in any admin page: <script src="shared-layout.js"></script>
 * Then call: renderAdminLayout('pageName')
 *
 * This ensures ALL admin pages have identical header and sidebar.
 * Change once here → updates everywhere.
 */

function renderAdminLayout(activePage, basePath) {
  basePath = basePath || '';
  // ===== HEADER =====
  document.getElementById('admin-header').innerHTML = `
    <div class="flex items-center justify-between h-full px-6">
      <div class="flex items-center gap-3">
        <a href="${basePath}dashboard.html" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl font-extrabold tracking-tight text-navy-900">Home<span class="text-brand-500">Base</span></span>
            <span class="text-xs font-semibold text-gray-400 tracking-wide uppercase ml-1 border-l border-gray-200 pl-2">PLATFORM</span>
          </div>
        </a>
      </div>
      <div class="hidden md:flex flex-1 max-w-lg mx-8">
        <div class="relative w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search sellers, orders, users, products..." class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition" onkeydown="if(event.key==='Enter'){var q=this.value.trim();if(q)alert('Searching for: '+q)}">
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <button onclick="toggleNotifications()" class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
            <span class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">9</span>
          </button>
          <div id="notifDropdown" class="hidden absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-800">Notifications</span>
              <button onclick="document.querySelectorAll('#notifDropdown .notif-dot').forEach(d=>d.remove());alert('All marked as read')" class="text-xs text-brand-500 hover:text-brand-600 font-medium">Mark all read</button>
            </div>
            <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">New seller registration</span> - Sharma Electronics</p><p class="text-xs text-gray-400 mt-0.5">8 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Product flagged</span> - Premium LED Panel reported</p><p class="text-xs text-gray-400 mt-0.5">45 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Bulk order placed</span> - #HB-78234 worth ₹1,24,500</p><p class="text-xs text-gray-400 mt-0.5">1 hour ago</p></div>
              </div>
            </div>
            <div class="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
              <button onclick="alert('View all notifications')" class="w-full text-center text-xs font-medium text-brand-500 hover:text-brand-600">View All Notifications</button>
            </div>
          </div>
        </div>
        <button onclick="alert('Help Center')" class="hidden sm:block p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
        </button>
        <div class="hidden sm:block w-px h-8 bg-gray-200"></div>
        <div class="relative" id="profileDropdownWrap">
          <button onclick="toggleProfileMenu()" class="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">SA</div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-semibold text-gray-800 leading-tight">Super Admin</p>
              <p class="text-[10px] text-gray-400 leading-tight">Platform Admin</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </button>
          <div id="profileDropdown" class="hidden absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <a href="${basePath}profile.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              My Profile
            </a>
            <a href="${basePath}settings/index.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Settings
            </a>
            <a href="${basePath}system/audit-log.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Audit Log
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <a href="${basePath}../customer/login.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // ===== SIDEBAR =====
  var homeItems = [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: '<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>' },
  ];

  var catalogItems = [
    { id: 'products', label: 'Products', href: 'products/index.html', icon: '<path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>' },
    { id: 'categories', label: 'Categories', href: 'products/categories.html', icon: '<path d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"/>' },
    { id: 'attributes', label: 'Attributes', href: 'products/attributes.html', icon: '<path d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/><path d="M6 6h.008v.008H6V6z"/>' },
    { id: 'brands', label: 'Brands', href: 'products/brands.html', icon: '<path d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"/>' },
    { id: 'inventory', label: 'Inventory', href: 'products/inventory.html', icon: '<path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>' },
    { id: 'pricing', label: 'Pricing Rules', href: 'products/pricing-rules.html', icon: '<path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
  ];

  var orderItems = [
    { id: 'orders', label: 'All Orders', href: 'orders/index.html', badge: '234', badgeType: 'brand', icon: '<path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>' },
    { id: 'returns', label: 'Returns & Refunds', href: 'orders/returns.html', badge: '47', badgeType: 'warning', icon: '<path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>' },
    { id: 'disputes', label: 'Disputes', href: 'orders/disputes.html', badge: '5', badgeType: 'warning', icon: '<path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>' },
  ];

  var sellerItems = [
    { id: 'sellers', label: 'Manage Sellers', href: 'sellers/index.html', badge: '18', badgeType: 'brand', icon: '<path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.993 2.993 0 00.397-1.599A3 3 0 016 4.5h12a3 3 0 012.603 3.25 2.993 2.993 0 00.397 1.599"/>' },
    { id: 'onboarding', label: 'Onboarding', href: 'sellers/onboarding.html', badge: '4', badgeType: 'brand', icon: '<path d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/>' },
    { id: 'sla', label: 'SLA & Performance', href: 'sellers/sla.html', icon: '<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>' },
    { id: 'payout-calendar', label: 'Payouts', href: 'sellers/payout-calendar.html', icon: '<path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>' },
  ];

  var fulfillmentItems = [
    { id: 'warehouses', label: 'Warehouses / FCs', href: 'warehouse/warehouse-dashboard.html', icon: '<path d="M2.25 21h19.5M3.75 3v18m16.5-18v18M5.25 3h13.5M5.25 21V10.5m0 0h4.5m-4.5 0v-3h4.5v3m0 0v10.5m0-10.5h4.5m-4.5 0v-3h4.5v3m0 0v10.5m0-10.5h3.75"/>' },
    { id: 'shipments', label: 'Shipments', href: 'management/shipping.html', icon: '<path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h2.25m0 0V9.375c0-.621.504-1.125 1.125-1.125h3.026a2.999 2.999 0 012.287 1.059l1.21 1.43a3 3 0 002.287 1.059H17.25c.621 0 1.125.504 1.125 1.125V14.25m-13.5 0h13.5"/>' },
    { id: 'delivery-tracking', label: 'Delivery Tracking', href: 'orders/delivery-tracking.html', icon: '<path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>' },
  ];

  var financeItems = [
    { id: 'finance', label: 'Payments', href: 'finance/index.html', icon: '<path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"/>' },
    { id: 'settlements', label: 'Settlements', href: 'finance/settlements.html', badge: '12', badgeType: 'warning', icon: '<path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>' },
    { id: 'reconciliation', label: 'Reconciliation', href: 'finance/reconciliation.html', icon: '<path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"/>' },
    { id: 'tax', label: 'Tax & GST', href: 'management/tax.html', icon: '<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>' },
  ];

  var marketingItems = [
    { id: 'promotions', label: 'Promotions / Coupons', href: 'promotions/index.html', icon: '<path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>' },
    { id: 'campaigns', label: 'Campaigns', href: 'promotions/campaigns.html', icon: '<path d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/>' },
    { id: 'cms', label: 'Banners / CMS', href: 'cms/index.html', icon: '<path d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"/>' },
  ];

  var customerItems = [
    { id: 'users', label: 'User Management', href: 'users/customers.html', icon: '<path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>' },
    { id: 'segments', label: 'Segments', href: 'analytics/segments.html', icon: '<path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>' },
    { id: 'reviews', label: 'Reviews', href: 'reviews/index.html', badge: '15', badgeType: 'warning', icon: '<path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>' },
  ];

  var analyticsItems = [
    { id: 'analytics', label: 'Business Reports', href: 'analytics/index.html', icon: '<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>' },
    { id: 'abandoned-carts', label: 'Abandoned Carts', href: 'analytics/abandoned-carts.html', icon: '<path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>' },
    { id: 'sessions', label: 'Sessions', href: 'analytics/sessions.html', icon: '<path d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"/>' },
  ];

  var settingsItems = [
    { id: 'settings', label: 'Platform Config', href: 'settings/index.html', icon: '<path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
    { id: 'compliance', label: 'Compliance', href: 'compliance/index.html', badge: '3', badgeType: 'brand', icon: '<path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>' },
    { id: 'notifications', label: 'Notifications', href: 'system/notifications.html', icon: '<path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>' },
    { id: 'audit-log', label: 'Audit Log', href: 'system/audit-log.html', icon: '<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>' },
    { id: 'health', label: 'System Health', href: 'system/health.html', icon: '<path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>' },
  ];

function renderNavItem(item) {
    var isActive = item.id === activePage;
    var cls = isActive
      ? 'sidebar-link active flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-400 text-sm font-medium'
      : 'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 text-sm font-medium hover:text-white';
    var badgeHtml = '';
    if (item.badge) {
      var bgCls = item.badgeType === 'warning' ? 'bg-yellow-500 text-gray-900' : 'bg-brand-500 text-white';
      badgeHtml = '<span class="ml-auto ' + bgCls + ' text-[10px] font-bold rounded-full px-2 py-0.5">' + item.badge + '</span>';
    }
    return '<li><a href="' + basePath + item.href + '" class="' + cls + '">' +
      '<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' + item.icon + '</svg>' +
      item.label + badgeHtml + '</a></li>';
  }

  var sidebarHtml = '<div class="px-4 pt-5 pb-4">' +
    '<div class="bg-white/5 rounded-xl p-3.5 border border-white/10">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold shrink-0">SA</div>' +
        '<div class="min-w-0"><p class="text-white text-sm font-semibold truncate">Super Admin</p>' +
        '<div class="flex items-center gap-1 mt-0.5"><span class="w-1.5 h-1.5 rounded-full bg-green-400"></span><span class="text-[10px] text-green-400 font-medium">Online</span></div></div>' +
      '</div>' +
      '<div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">' +
        '<span class="text-[10px] text-gray-400 uppercase tracking-wider">Role</span>' +
        '<span class="text-xs font-semibold text-brand-400">Platform Admin</span>' +
      '</div>' +
    '</div></div>' +
    '<nav class="flex-1 px-3 pb-4 sidebar-scroll" style="overflow-y:auto">' +
      '<ul class="space-y-0.5">' + homeItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Catalog</p>' +
      '<ul class="space-y-0.5">' + catalogItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Orders</p>' +
      '<ul class="space-y-0.5">' + orderItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Sellers</p>' +
      '<ul class="space-y-0.5">' + sellerItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Fulfillment &amp; Logistics</p>' +
      '<ul class="space-y-0.5">' + fulfillmentItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Finance</p>' +
      '<ul class="space-y-0.5">' + financeItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Marketing</p>' +
      '<ul class="space-y-0.5">' + marketingItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Customers</p>' +
      '<ul class="space-y-0.5">' + customerItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Analytics</p>' +
      '<ul class="space-y-0.5">' + analyticsItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2">Settings</p>' +
      '<ul class="space-y-0.5">' + settingsItems.map(renderNavItem).join('') + '</ul>' +
                '</nav>' +
    '<div class="px-4 pb-4"><div class="bg-white/5 rounded-lg p-3 border border-white/10 text-center">' +
      '<p class="text-[10px] text-gray-500 uppercase tracking-wider mb-1">System Status</p>' +
      '<div class="flex items-center justify-center gap-1.5">' +
        '<span class="w-2 h-2 rounded-full bg-green-400" style="animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite"></span>' +
        '<span class="text-xs text-green-400 font-semibold">All Systems Operational</span>' +
      '</div></div></div>';

  document.getElementById('admin-sidebar').innerHTML = sidebarHtml;

  // Notification toggle
  window.toggleNotifications = function() {
    var d = document.getElementById('notifDropdown');
    d.classList.toggle('hidden');
    // Close profile dropdown if open
    var p = document.getElementById('profileDropdown');
    if (p) p.classList.add('hidden');
  };

  // Profile menu toggle (click-based, not hover)
  window.toggleProfileMenu = function() {
    var d = document.getElementById('profileDropdown');
    d.classList.toggle('hidden');
    // Close notification dropdown if open
    var n = document.getElementById('notifDropdown');
    if (n) n.classList.add('hidden');
  };

  // Close all dropdowns on outside click
  document.addEventListener('click', function(e) {
    var notif = document.getElementById('notifDropdown');
    var notifWrap = notif ? notif.parentElement : null;
    if (notif && notifWrap && !notifWrap.contains(e.target)) notif.classList.add('hidden');

    var profile = document.getElementById('profileDropdown');
    var profileWrap = document.getElementById('profileDropdownWrap');
    if (profile && profileWrap && !profileWrap.contains(e.target)) profile.classList.add('hidden');
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var d = document.getElementById('notifDropdown');
      if (d) d.classList.add('hidden');
      var p = document.getElementById('profileDropdown');
      if (p) p.classList.add('hidden');
    }
  });
}
