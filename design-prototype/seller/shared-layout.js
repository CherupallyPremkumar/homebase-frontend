/**
 * Shared Seller Layout — Header + Sidebar
 * Include in any seller page: <script src="shared-layout.js"></script>
 * Then call: renderSellerLayout('pageName')
 *
 * This ensures ALL seller pages have identical header and sidebar.
 * Change once here → updates everywhere.
 */

function renderSellerLayout(activePage) {
  // ===== HEADER =====
  document.getElementById('seller-header').innerHTML = `
    <div class="flex items-center justify-between h-full px-6">
      <div class="flex items-center gap-3">
        <a href="../customer/storefront.html" class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"/></svg>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-xl font-extrabold tracking-tight text-navy-900">Home<span class="text-brand-500">Base</span></span>
            <span class="text-xs font-semibold text-gray-400 tracking-wide uppercase ml-1 border-l border-gray-200 pl-2">SELLER HUB</span>
          </div>
        </a>
      </div>
      <div class="hidden md:flex flex-1 max-w-lg mx-8">
        <div class="relative w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="text" placeholder="Search orders, products, customers..." class="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition" onkeydown="if(event.key==='Enter'){var q=this.value.trim();if(q)alert('Searching for: '+q)}">
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button onclick="alert('Add Product')" class="hidden sm:flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Add Product
        </button>
        <div class="relative">
          <button onclick="toggleNotifications()" class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>
            <span class="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">5</span>
          </button>
          <div id="notifDropdown" class="hidden absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-800">Notifications</span>
              <button onclick="document.querySelectorAll('#notifDropdown .notif-dot').forEach(d=>d.remove());alert('All marked as read')" class="text-xs text-brand-500 hover:text-brand-600 font-medium">Mark all read</button>
            </div>
            <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">New order received</span> - #HB-45231</p><p class="text-xs text-gray-400 mt-0.5">5 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Low stock alert</span> - 5 items below threshold</p><p class="text-xs text-gray-400 mt-0.5">30 minutes ago</p></div>
                <span class="notif-dot w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-2"></span>
              </div>
              <div class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg></div>
                <div class="flex-1 min-w-0"><p class="text-sm text-gray-700"><span class="font-semibold">Settlement processed</span> - ₹24,500 credited</p><p class="text-xs text-gray-400 mt-0.5">2 hours ago</p></div>
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
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold">RS</div>
            <div class="hidden sm:block text-left">
              <p class="text-sm font-semibold text-gray-800 leading-tight">Rajesh Store</p>
              <p class="text-[10px] text-gray-400 leading-tight">Premium Seller</p>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
          </button>
          <div class="dropdown-menu absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <a href="seller-profile.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
              My Profile
            </a>
            <a href="seller-store-settings.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.993 2.993 0 00.397-1.599A3 3 0 016 4.5h12a3 3 0 012.603 3.25 2.993 2.993 0 00.397 1.599"/></svg>
              Store Settings
            </a>
            <a href="seller-payments.html" class="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/></svg>
              Payments
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
  var mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', href: 'seller-dashboard.html', icon: '<path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>' },
    { id: 'products', label: 'Products', href: 'seller-products.html', icon: '<path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/>' },
    { id: 'add-product', label: 'Add Product', href: 'seller-add-product.html', icon: '<path d="M12 4.5v15m7.5-7.5h-15"/>' },
    { id: 'orders', label: 'Orders', href: 'seller-orders.html', badge: '12', badgeType: 'brand', icon: '<path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/>' },
    { id: 'returns', label: 'Returns', href: 'seller-returns.html', badge: '8', badgeType: 'warning', icon: '<path d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>' },
    { id: 'inventory', label: 'Inventory', href: 'seller-inventory.html', badge: '5', badgeType: 'danger', icon: '<path d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3"/>' },
    { id: 'performance', label: 'Performance', href: 'seller-performance.html', icon: '<path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>' },
    { id: 'reviews', label: 'Reviews', href: 'seller-reviews.html', badge: '12', badgeType: 'brand', icon: '<path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>' },
    { id: 'coupons', label: 'Coupons', href: 'seller-coupons.html', icon: '<path d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/>' },
  ];

  var financeItems = [
    { id: 'earnings', label: 'Earnings', href: 'seller-earnings.html', icon: '<path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>' },
    { id: 'settlements', label: 'Settlements', href: 'seller-settlements.html', icon: '<path d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"/>' },
  ];

  var supportItems = [
    { id: 'notifications', label: 'Notifications', href: 'seller-notifications.html', badge: '5', badgeType: 'danger', icon: '<path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>' },
    { id: 'messages', label: 'Messages', href: 'seller-messages.html', badge: '5', badgeType: 'brand', icon: '<path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>' },
    { id: 'support', label: 'Support', href: 'seller-support.html', badge: '2', badgeType: 'warning', icon: '<path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>' },
    { id: 'documents', label: 'Documents', href: 'seller-documents.html', icon: '<path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/>' },
    { id: 'settings', label: 'Settings', href: 'seller-store-settings.html', icon: '<path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
  ];

  function renderNavItem(item) {
    var isActive = item.id === activePage;
    var cls = isActive
      ? 'sidebar-link active flex items-center gap-3 px-3 py-2.5 rounded-lg text-brand-400 text-sm font-medium'
      : 'sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 text-sm font-medium hover:text-white';
    var badgeHtml = '';
    if (item.badge) {
      var bgCls = item.badgeType === 'warning' ? 'bg-warning text-navy-900' : item.badgeType === 'danger' ? 'bg-danger text-white' : 'bg-brand-500 text-white';
      badgeHtml = '<span class="ml-auto ' + bgCls + ' text-[10px] font-bold rounded-full px-2 py-0.5">' + item.badge + '</span>';
    }
    return '<li><a href="' + item.href + '" class="' + cls + '">' +
      '<svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">' + item.icon + '</svg>' +
      item.label + badgeHtml + '</a></li>';
  }

  var sidebarHtml = '<div class="px-4 pt-5 pb-4">' +
    '<div class="bg-white/5 rounded-xl p-3.5 border border-white/10">' +
      '<div class="flex items-center gap-3">' +
        '<div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0">RS</div>' +
        '<div class="min-w-0"><p class="text-white text-sm font-semibold truncate">Rajesh Store</p>' +
        '<div class="flex items-center gap-1 mt-0.5"><span class="w-1.5 h-1.5 rounded-full bg-green-400"></span><span class="text-[10px] text-green-400 font-medium">Active</span></div></div>' +
      '</div>' +
      '<div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">' +
        '<span class="text-[10px] text-gray-400 uppercase tracking-wider">Seller Score</span>' +
        '<div class="flex items-center gap-1">' +
          '<span class="text-sm font-bold text-brand-400">4.6</span>' +
          '<svg class="w-3.5 h-3.5 text-brand-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>' +
        '</div>' +
      '</div>' +
    '</div></div>' +
    '<nav class="flex-1 px-3 pb-4">' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Main Menu</p>' +
      '<ul class="space-y-0.5">' + mainMenuItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-6">Finance</p>' +
      '<ul class="space-y-0.5">' + financeItems.map(renderNavItem).join('') + '</ul>' +
      '<p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2 mt-6">Support</p>' +
      '<ul class="space-y-0.5">' + supportItems.map(renderNavItem).join('') + '</ul>' +
    '</nav>' +
    '<div class="p-4 border-t border-white/10">' +
      '<a href="../customer/storefront.html" class="flex items-center gap-2 text-gray-500 text-xs hover:text-gray-300 transition">' +
        '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349m-18 0a2.993 2.993 0 00.397-1.599A3 3 0 016 4.5h12a3 3 0 012.603 3.25 2.993 2.993 0 00.397 1.599"/></svg>' +
        'View My Storefront' +
      '</a>' +
    '</div>';

  document.getElementById('seller-sidebar').innerHTML = sidebarHtml;

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
