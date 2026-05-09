"use client";

import { useEffect, useState } from "react";

type FormData = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialFormData: FormData = {
  title: "",
  category: "",
  description: "",
  content: "",
  imageUrl: "",
  tags: "",
};

// Builds the same URL-friendly id that the API route uses when saving a post.
function createUrlId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Client component: manages the create-post form and sends it to the API.
export function CreateScreen() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Clear success messages after a short delay.
  useEffect(() => {
    if (!isSuccess || !message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [isSuccess, message]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Checks required fields before the form is sent to the server.
  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      nextErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      nextErrors.description = "Description is too long. Maximum is 200 characters";
    }

    if (!formData.content.trim()) {
      nextErrors.content = "Content is required";
    }

    if (!formData.imageUrl.trim()) {
      nextErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        nextErrors.imageUrl = "Image URL must be a valid URL";
      }
    }

    if (!formData.tags.trim()) {
      nextErrors.tags = "Tags are required";
    }

    return nextErrors;
  };

  // Submits the form with fetch so the API route can create the post in Prisma.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setIsSuccess(false);
      setMessage("Please fix errors");
      return;
    }

    // POST sends the new post data to the dynamic API route.
    const response = await fetch(`/api/posts/${createUrlId(formData.title)}`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      setIsSuccess(false);
      setMessage("Post could not be saved");
      return;
    }

    setIsSuccess(true);
    setMessage("Post updated successfully");
    sessionStorage.setItem("admin-post-save-message", "Post updated successfully");
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-3xl mx-auto">
        <section className="bg-white rounded-xl shadow-sm p-5 space-y-4 text-gray-800 border border-gray-200">
          <h1 className="text-2xl font-semibold">Create Post</h1>

          {message ? (
            isSuccess ? (
              <div
                className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3"
                data-testid="success-message"
              >
                {message}
              </div>
            ) : (
              <p className="text-red-500 text-sm mt-1">{message}</p>
            )
          ) : null}

          <form
            className="space-y-4"
            data-testid="create-post-form"
            onSubmit={handleSubmit}
          >
            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="title">Title</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title ? <p className="text-red-500 text-sm mt-1">{errors.title}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="category">Category</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="description">Description</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description ? (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              ) : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="content">Content</label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="content"
                name="content"
                rows={6}
                value={formData.content}
                onChange={handleChange}
              />
              {errors.content ? <p className="text-red-500 text-sm mt-1">{errors.content}</p> : null}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="imageUrl">Image URL</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              {errors.imageUrl ? (
                <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
              ) : null}
            </div>

            {formData.imageUrl && (
              <div className="mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-64 max-h-64 object-contain rounded-md border border-gray-200"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium" htmlFor="tags">Tags</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleChange}
              />
              {errors.tags ? <p className="text-red-500 text-sm mt-1">{errors.tags}</p> : null}
            </div>

            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition cursor-pointer"
              type="submit"
            >
              Save
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
