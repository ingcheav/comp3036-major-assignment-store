"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Category { id: string; name: string }

export default function AdminCategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user.role !== "ADMIN") { router.push("/login"); return; }
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, [status, session, router]);

  async function addCategory() {
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const created = await res.json();
    setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setName("");
    setSaving(false);
  }

  async function saveEdit() {
    if (!editId || !editName.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/admin/categories/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });
    const updated = await res.json();
    setCategories((prev) =>
      prev.map((c) => (c.id === editId ? updated : c)).sort((a, b) => a.name.localeCompare(b.name))
    );
    setEditId(null);
    setEditName("");
    setSaving(false);
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category? Products in this category will be affected.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function startEdit(c: Category) {
    setEditId(c.id);
    setEditName(c.name);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Categories</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold mb-4">Add New Category</h2>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }}
          />
          <button onClick={addCategory} disabled={saving || !name.trim()} className="btn-primary">
            {saving ? "Saving…" : "Add Category"}
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50" data-testid="admin-category-row">
                <td className="px-4 py-3 font-medium">
                  {editId === c.id ? (
                    <input
                      className="input py-1"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") { setEditId(null); setEditName(""); } }}
                      autoFocus
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="px-4 py-3 flex gap-2">
                  {editId === c.id ? (
                    <>
                      <button onClick={saveEdit} disabled={saving} className="text-[#1167b1] hover:underline text-xs">Save</button>
                      <button onClick={() => { setEditId(null); setEditName(""); }} className="text-gray-500 hover:underline text-xs">Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(c)} className="text-[#1167b1] hover:underline text-xs">Edit</button>
                      <button onClick={() => deleteCategory(c.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-gray-400">No categories yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
