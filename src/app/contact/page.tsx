import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";

export const metadata = {
  title: "Contact | Shaurya Physiotherapy Clinic",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label text-primary-300">Get in Touch</span>
            <div className="divider" />
            <h1 className="font-display text-5xl font-semibold text-white">Contact Us</h1>
            <p className="mt-3 text-slate-300 font-sans font-light">
              Visit us at the clinic or reach out to schedule an appointment.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            {/* Contact details */}
            <div>
              <span className="section-label">Clinic Information</span>
              <div className="divider" />
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
                    Address
                  </h3>
                  <address className="not-italic text-slate-600 text-sm leading-relaxed">
                    Patil Complex, Shop No-5,
                    <br />
                    Sector-9, Khanda Colony,
                    <br />
                    New Panvel (West), 410206
                  </address>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
                    Phone
                  </h3>
                  <a
                    href="tel:+919673855138"
                    className="text-primary-700 font-medium text-sm hover:text-primary-800 transition-colors"
                  >
                    +91 96738 55138
                  </a>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
                    Clinic Timings
                  </h3>
                  <p className="text-sm text-slate-600">Monday to Saturday</p>
                  <p className="text-sm font-semibold text-primary-700 mt-1">5:00 PM – 9:00 PM</p>
                </div>

                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
                    Book an Appointment
                  </h3>
                  <Link href="/book" className="btn-primary inline-flex">
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
                Location Map
              </h3>
              <div className="rounded-sm overflow-hidden border border-slate-200 shadow-sm h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.8!2d73.1!3d18.98!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU4JzQ4LjAiTiA3M8KwMDYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shaurya Physiotherapy Clinic Location"
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Patil Complex, Shop No-5, Sector-9, Khanda Colony, New Panvel (West), 410206
              </p>
              <a
                href="https://www.google.com/maps/search/Patil+Complex+Shop+No+5+Sector+9+Khanda+Colony+New+Panvel+West+410206"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary-700 hover:text-primary-800 underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
