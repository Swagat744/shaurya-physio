"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { getNotificationsForUser, markAllNotificationsRead, markNotificationRead, Notification } from "@/lib/firestore";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Doctor" },
  { href: "/services", label: "Services" },
  { href: "/updates", label: "Updates" },
  { href: "/book", label: "Book Appointment" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) { setNotifications([]); return; }
    getNotificationsForUser(user.uid).then(setNotifications).catch(() => {});
  }, [user]);

  // Close notifs dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleMarkAllRead() {
    if (!user) return;
    await markAllNotificationsRead(user.uid);
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  }

  async function handleNotifClick(notif: Notification) {
    if (!notif.read && notif.id) {
      await markNotificationRead(notif.id);
      setNotifications((n) => n.map((x) => x.id === notif.id ? { ...x, read: true } : x));
    }
    setShowNotifs(false);
    router.push("/updates");
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-primary-700 tracking-wide">
              Shaurya
            </span>
            <span className="text-[10px] font-sans font-medium text-slate-500 tracking-[0.15em] uppercase">
              Physiotherapy Clinic
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link text-sm font-medium transition-colors duration-200",
                  pathname === link.href
                    ? "text-primary-700 active"
                    : "text-slate-600 hover:text-primary-700"
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                {/* Bell icon */}
                <div className="relative" ref={notifsRef}>
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="relative p-1.5 text-slate-500 hover:text-primary-700 transition-colors"
                    aria-label="Notifications"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-sm shadow-lg border border-slate-200 z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <span className="text-sm font-semibold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:underline">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">No notifications yet.</p>
                        ) : (
                          notifications.slice(0, 15).map((n) => (
                            <button
                              key={n.id}
                              onClick={() => handleNotifClick(n)}
                              className={cn(
                                "w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors",
                                !n.read && "bg-primary-50/60"
                              )}
                            >
                              <p className="text-xs font-medium text-slate-800 truncate">{n.postTitle}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{n.postType}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar + role */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                  </div>
                  {role === "doctor" && (
                    <Link href="/dashboard" className="text-xs text-primary-700 font-medium hover:underline">
                      Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-xs px-4 py-2">
                Login
              </Link>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-600"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span className={cn("block h-0.5 w-6 bg-current transition-transform duration-200", open && "translate-y-2 rotate-45")} />
              <span className={cn("block h-0.5 w-6 bg-current transition-opacity duration-200", open && "opacity-0")} />
              <span className={cn("block h-0.5 w-6 bg-current transition-transform duration-200", open && "-translate-y-2 -rotate-45")} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-medium rounded-sm transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {role === "doctor" && (
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded-sm">
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => { setOpen(false); handleLogout(); }}
                  className="block w-full text-left px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-sm"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded-sm">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
