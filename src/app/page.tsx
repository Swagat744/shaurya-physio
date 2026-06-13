"use client";

import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { useEffect, useState } from "react";
import { getClinicSettings, ClinicTimings } from "@/lib/firestore";

const clinicImages = [
  "/img1.jpeg",
  "/img2.jpeg",
  "/img3.jpeg",
  "/img4.jpeg",
  "/img5.jpeg",
  "/img6.jpeg",
];

const DEFAULT_TIMINGS: ClinicTimings = {
  monday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  tuesday:   "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  wednesday: "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  thursday:  "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  friday:    "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM",
  saturday:  "9:00 AM – 2:00 PM",
  sunday:    "Closed",
};

const services = [
  {
    title: "Musculoskeletal Physiotherapy",
    desc: "Comprehensive care for joint pains, spinal conditions, postural syndromes, and post-operative orthopaedic rehabilitation.",
  },
  {
    title: "Neuro Physiotherapy",
    desc: "Specialised rehabilitation for stroke, Parkinson's disease, facial nerve palsy, and spinal cord injuries.",
  },
  {
    title: "Sports Rehabilitation",
    desc: "Evidence-based treatment for tendinopathies, ligament injuries, and post-arthroscopy recovery.",
  },
  {
    title: "Cardiac and Pulmonary Rehab",
    desc: "Targeted rehabilitation for COPD, post-COVID recovery, post-CABG, and heart failure management.",
  },
  {
    title: "Women's Health",
    desc: "Specialised physiotherapy for pre and post-natal care, pelvic floor strengthening, and urinary incontinence.",
  },
  {
    title: "Paediatric Physiotherapy",
    desc: "Gentle, effective therapy for children with cerebral palsy and developmental delays.",
  },
];

