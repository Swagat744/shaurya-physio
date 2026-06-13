import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata = {
  title: "About Dr. Nivedita Pingale | Shaurya Physiotherapy Clinic",
};

const qualifications = [
  {
    degree: "Master of Physiotherapy (MPT)",
    institution: "Seth G.S. Medical College and K.E.M Hospital, Mumbai",
    specialisation: "Cardiovascular and Respiratory Physiotherapy",
    year: "2017 – 2020",
    grade: "Grade A",
  },
  {
    degree: "Bachelor of Physiotherapy (BPTH)",
    institution: "Sancheti Institute, Pune",
    specialisation: "",
    year: "2012 – 2017",
    grade: "Grade A",
  },
];

const certifications = [
  "Certified Mulligan Practitioner (2017)",
  "Internationally Accredited Sports and Nutritional Coach",
  "Certified Nutritionist",
];

const experience = [
  {
    role: "Independent Consultant Physiotherapist",
    org: "Private Practice — Shaurya Physiotherapy Clinic",
    period: "2017 – Present",
    desc: "Running an independent consultancy providing comprehensive physiotherapy across musculoskeletal, neurological, cardiac, and sports rehabilitation domains.",
  },
  {
    role: "Consultant Physiotherapist",
    org: "Apollo Hospital, Navi Mumbai",
    period: "Former",
    desc: "Provided specialist physiotherapy services in a multi-speciality hospital environment, managing complex post-operative and critical care rehabilitation cases.",
  },
  {
    role: "Physiotherapist",
    org: "Saifee Hospital, Mumbai",
    period: "4 Years",
    desc: "Delivered inpatient and outpatient physiotherapy services across orthopaedic, neurological, and cardiopulmonary departments.",
  },
];

const specialisations = [
  "Musculoskeletal and Orthopaedic Physiotherapy",
  "Cardiovascular and Respiratory Rehabilitation",
  "Neuro Physiotherapy and Stroke Rehabilitation",
  "Sports Rehabilitation and Injury Management",
  "Paediatric Physiotherapy",
  "Women's Health and Pelvic Floor Rehabilitation",
  "Dry Needling (Western Acupuncture)",
  "Cupping Therapy (Hijama)",
  "Sports Nutrition and Dietary Counselling",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-slate-900 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left Content */}
              <div>
                <span className="section-label text-primary-300">
                  About the Doctor
                </span>

                <div className="divider" />

                <h1 className="font-display text-5xl font-semibold text-white leading-tight">
                  Dr. Nivedita
                  <br />
                  Shashikant Pingale
                </h1>

                <p className="mt-3 text-primary-300 font-sans text-base font-medium">
                  BPTH, MPT — Cardiovascular and Respiratory Physiotherapy
                </p>

                <p className="mt-1 text-slate-400 text-sm font-sans">
                  Certified Nutritionist · Certified Mulligan Practitioner ·
                  Internationally Accredited Sports and Nutritional Coach
                </p>

                <p className="mt-6 text-slate-300 leading-relaxed font-sans font-light">
                  With over eight years of dedicated clinical practice across premier
                  Mumbai hospitals and her own consultancy, Dr. Nivedita Pingale brings
                  exceptional skill, academic excellence, and a patient-first
                  philosophy to every treatment she delivers.
                </p>
              </div>

              {/* Doctor Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-2 border-slate-300 overflow-hidden bg-slate-800">

                  {/* Placeholder Image */}
                  <img
                    src="/doctor_nivedita.jpeg"
                    alt="Dr. Nivedita Pingale"
                    className="w-full h-full object-cover"
                  />

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Core details */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
            <div className="card border-t-4 border-t-primary-500">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
                Clinical Experience
              </h3>
              <p className="text-3xl font-display font-semibold text-primary-700">2017</p>
              <p className="text-sm text-slate-500 mt-1">to Present</p>
              <p className="text-sm text-slate-600 mt-3">
                Over eight years of continuous clinical practice across hospital and independent
                consultancy settings.
              </p>
            </div>
            <div className="card border-t-4 border-t-primary-400">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
                Academic Excellence
              </h3>
              <p className="text-3xl font-display font-semibold text-primary-700">Grade A</p>
              <p className="text-sm text-slate-500 mt-1">Both degrees</p>
              <p className="text-sm text-slate-600 mt-3">
                Distinction-level academic performance at KEM Hospital Mumbai and Sancheti
                Institute Pune.
              </p>
            </div>
            <div className="card border-t-4 border-t-primary-300">
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-4">
                Hospital Tenures
              </h3>
              <p className="text-3xl font-display font-semibold text-primary-700">2</p>
              <p className="text-sm text-slate-500 mt-1">Premier hospitals</p>
              <p className="text-sm text-slate-600 mt-3">
                Apollo Hospital Navi Mumbai and Saifee Hospital Mumbai — both leading multi-speciality
                institutions.
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label">Professional Journey</span>
            <div className="divider" />
            <h2 className="section-title">Work Experience</h2>

            <div className="mt-10 space-y-6">
              {experience.map((exp) => (
                <div key={exp.role} className="card border-l-4 border-l-primary-500 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-slate-900">
                        {exp.role}
                      </h3>
                      <p className="text-primary-700 font-medium text-sm mt-0.5">{exp.org}</p>
                    </div>
                    <span className="text-xs font-mono bg-primary-50 text-primary-700 px-3 py-1.5 rounded-sm self-start flex-shrink-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label">Education</span>
            <div className="divider" />
            <h2 className="section-title">Academic Background</h2>

            <div className="mt-10 grid md:grid-cols-2 gap-6">
              {qualifications.map((q) => (
                <div key={q.degree} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-sm">
                      {q.year}
                    </span>
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-sm">
                      {q.grade}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-slate-900">{q.degree}</h3>
                  <p className="text-sm text-primary-700 font-medium mt-1">{q.institution}</p>
                  {q.specialisation && (
                    <p className="text-sm text-slate-600 mt-1">
                      Specialisation: {q.specialisation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16 bg-primary-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label">Certifications</span>
            <div className="divider" />
            <h2 className="section-title">Professional Credentials</h2>
            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="bg-white border border-primary-200 rounded-sm p-5 shadow-sm"
                >
                  <div className="w-6 h-0.5 bg-primary-500 mb-3" />
                  <p className="text-sm font-medium text-slate-800 leading-snug">{cert}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialisations */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label">Areas of Expertise</span>
            <div className="divider" />
            <h2 className="section-title">Clinical Specialisations</h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {specialisations.map((s) => (
                <div
                  key={s}
                  className="flex items-start gap-3 border border-slate-200 rounded-sm px-4 py-3.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-slate-700">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
