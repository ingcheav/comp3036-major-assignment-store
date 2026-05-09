"use client";

import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useEffect, useState } from "react";

type AdminListScreenProps = {
  posts: Post[];
};

type SortOption = "title-asc" | "title-desc" | "date-asc" | "date-desc";

const activeStorageKey = "admin-post-active-state";

// Formats post dates for display in the admin list.
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

// Converts a DDMMYYYY filter value into a Date object for comparison.
function parseDateFilter(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 8) {
    return null;
  }

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4)) - 1;
  const year = Number(digits.slice(4, 8));
  const parsed = new Date(year, month, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

// Client component: filters, sorts, and toggles visibility for admin posts.
export function ListScreen({ posts }: AdminListScreenProps) {
 
  const [saveMessage, setSaveMessage] = useState("");

  // state for filters (content, tag, date)
  const [contentFilter, setContentFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // state for sorting option
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // state for active/inactive posts
  const [activeStates, setActiveStates] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(posts.map((post) => [post.id, post.active])),
  );

  // state for visibility filter (all, active, inactive)
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "active" | "inactive">("all");

  // state for status message
  const [activeMessagePostId, setActiveMessagePostId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"active" | "inactive" | "">("");

  // load active/inactive state from localStorage
  useEffect(() => {
    const storedState = window.localStorage.getItem(activeStorageKey);

    if (!storedState) {
      return;
    }

    try {
      const parsedState = JSON.parse(storedState) as Record<string, boolean>;
      setActiveStates((currentState) => {
        const nextState = { ...currentState };

        for (const [postId, isActive] of Object.entries(parsedState)) {
          nextState[Number(postId)] = isActive;
        }

        return nextState;
      });
    } catch {
      window.localStorage.removeItem(activeStorageKey);
    }
  }, []);

  useEffect(() => {
    const message = window.sessionStorage.getItem("admin-post-save-message");

    if (message) {
      setSaveMessage(message);
      window.sessionStorage.removeItem("admin-post-save-message");
    }
  }, []);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = setTimeout(() => setSaveMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [saveMessage]);

  // normalize filters with case-insensitive matching
  const normalizedContentFilter = contentFilter.trim().toLowerCase();
  const normalizedTagFilter = tagFilter.trim().toLowerCase();
  const normalizedDateFilter = dateFilter.trim().toLowerCase();

  // split content into words and check if any word starts with the filter term
  const contentFilterWords = normalizedContentFilter.length > 0
    ? normalizedContentFilter.split(/\s+/)
    : null;

  // A post matches when each search term starts at least one word in the text.
  function matchesWords(text: string) {
    if (!contentFilterWords) return true;
    const words = text.toLowerCase().split(/\W+/);
    return contentFilterWords.every((term) =>
      words.some((word) => word.startsWith(term))
    );
  }

  // parse date input from filter (used for date filtering test)
  const parsedDateFilter = parseDateFilter(dateFilter);

  const filteredPosts = posts
  .filter((post) => {
    const content = post.content.toLowerCase().replace(/\s+/g, " ");
    const title = post.title.toLowerCase();
    const tags = post.tags.toLowerCase();

    // filter posts by content
    const matchesContent =
      contentFilterWords === null ||
      matchesWords(post.title) ||
      matchesWords(post.content);

    // filter posts by tag
    const matchesTag =
      normalizedTagFilter.length === 0 ||
      tags.includes(normalizedTagFilter);

    // filter posts by date
    const matchesDate =
      normalizedDateFilter.length === 0 ||
      (parsedDateFilter
        ? post.date >= parsedDateFilter
        : [
            formatDate(post.date).toLowerCase(),
            post.date.toISOString().slice(0, 10).toLowerCase(),
            `${String(post.date.getDate()).padStart(2, "0")}${String(
              post.date.getMonth() + 1,
            ).padStart(2, "0")}${post.date.getFullYear()}`,
          ].some((value) => value.includes(normalizedDateFilter)));

    // filter posts by visibility (active/inactive)
    const matchesVisibility =
      visibilityFilter === "all" ||
      (visibilityFilter === "active" && activeStates[post.id]) ||
      (visibilityFilter === "inactive" && !activeStates[post.id]);

    // combine filters - post must match all filters
    return (
      matchesContent &&
      matchesTag &&
      matchesDate &&
      matchesVisibility
    );
  })

  // sort items - title or date (both ascending and descending)
  .sort((leftPost, rightPost) => {
    if (sortBy === "title-asc") {
      return leftPost.title.localeCompare(rightPost.title);
    }

    if (sortBy === "title-desc") {
      return rightPost.title.localeCompare(leftPost.title);
    }

    if (sortBy === "date-asc") {
      return leftPost.date.getTime() - rightPost.date.getTime();
    }

    return rightPost.date.getTime() - leftPost.date.getTime();
  });

  // toggle active/inactive state, save to localStorage and persist to database
  async function toggleActive(postId: number, urlId: string) {
    const wasActive = activeStates[postId];
    const nextActive = !wasActive;

    setActiveStates((currentState) => {
      const nextState = { ...currentState, [postId]: nextActive };
      window.localStorage.setItem(activeStorageKey, JSON.stringify(nextState));
      return nextState;
    });

    setActiveMessagePostId(postId);

    if (wasActive) {
      setStatusMessage("Post set to inactive");
      setStatusType("inactive");
    } else {
      setStatusMessage("Post set to active");
      setStatusType("active");
    }

    // clear message after 3 seconds
    setTimeout(() => {
      setActiveMessagePostId(null);
      setStatusMessage("");
      setStatusType("");
    }, 3000);

    // persist to database
    // PATCH tells the API route to update only this post's active field.
    await fetch(`/api/posts/${urlId}`, {
      method: "PATCH",
      body: JSON.stringify({ active: nextActive }),
      headers: { "Content-Type": "application/json" },
    });
  }

  return (
    <section aria-label="Admin list screen" className="space-y-6">
      {/* filter by content */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-wrap gap-4 items-end border border-gray-200">
        <div className="flex flex-col gap-1">
        <label htmlFor="content-filter" className="text-sm font-medium text-gray-700">Filter by Content:</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          id="content-filter"
          placeholder="Search title or content..."
          value={contentFilter}
          onChange={(event) => setContentFilter(event.target.value)}
        />
        </div>

       {/* filter by tag */}
        <div className="flex flex-col gap-1">
        <label htmlFor="tag-filter" className="text-sm font-medium text-gray-700">Filter by Tag:</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          id="tag-filter"
          placeholder="e.g. React, Dev Tools"
          value={tagFilter}
          onChange={(event) => setTagFilter(event.target.value)}
        />
        </div>

      {/* filter by date */}
        <div className="flex flex-col gap-1">
        <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">Filter by Date Created:</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2"
          id="date-filter"
          placeholder="DDMMYYYY"
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
        />
        </div>

      {/* visibility filter */}
      <div className="flex flex-col gap-1">
        <label htmlFor="visibility-filter" className="text-sm font-medium text-gray-700">
          Filter by Visibility:
        </label>
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          id="visibility-filter"
          value={visibilityFilter}
          onChange={(event) => setVisibilityFilter(event.target.value as "all" | "active" | "inactive")}
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

       {/* sort items */}
        <div className="flex flex-col gap-1">
        <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort By:</label>
        <select
          className="border border-gray-300 rounded-md px-2 py-1"
          id="sort-by"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
        >
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
          <option value="date-asc">Date (Oldest first)</option>
          <option value="date-desc">Date (Newest first)</option>
        </select>
        </div>

      {/* move to create post screen - clicking "create post" goes to the screen */}
      <p className="sm:ml-auto">
        <Link
          href="/posts/create"
          className="inline-flex bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 transition cursor-pointer"
        >
          Create Post
        </Link>
      </p>
      </div>

      {saveMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
          {saveMessage}
        </div>
      )}

      {/* list items -  render all filtered posts as <article> elements.
      Each article must include:
      - title (clickable)
      - image
      - category
      - tags
      - date ("Posted on ...")
      - active/inactive button
      */}

      <ul className="space-y-3">
        {filteredPosts.map((post) => {
          const isActive = activeStates[post.id];
          const tags = post.tags.split(",").map((tag) => tag.trim());

          return (
            <li key={post.id}>
              <article className="bg-white p-4 border border-gray-200 rounded-lg">
                {activeMessagePostId === post.id && statusMessage && (
                  <p className={`mb-2 px-3 py-2 rounded-md border font-medium ${
                    statusType === "active"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : "bg-red-100 text-red-700 border-red-300"
                  }`}>
                    {statusMessage}
                  </p>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover object-center"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      {/* move to detail screen - clickable title go to detail screen */}
                      <Link href={`/post/${post.urlId}`} className="block">
                        <h2 className="font-semibold text-lg text-gray-800">{post.title}</h2>
                      </Link>

                      <p className="text-sm text-gray-600">{post.category}</p>
                      <p className="text-sm text-gray-500">
                        {tags.map((tag, index) => (
                          <span key={tag}>
                            {index > 0 ? ", " : ""}
                            #{tag}
                          </span>
                        ))}
                      </p>
                      <p className="text-sm text-gray-500">Posted on {formatDate(post.date)}</p>
                    </div>
                  </div>

                  <button
                    className={`text-white px-3 py-1 rounded-md self-start transition cursor-pointer ${
                      isActive ? "bg-green-600" : "bg-red-600"
                    }`}
                    type="button"
                    onClick={() => toggleActive(post.id, post.urlId)}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </button>
                </div>

              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
