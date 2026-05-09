import { getPosts } from "@/utils/posts";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";

// Server component: loads posts once and shares them with the menu lists.
export async function LeftMenu() {
  const posts = await getPosts();

  return (
    <div className="p-4 text-sm">

      {/* Title */}
      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Full Stack Blog
      </div>

      <nav className="flex flex-col gap-6">

        {/* Categories*/}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Categories
          </h2>
          <ul className="flex flex-col gap-3">
            <CategoryList posts={posts} />
          </ul> 
        </div>

        {/* History */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            History
          </h2>
          <ul className="flex flex-col gap-3">
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </ul>
        </div>

        {/* Tags */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Tags
          </h2>
          <ul className="flex flex-col gap-3">
            <TagList selectedTag="" posts={posts} />
          </ul>
        </div>

      </nav>
    </div>
  );
}
