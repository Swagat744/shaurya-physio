import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";

export const metadata = {
  title: "Services | Shaurya Physiotherapy Clinic",
};

const categories = [
  {
    title: "Musculoskeletal Physiotherapy",
    conditions: [
      "Joint pains, sprains and strains",
      "Myalgias",
      "Osteoarthritis",
      "Spinal conditions and dysfunctions",
      "Postural syndromes",
      "Radiculopathies",
      "Whiplash injuries",
      "Post-operative orthopaedic rehabilitation",
    ],
  },
  {
    title: "Neuro Physiotherapy",
    conditions: [
      "Stroke rehabilitation",
      "Parkinson's disease and MSA",
      "Facial nerve palsy",
      "Neuralgias",
      "Spinal cord injuries",
      "Post brain or neurosurgery rehabilitation",
    ],
  },
  {
    title: "Sports Rehabilitation",
    conditions: [
      "Tendinopathies",
      "Tennis elbow and Golfer's elbow",
      "Meniscal injuries",
      "Ligament injuries",
      "Post arthroscopy rehabilitation",
    ],
  },
  {
    title: "Cardiac and Pulmonary Rehabilitation",
    conditions: [
      "COPD",
      "Cystic fibrosis",
      "RLD and ILD",
      "Post-COVID rehabilitation",
      "Post CABG",
      "Pre and post cardiac surgery rehabilitation",
      "Heart failure management",
    ],
  },
  {
    title: "Paediatric Physiotherapy",
    conditions: [
      "Cerebral palsy",
      "Developmental delay",
    ],
  },
  {
    title: "Women's Health",
    conditions: [
      "Pre-natal physiotherapy care",
      "Post-natal physiotherapy care",
      "Pelvic floor strengthening",
      "Stress urinary incontinence",
    ],
  },
  {
    title: "Special Therapies",
    conditions: [
      "Dry needling (Western acupuncture)",
      "Cupping therapy (Hijama)",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label text-primary-300">What We Offer</span>
            <div className="divider" />
            <h1 className="font-display text-5xl font-semibold text-white">
              Our Services
            </h1>
            <p className="mt-4 text-slate-300 max-w-xl leading-relaxed font-sans font-light">
              Comprehensive physiotherapy across seven clinical specialities, delivered
              through evidence-based protocols and personalised treatment plans.
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <div key={cat.title} className="card hover:shadow-md transition-shadow duration-200">
                  <div className="w-8 h-0.5 bg-primary-500 mb-4" />
                  <h2 className="font-display text-2xl font-semibold text-slate-900 mb-5">
                    {cat.title}
                  </h2>
                  <ul className="space-y-2">
                    {cat.conditions.map((c) => (
                      <li key={c} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0 mt-1.5" />
                        <span className="text-sm text-slate-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-primary-50 border-t border-primary-100">
          <div className="max-w-xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-semibold text-slate-900">
              Not sure which service you need?
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Book a consultation and Dr. Nivedita will assess your condition and recommend
              the most appropriate treatment approach.
            </p>
            <div className="mt-6">
              <Link href="/book" className="btn-primary">
                Book a Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
