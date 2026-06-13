"use client";

import { useEffect, useState } from "react";
import { getPosts, Post, PostType } from "@/lib/firestore";
import { format } from "date-fns";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

const POST_TYPES: { value: PostType; label: string; color: string; bg: string }[] = [
  { value: "blog",     label: "Blog",       color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  { value: "note",     label: "Note",       color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  { value: "quote",    label: "Quote",      color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  { value: "exercise", label: "Exercise",   color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  { value: "banner",   label: "Banner",     color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  { value: "camp",     label: "Camp/Event", color: "text-red-700",    bg: "bg-red-50 border-red-200" },
];

export default function UpdatesPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostType | "all">("all");

  useEffect(() => {
    getPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.type === filter);
  const typeInfo = (type: PostType) => POST_TYPES.find((t) => t.value === type);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-10">
            <h1 className="font-display text-4xl font-semibold text-slate-900">Updates from Doctor</h1>
            <p className="text-slate-500 mt-2 text-sm">
              Latest posts, tips, exercises, and events from Dr. Nivedita Shashikant Pingale (PT).
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              All
            </button>
            {POST_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilter(t.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === t.value
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p>No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((post) => {
                const t = typeInfo(post.type);
                const date = post.createdAt
                  ? format((post.createdAt as unknown as { toDate: () => Date }).toDate(), "dd MMMM yyyy")
                  : "";
                return (
                  <article key={post.id} className={`rounded-sm border p-6 ${t?.bg}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold uppercase tracking-wide ${t?.color}`}>
                        {t?.label}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{date}</span>
                    </div>
                    <h2 className={`font-display text-xl font-semibold mb-2 ${t?.color}`}>
                      {post.title}
                    </h2>
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full rounded-sm mb-4"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                    <p className="mt-4 text-xs text-slate-400">— {post.authorName}</p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}