"use client";
// src/app/admin/products/page.tsx
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; description: string; price: number; stock: number;
  category: Category; imageUrl: string | null;
}

const empty = { name: "", description: "", price: "", stock: "", imageUrl: "", categoryId: "" };

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user.role !== "ADMIN") { router.push("/"); return; }
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, [status, session, router]);

  async function saveProduct() {
    setSaving(true);
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products/${editId}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const saved = await res.json();
    if (editId) {
      setProducts((prev) => prev.map((p) => (p.id === editId ? saved : p)));
    } else {
      setProducts((prev) => [saved, ...prev]);
    }
    setForm(empty);
    setEditId(null);
    setSaving(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name, description: p.description ?? "", price: String(p.price),
      stock: String(p.stock), imageUrl: p.imageUrl ?? "", categoryId: p.category.id,
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Products</h1>

      {/* Form */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold mb-4">{editId ? "Edit Product" : "Add New Product"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["name", "description", "price", "stock", "imageUrl"] as const).map((field) => (
            <div key={field} className={field === "description" ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input className="input" value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="input" value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={saveProduct} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editId ? "Update" : "Add Product"}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(empty); }} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {["Name", "Category", "Price", "Stock", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50" data-testid="admin-product-row">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category.name}</td>
                <td className="px-4 py-3">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(p)} className="text-[#1167b1] hover:underline text-xs">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
