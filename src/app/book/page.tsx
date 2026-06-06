"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { bookAppointment } from "@/lib/firestore";
import { openWhatsAppMessage } from "@/lib/whatsapp";

interface FormData {
  patientName: string;
  phone: string;
  age: number;
  problem: string;
  preferredDate: string;
  preferredTime: string;
}

const timeSlots = [
  "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
];

export default function BookPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await bookAppointment({
        patientName: data.patientName,
        phone: data.phone,
        age: Number(data.age),
        problem: data.problem,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
      });
      setFormData(data);
      setSubmitted(true);
      reset();
    } catch (e) {
      console.error(e);
      setError("Failed to submit your appointment request. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    if (!formData) return;
    openWhatsAppMessage({
      patientName: formData.patientName,
      phone: formData.phone,
      preferredDate: formData.preferredDate,
      preferredTime: formData.preferredTime,
    });
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-slate-50 flex items-center">
          <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-semibold text-slate-900">
              Appointment Received
            </h1>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Thank you, <strong>{formData?.patientName}</strong>. Your appointment request
              for <strong>{formData?.preferredDate}</strong> at{" "}
              <strong>{formData?.preferredTime}</strong> has been received. We will confirm
              your slot shortly.
            </p>
            <div className="mt-4 text-sm text-slate-500">
              For any queries, call us at{" "}
              <a href="tel:+919673855138" className="text-primary-700 font-medium">
                +91 96738 55138
              </a>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleWhatsApp}
                className="bg-green-600 text-white px-6 py-3 rounded-sm text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Send WhatsApp Confirmation
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-outline"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-slate-900 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="section-label text-primary-300">Schedule a Visit</span>
            <div className="divider" />
            <h1 className="font-display text-5xl font-semibold text-white">
              Book an Appointment
            </h1>
            <p className="mt-3 text-slate-300 font-sans font-light">
              Fill in the form below and we will confirm your appointment slot.
            </p>
          </div>
        </section>

        <section className="py-16 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4">
            {/* Info strip */}
            <div className="card mb-8 bg-primary-50 border-primary-200">
              <p className="text-sm text-primary-800 leading-relaxed">
                <strong>Clinic Timings:</strong> 5:00 PM to 9:00 PM &nbsp;|&nbsp;
                <strong>Contact:</strong>{" "}
                <a href="tel:+919673855138" className="underline">+91 96738 55138</a>
                &nbsp;|&nbsp;
                <strong>Location:</strong> Patil Complex, Shop No-5, Sector-9, Khanda Colony,
                New Panvel (West)
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">
                Patient Information
              </h2>

              {/* Name */}
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input-field"
                  placeholder="Enter patient's full name"
                  {...register("patientName", { required: "Full name is required" })}
                />
                {errors.patientName && (
                  <p className="mt-1 text-xs text-red-600">{errors.patientName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="label">Phone Number</label>
                <input
                  className="input-field"
                  placeholder="10-digit mobile number"
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter a valid 10-digit Indian mobile number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="label">Age (years)</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Patient's age"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 1, message: "Age must be at least 1" },
                    max: { value: 120, message: "Please enter a valid age" },
                  })}
                />
                {errors.age && (
                  <p className="mt-1 text-xs text-red-600">{errors.age.message}</p>
                )}
              </div>

              {/* Problem */}
              <div>
                <label className="label">Problem / Chief Complaint</label>
                <textarea
                  className="input-field h-24 resize-none"
                  placeholder="Briefly describe the condition or complaint"
                  {...register("problem", { required: "Please describe your problem" })}
                />
                {errors.problem && (
                  <p className="mt-1 text-xs text-red-600">{errors.problem.message}</p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="label">Preferred Date</label>
                <input
                  className="input-field"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("preferredDate", { required: "Please select a preferred date" })}
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-xs text-red-600">{errors.preferredDate.message}</p>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="label">Preferred Time</label>
                <select
                  className="input-field"
                  {...register("preferredTime", { required: "Please select a preferred time" })}
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.preferredTime && (
                  <p className="mt-1 text-xs text-red-600">{errors.preferredTime.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-sm p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" className="opacity-75" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Appointment Request"
                )}
              </button>

              <p className="text-xs text-slate-500 text-center leading-relaxed">
                Submitting this form sends your request to the clinic. We will contact you to
                confirm your appointment slot.
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
