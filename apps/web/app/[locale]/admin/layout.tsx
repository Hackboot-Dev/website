// /workspaces/website/apps/web/app/[locale]/admin/layout.tsx
// Description: Admin panel layout with dedicated header and mobile bottom nav
// Last modified: 2025-12-14

'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Shield,
  LogOut,
  Loader2,
  ChevronLeft,
  ChevronDown,
  Users,
  Package,
  Menu,
  X,
} from 'lucide-react';

type AdminUser = {
  id: string;
  username: string;
  name: string;
  role: string;
};

type AdminLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
  },
];

const pnlCompanies = [
  { id: 'hackboot', label: 'Hackboot', href: '/admin/pnl/hackboot' },
  { id: 'vmcloud', label: 'VMCloud', href: '/admin/pnl/vmcloud' },
];

export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [pnlDropdownOpen, setPnlDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale } = params;

  const isLoginPage = pathname.includes('/admin/login');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session');
        const data = await response.json();

        if (data.authenticated) {
          setUser(data.user);
        } else if (!isLoginPage) {
          router.push(`/${locale}/admin/login`);
        }
      } catch (error) {
        if (!isLoginPage) {
          router.push(`/${locale}/admin/login`);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [locale, router, isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setUser(null);
      router.push(`/${locale}/admin/login`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    if (href === '/admin') {
      return pathname === fullPath;
    }
    return pathname.startsWith(fullPath);
  };

  // Login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-zinc-500 text-sm tracking-wide">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Bottom navigation items for mobile
  const bottomNavItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/catalogue', label: 'Catalogue', icon: Package },
    { href: '/admin/pnl/hackboot', label: 'P&L', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Admin Header - Compact on mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50 safe-area-top">
        <div className="px-4 md:px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Left: Logo */}
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 md:gap-3 text-zinc-400 hover:text-white transition-colors group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-950" />
                </div>
                <div className="hidden xs:block">
                  <span className="text-white font-medium text-sm">VMCloud</span>
                  <span className="text-zinc-500 text-xs ml-1.5 md:ml-2">Admin</span>
                </div>
              </div>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {/* Dashboard */}
              <Link
                href={`/${locale}/admin`}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${pathname === `/${locale}/admin`
                    ? 'bg-white text-zinc-950'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              {/* Clients */}
              <Link
                href={`/${locale}/admin/clients`}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${pathname.includes('/admin/clients')
                    ? 'bg-white text-zinc-950'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                <Users className="h-4 w-4" />
                Clients
              </Link>

              {/* Catalogue */}
              <Link
                href={`/${locale}/admin/catalogue`}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${pathname.includes('/admin/catalogue')
                    ? 'bg-white text-zinc-950'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                <Package className="h-4 w-4" />
                Catalogue
              </Link>

              {/* P&L Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setPnlDropdownOpen(true)}
                onMouseLeave={() => setPnlDropdownOpen(false)}
              >
                <button
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${pathname.includes('/admin/pnl')
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <TrendingUp className="h-4 w-4" />
                  P&L
                  <ChevronDown className={`h-3 w-3 transition-transform ${pnlDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {pnlDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 pt-1 w-48 z-50"
                    >
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
                        {pnlCompanies.map((company) => (
                          <Link
                            key={company.id}
                            href={`/${locale}${company.href}`}
                            className={`
                              flex items-center gap-3 px-4 py-3 text-sm
                              transition-all duration-200 border-b border-zinc-800/50 last:border-0
                              ${pathname.includes(company.href)
                                ? 'bg-violet-500/10 text-violet-400'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                              }
                            `}
                          >
                            <div className={`w-2 h-2 rounded-full ${pathname.includes(company.href) ? 'bg-violet-500' : 'bg-zinc-600'}`} />
                            {company.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Settings */}
              <Link
                href={`/${locale}/admin/settings`}
                className={`
                  flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
                  transition-all duration-200
                  ${pathname.includes('/admin/settings')
                    ? 'bg-white text-zinc-950'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </nav>

            {/* Right: User + Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* User info - Desktop only */}
              <div className="text-right hidden lg:block">
                <div className="text-sm text-white font-medium">{user.name}</div>
                <div className="text-xs text-zinc-500">{user.role}</div>
              </div>

              {/* Logout - Desktop */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm hidden lg:inline">Déconnexion</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-xl transition-all duration-200 active:scale-95"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-14 bottom-0 w-72 bg-zinc-950 border-l border-zinc-800/50 overflow-y-auto"
            >
              {/* User Card */}
              <div className="p-4 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{user.name}</div>
                    <div className="text-xs text-zinc-500">{user.role}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3 space-y-1">
                <Link
                  href={`/${locale}/admin`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl
                    transition-all duration-200 active:scale-[0.98]
                    ${pathname === `/${locale}/admin`
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-300 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                <Link
                  href={`/${locale}/admin/clients`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl
                    transition-all duration-200 active:scale-[0.98]
                    ${pathname.includes('/admin/clients')
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-300 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <Users className="h-5 w-5" />
                  Clients
                </Link>

                <Link
                  href={`/${locale}/admin/catalogue`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl
                    transition-all duration-200 active:scale-[0.98]
                    ${pathname.includes('/admin/catalogue')
                      ? 'bg-white text-zinc-950'
                      : 'text-zinc-300 hover:bg-zinc-800/50'
                    }
                  `}
                >
                  <Package className="h-5 w-5" />
                  Catalogue
                </Link>

                {/* P&L Section */}
                <div className="pt-2">
                  <div className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-600">
                    P&L par société
                  </div>
                  {pnlCompanies.map((company) => (
                    <Link
                      key={company.id}
                      href={`/${locale}${company.href}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl
                        transition-all duration-200 active:scale-[0.98]
                        ${pathname.includes(company.href)
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'text-zinc-300 hover:bg-zinc-800/50'
                        }
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${pathname.includes(company.href) ? 'bg-violet-500' : 'bg-zinc-600'}`} />
                      {company.label}
                    </Link>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/admin/settings`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl
                      transition-all duration-200 active:scale-[0.98]
                      ${pathname.includes('/admin/settings')
                        ? 'bg-white text-zinc-950'
                        : 'text-zinc-300 hover:bg-zinc-800/50'
                      }
                    `}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                </div>
              </nav>

              {/* Logout Button */}
              <div className="p-3 border-t border-zinc-800/50 mt-auto">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 active:scale-[0.98]"
                >
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - App Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/50 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === `/${locale}${item.href}`
              : pathname.includes(item.href);

            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`
                  flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] rounded-xl
                  transition-all duration-200 active:scale-95
                  ${isActive
                    ? 'text-white'
                    : 'text-zinc-500'
                  }
                `}
              >
                <div className={`
                  p-1.5 rounded-lg transition-colors
                  ${isActive ? 'bg-white/10' : ''}
                `}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* More button for settings on mobile */}
          <Link
            href={`/${locale}/admin/settings`}
            className={`
              flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] rounded-xl
              transition-all duration-200 active:scale-95
              ${pathname.includes('/admin/settings')
                ? 'text-white'
                : 'text-zinc-500'
              }
            `}
          >
            <div className={`
              p-1.5 rounded-lg transition-colors
              ${pathname.includes('/admin/settings') ? 'bg-white/10' : ''}
            `}>
              <Settings className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">Plus</span>
          </Link>
        </div>
      </nav>

      {/* Main Content - Adjusted padding for mobile */}
      <main className="pt-14 md:pt-16 pb-20 md:pb-0 min-h-screen">
        <div className="px-4 md:px-6 lg:px-12 xl:px-16 py-4 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
