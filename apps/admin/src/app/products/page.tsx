"use client";
import { useEffect, useRef, useState } from "react";
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
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const editFromUrlDone = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated" && session?.user.role !== "ADMIN") { router.push("/login"); return; }
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, [status, session, router]);

  // Jump to edit mode when navigated from preview page with ?edit=id
  useEffect(() => {
    if (editFromUrlDone.current || products.length === 0) return;
    editFromUrlDone.current = true;
    const params = new URLSearchParams(window.location.search);
    const editParam = params.get("edit");
    if (!editParam) return;
    const p = products.find((prod) => prod.id === editParam);
    if (p) startEdit(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  async function saveProduct() {
    setSaving(true);
    let categoryId = form.categoryId;

    if (form.categoryId === "__new__" && newCategoryInput.trim()) {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryInput.trim() }),
      });
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)));
      categoryId = newCat.id;
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/products/${editId}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, categoryId }),
    });
    const saved = await res.json();
    if (editId) {
      setProducts((prev) => prev.map((p) => (p.id === editId ? saved : p)));
    } else {
      setProducts((prev) => [saved, ...prev]);
    }
    setForm(empty);
    setEditId(null);
    setNewCategoryInput("");
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
    setNewCategoryInput("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8">Manage Products</h1>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold mb-4">{editId ? "Edit Product" : "Add New Product"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(["name", "description", "price", "stock", "imageUrl"] as const).map((field) => (
            <div key={field} className={field === "description" ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field === "imageUrl" ? "Image URL" : field}
              </label>
              <input
                className="input"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
              {field === "imageUrl" && form.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover rounded border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  onLoad={(e) => { (e.target as HTMLImageElement).style.display = "block"; }}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="input"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              <option value="__new__">+ Create new category...</option>
            </select>
            {form.categoryId === "__new__" && (
              <input
                className="input mt-2"
                placeholder="New category name"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={saveProduct} disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editId ? "Update" : "Add Product"}
          </button>
          {editId && (
            <button
              onClick={() => { setEditId(null); setForm(empty); setNewCategoryInput(""); }}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Product Catalog</h2>
        <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
          <button
            data-testid="view-table-btn"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 text-sm ${viewMode === "table" ? "bg-[#1167b1] text-white" : "bg-white text-gray-700"}`}
          >
            Table
          </button>
          <button
            data-testid="view-grid-btn"
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1.5 text-sm ${viewMode === "grid" ? "bg-[#1167b1] text-white" : "bg-white text-gray-700"}`}
          >
            Grid
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="card p-4 flex flex-col" data-testid="admin-product-card">
              <div className="aspect-video bg-gray-100 rounded-md mb-3 overflow-hidden">
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No image</div>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                <span className="text-sm font-semibold text-[#1167b1]">${p.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{p.description || "No description"}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{p.category.name}</span>
                <span data-testid="admin-stock-badge" className={`px-2 py-0.5 rounded-full ${p.stock > 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                </span>
              </div>
              <div className="mt-auto flex gap-2">
                <button onClick={() => startEdit(p)} className="btn-secondary text-xs">Edit</button>
                <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
