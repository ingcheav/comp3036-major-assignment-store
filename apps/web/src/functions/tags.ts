// import { posts, type Post } from "../components/data";

export async function tags(posts: { tags: string; active: boolean }[]) {
  // TODO: Implement per specification
  
  {/* 7. "return tags with count" */}
  {/* 7. filter only active posts */}
  const activePosts = posts.filter(post => post.active);

  {/* 7. map to store tag counts */}
  const map = new Map<string, number>();

  activePosts.forEach(post => {
    
    {/* 7. split ["A", "B"] */}
    const tagList = post.tags.split(",");

    tagList.forEach (tag => {
      
      {/* 7. increase count if exists, otherwise start from 1 */}
      map.set(tag, (map.get(tag) || 0) + 1);
    });
  });

  {/* 7. convert map to array format */}
  return Array.from(map.entries()).map(([name, count]) => ({
    name,
    count,
  }));
}
