import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // TODO: Implement the summary item
  // must show the number of posts in that category and the name
  // if if is selected it must show in different color/background


    return (
    <li>
      {/* "5. render both selected and non-selected summary item with count" */}
      {/* 5. apply "selected" class ONLY when isSelected is true to handle both tests: 
        + false -> no class (non-selected)
        + true -> "selected" class (selected)
      */}
      
      <Link
      href={link}
      title={title}
      className={`flex justify-between items-center px-3 py-2 rounded-lg ${
        isSelected ? "selected bg-blue-100" : "hover:bg-gray-200"
      }`}
      >
        {/* render categories items */}
        {/*render name*/}
          <span className={isSelected ? "text-blue-600 font-medium" : "text-gray-900 dark:text-white"}>
            {name}
          </span>

        {/* render count */}
        <span data-test-id="post-count" data-testid="post-count" className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      </Link>

    </li>
  );
}
