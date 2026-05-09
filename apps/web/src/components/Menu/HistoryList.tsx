import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";                         

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const historyItems = history(posts);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return(
    
    <ul className="space-y-2">
      {historyItems.map((item) => {
        const name = `${months[item.month]}, ${item.year}`;
        const link = `/history/${item.year}/${item.month}`;

        const isSelected =
        selectedYear === String(item.year) && 
        selectedMonth === String(item.month);
        
        return (
          <SummaryItem
            key={`${item.year}-${item.month}`}
            name={name}
            link={link} 
            count={item.count}
            isSelected={isSelected}
            title={`History / ${name}`}
            />
        );
      })}
    </ul>
  );
}
