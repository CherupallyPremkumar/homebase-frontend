import Link from 'next/link';

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products', href: '/products' },
    { label: 'Categories', href: '/categories' },
    { label: 'Deals', href: '/products?sort=discount_desc' },
  ],
  Account: [
    { label: 'My Orders', href: '/orders' },
    { label: 'My Profile', href: '/profile' },
    { label: 'Wishlist', href: '/profile#wishlist' },
  ],
  Support: [
    { label: 'Help Center', href: '/support' },
    { label: 'Returns', href: '/returns' },
    { label: 'Contact Us', href: '/support/new' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="hidden border-t bg-gray-50 md:block">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-900">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-8 border-t pt-8 text-center text-xs text-gray-400">
          <span>Secure Payments</span>
          <span>Easy Returns</span>
          <span>Free Shipping over ₹499</span>
          <span>24/7 Support</span>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} HomeBase. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
