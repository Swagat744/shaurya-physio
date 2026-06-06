import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              Shaurya Physiotherapy Clinic
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Expert physiotherapy, rehabilitation, and sports medicine services
              delivered with precision and care.
            </p>
            <p className="text-xs text-slate-500">
              Dr. Nivedita Shashikant Pingale (PT)
              <br />
              BPTH, MPT, Certified Nutritionist
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Doctor" },
                { href: "/services", label: "Services" },
                { href: "/book", label: "Book Appointment" },
                { href: "/contact", label: "Contact" },
                { href: "/login", label: "Staff Login" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 tracking-wide uppercase">
              Contact
            </h4>
            <address className="not-italic text-sm space-y-2 leading-relaxed">
              <p>
                Patil Complex, Shop No-5,
                <br />
                Sector-9, Khanda Colony,
                <br />
                New Panvel (West), 410206
              </p>
              <p>
                <a
                  href="tel:+919673855138"
                  className="hover:text-primary-400 transition-colors"
                >
                  +91 96738 55138
                </a>
              </p>
              <p className="text-slate-500 text-xs">Timings: 5:00 PM to 9:00 PM</p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Shaurya Physiotherapy Clinic. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Designed for professional medical use
          </p>
        </div>
      </div>
    </footer>
  );
}