export default function HomePage() {
  const [timings, setTimings] = useState<ClinicTimings>(DEFAULT_TIMINGS);

  useEffect(() => {
    getClinicSettings().then((s) => {
      if (s?.timings) setTimings(s.timings);
    }).catch(() => {});
  }, []);

  // Single timing to display — use Monday's or first non-closed day
  const displayTiming = Object.values(timings).find((v) => v !== "Closed") ?? "Check contact page";

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-primary-900 to-slate-800 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary-500 opacity-10 blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-2xl">
              <span className="section-label text-primary-300 fade-up">
                New Panvel, Navi Mumbai
              </span>
              <h1 className="mt-4 font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight fade-up fade-up-1">
                Restore Movement.
                <br />
                <em className="italic text-primary-300">Rebuild Life.</em>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed font-sans font-light fade-up fade-up-2">
                Shaurya Physiotherapy Clinic provides evidence-based physiotherapy and
                rehabilitation under the expertise of Dr. Nivedita Shashikant Pingale (PT),
                MPT — Cardiovascular and Respiratory Physiotherapy.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 fade-up fade-up-3">
                <Link href="/book" className="btn-primary">
                  Book Appointment
                </Link>
                <Link
                  href="/about"
                  className="border border-white/30 text-white px-6 py-3 rounded-sm font-medium text-sm tracking-wide hover:bg-white/10 transition-colors duration-200 inline-flex items-center gap-2"
                >
                  About the Doctor
                </Link>
              </div>

              {/* Clinic timings chip — dynamic */}
              <div className="mt-10 inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-sm px-4 py-3 fade-up fade-up-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-sm text-white font-medium">Clinic Hours: {displayTiming}</span>
                <span className="text-slate-400 text-xs hidden sm:block">|</span>
                <span className="text-slate-300 text-xs hidden sm:block">+91 96738 55138</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="bg-primary-700 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "8+", label: "Years of Practice" },
              { num: "6", label: "Specialisation Areas" },
              { num: "2", label: "Hospital Tenures" },
              { num: "100+", label: "Conditions Treated" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-semibold">{s.num}</p>
                <p className="text-primary-200 text-xs mt-1 tracking-wide font-sans">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

            {/* Clinic Gallery */}
        <section className="py-10 bg-slate-50 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
            <span className="section-label">
              Clinic Gallery
            </span>

            <div className="divider mx-auto" />

            <h2 className="section-title">
              Modern Care Environment
            </h2>
          </div>

          <div className="relative">
            <div className="flex gallery-track">
              {[...clinicImages, ...clinicImages].map((img, index) => (
                <div
                  key={index}
                  className="gallery-item flex-shrink-0 w-[420px] h-[260px] mx-4 rounded-2xl overflow-hidden bg-white">
                  <img
                      src={img}
                      alt={`Clinic ${index}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                </div>
              ))}
            </div>
          </div>
      </section>
        {/* Introduction */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-label">Welcome</span>
                <div className="divider" />
                <h2 className="section-title">
                  Precision Physiotherapy,
                  <br />
                  Personalised Recovery
                </h2>
                <p className="mt-6 text-slate-600 leading-relaxed">
                  At Shaurya Physiotherapy Clinic, we believe in restoring optimal function
                  through scientifically driven, patient-centred care. Every treatment plan
                  is tailored to the individual, combining advanced manual therapy techniques
                  with progressive rehabilitation protocols.
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Headed by Dr. Nivedita Shashikant Pingale — a Certified Mulligan
                  Practitioner and internationally accredited Sports and Nutritional Coach
                  — our clinic integrates the best of contemporary physiotherapy practice.
                </p>
                <div className="mt-8 flex gap-4">
                  <Link href="/services" className="btn-primary">Our Services</Link>
                  <Link href="/contact" className="btn-outline">Get Directions</Link>
                </div>
              </div>

              {/* Info cards */}
              <div className="space-y-4">
                <div className="card border-l-4 border-l-primary-500">
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Clinic Location</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Patil Complex, Shop No-5, Sector-9,
                    <br />
                    Khanda Colony, New Panvel (West), 410206
                  </p>
                </div>
                <div className="card border-l-4 border-l-primary-400">
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Consultation Hours</h3>
                  <p className="text-sm font-medium text-primary-700">{displayTiming}</p>
                </div>
                <div className="card border-l-4 border-l-primary-300">
                  <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Contact</h3>
                  <a href="tel:+919673855138" className="text-sm text-primary-700 font-medium hover:text-primary-800">
                    +91 96738 55138
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctor Highlight */}
        <section className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card max-w-3xl mx-auto border-none shadow-md">
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-display text-3xl font-semibold text-primary-700">N</span>
                </div>
                <div>
                  <span className="section-label">Meet the Doctor</span>
                  <h2 className="mt-1 font-display text-2xl font-semibold text-slate-900">
                    Dr. Nivedita Shashikant Pingale (PT)
                  </h2>
                  <p className="text-sm text-primary-600 font-medium mt-1 font-sans">
                    BPTH, MPT — Cardiovascular and Respiratory Physiotherapy
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5 font-sans">
                    Certified Nutritionist · Certified Mulligan Practitioner
                  </p>
                  <p className="mt-4 text-slate-600 leading-relaxed text-sm">
                    With over eight years of clinical experience across Apollo Hospital Navi Mumbai
                    and Saifee Hospital, Dr. Nivedita brings a unique combination of expertise in
                    cardiorespiratory physiotherapy, sports rehabilitation, and nutritional science
                    to every patient interaction.
                  </p>
                  <div className="mt-6">
                    <Link href="/about" className="btn-primary text-xs px-5 py-2">Full Profile</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="section-label">What We Treat</span>
              <div className="divider mx-auto" />
              <h2 className="section-title">Comprehensive Care Across Specialities</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.title} className="card hover:border-primary-200 hover:shadow-md transition-all duration-200 group">
                  <div className="w-8 h-0.5 bg-primary-500 mb-4" />
                  <h3 className="font-display text-lg font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/services" className="btn-outline">View All Services</Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-700">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-semibold text-white">Begin Your Recovery Today</h2>
            <p className="mt-4 text-primary-200 text-base leading-relaxed">
              Schedule a consultation with Dr. Nivedita Pingale and take the first step
              toward pain-free movement.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book" className="bg-white text-primary-700 px-8 py-3 rounded-sm font-medium text-sm tracking-wide hover:bg-primary-50 transition-colors duration-200">
                Book Appointment
              </Link>
              <Link href="/contact" className="border border-primary-300 text-white px-8 py-3 rounded-sm font-medium text-sm tracking-wide hover:bg-primary-800 transition-colors duration-200">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}