"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getPosts, createPost, updatePost, deletePost,
  createNotificationsForAllUsers,
  Post, PostType,
} from "@/lib/firestore";
import { format } from "date-fns";

const POST_TYPES: { value: PostType; label: string; color: string }[] = [
  { value: "blog",     label: "Blog",       color: "bg-blue-100 text-blue-700" },
  { value: "note",     label: "Note",       color: "bg-yellow-100 text-yellow-700" },
  { value: "quote",    label: "Quote",      color: "bg-purple-100 text-purple-700" },
  { value: "exercise", label: "Exercise",   color: "bg-green-100 text-green-700" },
  { value: "banner",   label: "Banner",     color: "bg-orange-100 text-orange-700" },
  { value: "camp",     label: "Camp/Event", color: "bg-red-100 text-red-700" },
];

const EMPTY_FORM = { title: "", content: "", type: "note" as PostType, imageUrl: "" };
const MAX_BYTES = 700_000; // ~700KB to stay safely under Firestore 1MB doc limit

// Compress image to a base64 data URL under MAX_BYTES
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let quality = 0.85;
      let width = img.width;
      let height = img.height;

      const canvas = document.createElement("canvas");
      const tryEncode = () => {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        const byteSize = Math.round((dataUrl.length * 3) / 4);
        if (byteSize <= MAX_BYTES || quality < 0.2) {
          resolve(dataUrl);
        } else if (quality > 0.3) {
          quality -= 0.1;
          tryEncode();
        } else {
          // Reduce dimensions
          width = Math.round(width * 0.8);
          height = Math.round(height * 0.8);
          quality = 0.7;
          tryEncode();
        }
      };
      tryEncode();
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

export default function DoctorPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts]           = useState<Post[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editId, setEditId]         = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [compressing, setCompressing]   = useState(false);
  const [error, setError]           = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    try { setPosts(await getPosts()); }
    finally { setLoading(false); }
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressing(true);
    setError("");
    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
      setForm((f) => ({ ...f, imageUrl: compressed }));
    } catch {
      setError("Failed to process image. Try a different file.");
    } finally {
      setCompressing(false);
    }
  }

  function openEdit(post: Post) {
    setEditId(post.id!);
    setForm({
      title:    post.title,
      content:  post.content,
      type:     post.type,
      imageUrl: post.imageUrl || "",
    });
    setImagePreview(post.imageUrl || "");
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImagePreview("");
    setEditId(null);
    setShowForm(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      if (editId) {
        await updatePost(editId, {
          title:    form.title.trim(),
          content:  form.content.trim(),
          type:     form.type,
          imageUrl: form.imageUrl.trim() || undefined,
        });
        setSuccessMsg("Post updated successfully!");
      } else {
        const ref = await createPost({
          title:      form.title.trim(),
          content:    form.content.trim(),
          type:       form.type,
          imageUrl:   form.imageUrl.trim() || undefined,
          authorName: user?.displayName || user?.email || "Dr. Nivedita",
        });
        await createNotificationsForAllUsers(ref.id, form.title.trim(), form.type);
        setSuccessMsg("Post published and users notified!");
      }
      resetForm();
      setTimeout(() => setSuccessMsg(""), 3000);
      await fetchPosts();
    } catch (err) {
      setError("Error: " + (err instanceof Error ? err.message : JSON.stringify(err)));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    await fetchPosts();
  }

  const typeInfo = (type: PostType) => POST_TYPES.find((t) => t.value === type);

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Doctor&apos;s Updates</h1>
          <p className="text-slate-500 text-sm mt-1">Share posts, notes, quotes, exercises & events with your patients.</p>
        </div>
        <button
          onClick={() => { if (showForm && !editId) { resetForm(); } else { setShowForm(!showForm); setEditId(null); setError(""); } }}
          className="btn-primary text-sm px-4 py-2"
        >
          {showForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-sm p-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {showForm && (
        <div className="card mb-8">
          <h2 className="font-display text-lg font-semibold text-slate-900 mb-4">
            {editId ? "Edit Post" : "New Post"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Post Type</label>
              <div className="flex flex-wrap gap-2">
                {POST_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      form.type === t.value
                        ? t.color + " ring-2 ring-offset-1 ring-primary-400"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Post title..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Content</label>
              <textarea
                required
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Write your post content here..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Image (optional)</label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={compressing}
                    className="text-xs px-3 py-2 border border-slate-300 rounded-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    {compressing ? "⏳ Compressing..." : "📁 Upload from Device"}
                  </button>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(""); setForm((f) => ({ ...f, imageUrl: "" })); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove image
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />
                <input
                  value={imagePreview ? "" : form.imageUrl}
                  onChange={(e) => { setForm((f) => ({ ...f, imageUrl: e.target.value })); setImagePreview(""); }}
                  className="w-full border border-slate-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Or paste image URL: https://..."
                  disabled={!!imagePreview}
                />
                {/* Full natural size preview */}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full rounded-sm border border-slate-200"
                  />
                )}
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || compressing}
                className="btn-primary text-sm px-5 py-2 disabled:opacity-60"
              >
                {submitting ? (editId ? "Saving..." : "Publishing...") : (editId ? "Save Changes" : "Publish & Notify")}
              </button>
              <button type="button" onClick={resetForm} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card text-center py-16 text-slate-400">
          <p className="text-sm">No posts yet. Create your first post above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const t = typeInfo(post.type);
            const date = post.createdAt
              ? format((post.createdAt as unknown as { toDate: () => Date }).toDate(), "dd MMM yyyy, hh:mm a")
              : "";
            return (
              <div key={post.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t?.color}`}>
                        {t?.label}
                      </span>
                      <span className="text-xs text-slate-400">{date}</span>
                    </div>
                    <h3 className="font-display font-semibold text-slate-900">{post.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-3">{post.content}</p>
                    {/* Full width natural size image */}
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full rounded-sm mt-3 border border-slate-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(post)}
                      className="text-slate-400 hover:text-primary-600 transition-colors"
                      title="Edit post"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id!)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete post"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}