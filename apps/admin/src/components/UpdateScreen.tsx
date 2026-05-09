"use client";

import { useEffect, useRef, useState } from "react";
import type { Post } from "@repo/db/data";

interface UpdateScreenProps {
  post: Post;
}

// Client component: edits an existing post and saves changes through the API.
export function UpdateScreen({ post }: UpdateScreenProps) {
  // form state and validation for updating a post
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    content: post.content,
    imageUrl: post.imageUrl,
    tags: post.tags,
  });

  // state for form validation errors and success message
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [globalError, setGlobalError] = useState("");

  // state to control whether preview mode is active or not (false shows textarea, true shows rendered preview)
  const [isPreview, setIsPreview] = useState(false);

  // ref to content textarea to manage focus and selection when toggling preview mode
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const [selection, setSelection] = useState({
    start: 0,
    end: 0,
  });

  // toggle content preview 
  // save cursor position when switching to preview mode 
  // restore cursor position
  const togglePreview = () => {
    if (!isPreview && contentRef.current) {
      setSelection({
        start: contentRef.current.selectionStart,
        end: contentRef.current.selectionEnd,
      });
    }

    setIsPreview((prev) => !prev);
  };

  // restoring curosor position
  useEffect(() => {
    if (!isPreview && contentRef.current) {
      contentRef.current.focus();
      contentRef.current.setSelectionRange(selection.start, selection.end);
    }
  }, [isPreview, selection.end, selection.start]);

  // Clear the success message after it has been visible briefly.
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  // render content preview with basic markdown support for bold text
  const renderPreviewContent = (content: string) => {
    return content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // validate form data before saving
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // title is required
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    // description is required and must be less than 200 characters
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 200) {
      newErrors.description =
        "Description is too long. Maximum is 200 characters";
    }

    // content is required
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }

    // imageUrl is required and must be a valid URL
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    } else {
      try {
        new URL(formData.imageUrl);
      } catch {
        newErrors.imageUrl = "This is not a valid URL";
      }
    }

    // at least a tag is required
    if (!formData.tags.trim()) {
      newErrors.tags = "At least one tag is required";
    }

    // update error state with validation results
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle form input changes and update form state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle save button click - validate form, save to the API, then reload the list
  const handleSave = async () => {
    const hadValidationErrors = Object.keys(errors).length > 0;

    if (!validateForm()) {
      setSuccessMessage("");
      setGlobalError("Please fix the errors before saving");
      return;
    }

    setGlobalError("");
    setSuccessMessage("");

    if (hadValidationErrors) {
      return;
    }

    // PUT sends the updated form fields to the matching post API route.
    const response = await fetch(`/api/posts/${post.urlId}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      setGlobalError("Post could not be saved");
      return;
    }

    sessionStorage.setItem("admin-post-save-message", "Post updated successfully");
    setSuccessMessage("Post updated successfully");
    window.location.href = "/";
  };

  return (
    // update post form - validation and display success message 
    <div className="bg-white rounded-xl shadow-sm p-5 space-y-4 border border-gray-200">
      <h1 className="text-xl font-semibold mb-4">Edit Post</h1>
      {globalError && <p className="text-red-500 text-sm mt-1">{globalError}</p>}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
          {successMessage}
        </div>
      )}
      <form className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-700">Content</label>
            {/* button between rendering preview and editing content - text change depending on current state*/}
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-3 py-1 text-sm transition cursor-pointer"
              type="button"
              onClick={togglePreview}
            >
              {isPreview ? "Close Preview" : "Preview"}
            </button>
          </div>

          {/* if preview moode is ON show preview content 
              if preview mode is OFF show textarea for editing*/}
          {isPreview ? (

            <div
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-600 min-h-32"
              data-testid="content-preview"
              data-test-id="content-preview"
            >
              {/* display preview content as plain text */}
              {renderPreviewContent(formData.content)}
            </div>

          ) : (
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-32"
              ref={contentRef}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
            />
          )}
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">Image URL</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          {/* image preview */}
          <div className="mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-testid="image-preview"
              data-test-id="image-preview"
              src={formData.imageUrl}
              alt="Preview"
              className="w-64 max-h-64 object-contain rounded-md border border-gray-200"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="tags" className="text-sm font-medium text-gray-700">Tags</label>
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            id="tags"
            name="tags"
            type="text"
            value={formData.tags}
            onChange={handleChange}
          />
          {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
        </div>

        {/* save button - validates form and shows success message if valid */}
        <div className="flex justify-end">
          <button
            className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition cursor-pointer"
            type="button"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

      </form>
    </div>
  );
}
