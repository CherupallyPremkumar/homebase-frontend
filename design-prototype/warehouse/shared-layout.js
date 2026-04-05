/**
 * Shared Warehouse Layout — Header + Sidebar
 * Include in any warehouse page: <script src="shared-layout.js"></script>
 * Then call: renderWarehouseLayout('pageName')
 *
 * This ensures ALL warehouse pages have identical header and sidebar.
 * Change once here → updates everywhere.
 */

function renderWarehouseLayout(activePage) {
  // ===== HEADER =====
  document.getElementById('warehouse-header').innerHTML = `
    <div class="flex items-center justify-between h-full px-6">
      <div class="flex items-center gap-3">
        <a href="warehouse-dashboard.html" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl font-extrabold tracking-tight text-teal-900">Home<span class="text-brand-500">Base</span></span>
            <span class="text-xs font-semibold text-gray-400 tracking-wide uppercase ml-1 border-l border-gray-200 pl-2">WAREHOUSE</span>
          </div>
        </a>
      </div>
      <div class="hidden md:flex flex-1 max-w-lg mx-8">
        <div class="relative w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search inventory, orders, shipments..." class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition" onkeydown="if(event.key==='Enter'){var q=this.value.trim();if(q)alert('Searching for: '+q)}">
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="relative">
          <button onclick="toggleNotifications()" class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
            <span class="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">7</span>
          </button>
          <div id="notifDropdown" class="hidden absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-800">Notifications</span>
              <button onclick="document.querySelectorAll('#notifDropdown .notif-dot').forEach(d=>d.remove());alert('All marked as read')" class="text-xs text-brand-500 hover:text-brand-600 font-medium">Mark all read</button>
            </div>
            <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Inbound shipment arriving</span> - IB-2026-0892</p><p class="text-xs text-gray-400 mt-0.5">10 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Zone B capacity alert</span> - 92% occupied</p><p class="text-xs text-gray-400 mt-0.5">25 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Shipment dispatched</span> - 45 orders picked up</p><p class="text-xs text-gray-400 mt-0.5">1 hour ago</p></div>
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
        <div class="dropdown relative">
          <button class="flex items-center gap-2.5 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-sm font-bold">AK</div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-semibold text-gray-800 leading-tight">Arun Kumar</p>
              <p class="text-[10px] text-gray-400 leading-tight">Warehouse Manager</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </button>
          <div class="dropdown-menu absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <a href="warehouse-dashboard.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              My Profile
            </a>
            <a href="warehouse-dashboard.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Settings
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <a href="../customer/login.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-danger hover:bg-red-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // ===== SIDEBAR =====
  var operationsItems = [
    { id: 'dashboard', label: 'Dashboard', href: 'warehouse-dashboard.html', icon: '<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>' },
    { id: 'inbound', label: 'Inbound', href: 'warehouse-inbound.html', badge: '8', badgeType: 'brand', icon: '<path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>' },
    { id: 'inventory', label: 'Inventory', href: 'warehouse-inventory.html', icon: '<path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>' },
    { id: 'orders', label: 'Orders', href: 'warehouse-orders.html', badge: '45', badgeType: 'warning', icon: '<path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>' },
    { id: 'shipments', label: 'Shipments', href: 'warehouse-shipments.html', icon: '<path d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"/>' },
  ];

  function renderNavItem(item) {
    var isActive = item.id === activePage;
    var cls = isActive
      ? 'sidebar-link active flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-400 text-sm font-medium'
      : 'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 text-sm font-medium hover:text-white';
    var badgeHtml = '';
    if (item.badge) {
      var bgCls = item.badgeType === 'warning' ? 'bg-warning text-teal-900' : 'bg-brand-500 text-white';
      badgeHtml = '<span class="ml-auto ' + bgCls + ' text-[10px] font-bold rounded-full px-2 py-0.5">' + item.badge + '</span>';
    }
    return '<li><a href="' + item.href + '" class="' + cls + '">' +
      '<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' + item.icon + '</svg>' +
      item.label + badgeHtml + '</a></li>';
  }

  var sidebarHtml = '<div class="px-4 pt-5 pb-4">' +
    '<div class="bg-white/5 rounded-xl p-3.5 border border-white/10">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">AK</div>' +
        '<div class="min-w-0"><p class="text-white text-sm font-semibold truncate">Arun Kumar</p>' +
        '<div class="flex items-center gap-1 mt-0.5"><span class="w-1.5 h-1.5 rounded-full bg-green-400"></span><span class="text-[10px] text-green-400 font-medium">Online</span></div></div>' +
      '</div>' +
      '<div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">' +
        '<span class="text-[10px] text-gray-400 uppercase tracking-wider">Role</span>' +
        '<span class="text-xs font-semibold text-brand-400">Warehouse Manager</span>' +
      '</div>' +
      '<div class="mt-2 flex items-center justify-between">' +
        '<span class="text-[10px] text-gray-400 uppercase tracking-wider">Location</span>' +
        '<span class="text-xs font-semibold text-brand-400">Mumbai Hub</span>' +
      '</div>' +
    '</div></div>' +
    '<nav class="flex-1 px-3 pb-4">' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Operations</p>' +
      '<ul class="space-y-0.5">' + operationsItems.map(renderNavItem).join('') + '</ul>' +
    '</nav>' +
    '<div class="px-4 pb-4">' +
      '<div class="bg-white/5 rounded-lg p-3 border border-white/10">' +
        '<div class="flex items-center gap-2 mb-1.5">' +
          '<span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>' +
          '<span class="text-[11px] text-green-400 font-medium">System Online</span>' +
        '</div>' +
        '<p class="text-[10px] text-gray-500">WMS v3.2.1 | Last sync: 2 min ago</p>' +
      '</div>' +
    '</div>';

  document.getElementById('warehouse-sidebar').innerHTML = sidebarHtml;

  // Notification toggle
  window.toggleNotifications = function() {
    var d = document.getElementById('notifDropdown');
    d.classList.toggle('hidden');
  };
  document.addEventListener('click', function(e) {
    var d = document.getElementById('notifDropdown');
    if (d && !d.parentElement.contains(e.target)) d.classList.add('hidden');
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      var d = document.getElementById('notifDropdown');
      if (d) d.classList.add('hidden');
    }
  });
}
