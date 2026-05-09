import { count } from "console";

export function history(posts: { date: Date; active: boolean }[]) {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts

  {/* 6. "return sorted counts by year and month" */}
  {/* 6. filter only active posts */}
  const activePosts = posts.filter(post => post.active);

  {/* 6. create a map to store count by month and year */}
  const map = new Map<string, { month: number; year: number; count: number }>();

  activePosts.forEach(post => {
    const month = post.date.getMonth() + 1;             {/* 6. getMonth returns 0-11 */}
    const year = post.date.getFullYear();
    
    const key = `${year}-${month}`;                     {/* 6. create a unique key for month and year */}

    {/* 6. if the key already exists, increase count */}
    if (map.has(key)) { 
      map.get(key)!.count += 1;                         {/* 6. key exists, so value is safe to use */} 
    
    {/* 6. if the key does not exist, create a new entry */}
    } else { 
      map.set(key, { month, year, count: 1 });
    } 
  });

  {/* 6. convert map to array */}
  const result = Array.from(map.values());

  {/* 6. sort by year and month in descending order */}
  result.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;                             {/* 6. sort by year */}
    }
    return b.month - a.month;                             {/* 6. sort by month if years are the same */}
  });
  return result;
}