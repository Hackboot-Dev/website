// /workspaces/website/apps/web/app/[locale]/admin/layout.tsx
// Description: Admin panel layout with dedicated header (no site header/footer)
// Last modified: 2025-12-10

'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/50">
        <div className="px-6 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-8">
              {/* Logo / Back to site */}
              <Link
                href={`/${locale}`}
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors group"
              >
                <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-zinc-950" />
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">VMCloud</span>
                    <span className="text-zinc-500 text-xs ml-2">Admin</span>
                  </div>
                </div>
              </Link>

              {/* Separator */}
              <div className="w-px h-8 bg-zinc-800 hidden md:block" />

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Dashboard */}
                <Link
                  href={`/${locale}/admin`}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium
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
                    flex items-center gap-2 px-4 py-2 text-sm font-medium
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
                    flex items-center gap-2 px-4 py-2 text-sm font-medium
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
                      flex items-center gap-2 px-4 py-2 text-sm font-medium
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
                  {pnlDropdownOpen && (
                    <div className="absolute top-full left-0 pt-1 w-48 z-50">
                      <div className="bg-zinc-900 border border-zinc-800 shadow-xl">
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
                    </div>
                  )}
                </div>

                {/* Settings */}
                <Link
                  href={`/${locale}/admin/settings`}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-sm font-medium
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
            </div>

            {/* Right: User + Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-white font-medium">{user.name}</div>
                <div className="text-xs text-zinc-500">{user.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-zinc-800/50 px-4 py-2">
          <nav className="flex items-center gap-1 overflow-x-auto">
            {/* Dashboard */}
            <Link
              href={`/${locale}/admin`}
              className={`
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap
                transition-all duration-200
                ${pathname === `/${locale}/admin`
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }
              `}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Link>

            {/* Clients */}
            <Link
              href={`/${locale}/admin/clients`}
              className={`
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap
                transition-all duration-200
                ${pathname.includes('/admin/clients')
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }
              `}
            >
              <Users className="h-3.5 w-3.5" />
              Clients
            </Link>

            {/* Catalogue */}
            <Link
              href={`/${locale}/admin/catalogue`}
              className={`
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap
                transition-all duration-200
                ${pathname.includes('/admin/catalogue')
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }
              `}
            >
              <Package className="h-3.5 w-3.5" />
              Catalogue
            </Link>

            {/* P&L Companies */}
            {pnlCompanies.map((company) => (
              <Link
                key={company.id}
                href={`/${locale}${company.href}`}
                className={`
                  flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap
                  transition-all duration-200
                  ${pathname.includes(company.href)
                    ? 'bg-white text-zinc-950'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }
                `}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                P&L {company.label}
              </Link>
            ))}

            {/* Settings */}
            <Link
              href={`/${locale}/admin/settings`}
              className={`
                flex items-center gap-2 px-3 py-1.5 text-xs font-medium whitespace-nowrap
                transition-all duration-200
                ${pathname.includes('/admin/settings')
                  ? 'bg-white text-zinc-950'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }
              `}
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-16 min-h-screen">
        <div className="px-6 lg:px-12 xl:px-16 py-8">
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
