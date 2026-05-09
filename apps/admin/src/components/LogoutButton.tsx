"use client";

// Client component: calls the logout API and returns to the admin login page.
export function LogoutButton() {
  // DELETE clears the auth cookie on the server.
  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/";
  }

  return (
    <button
      className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md"
      type="button"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
