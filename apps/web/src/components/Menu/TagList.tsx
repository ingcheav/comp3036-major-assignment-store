import { type Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { tags } from "../../functions/tags";
import { SummaryItem } from "./SummaryItem";     

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
}) {
  const postTags = await tags(posts);

  {/* Render tag items */}
  return (
    <>
      {postTags.map((tag) => {
        const link = `/tags/${toUrlPath(tag.name)}`;
        const isSelected = selectedTag === tag.name;

        return (
          <SummaryItem
            key={tag.name}
            name={tag.name}
            link={link}
            count={tag.count}
            isSelected={isSelected}
            title={`Tag / ${tag.name}`}
          />
        );
      })}
    </>
  );
}
