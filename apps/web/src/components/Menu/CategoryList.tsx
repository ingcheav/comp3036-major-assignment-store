import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";

export function CategoryList({ posts, selectedCategory, }: { posts: Post[]; selectedCategory?: string; }) {
  const groupedCategories = categories(
    posts.map((post) => ({ ...post, active: true })),
  );
  const requiredCategoryNames = ["React", "Node", "Mongo", "DevOps"];
  const requiredCategories = requiredCategoryNames.map((name) => {
    return groupedCategories.find((item) => item.name === name) ?? { name, count: 0 };
  });
  const extraCategories = groupedCategories.filter(
    (item) => !requiredCategoryNames.includes(item.name),
  );
  const categoryItems = [...requiredCategories, ...extraCategories];

  return (
    <>
      {categoryItems.map((item) => (
        <SummaryItem
          key={item.name}
          count={item.count}
          name={item.name}
          isSelected={selectedCategory === item.name }
          link={`/category/${toUrlPath(item.name)}`}
          title={`Category / ${item.name}`}
        />
      ))}
    </>
  );
}
