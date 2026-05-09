import type { PropsWithChildren } from "react";
import { Content } from "../Content";
import { LeftMenu } from "../Menu/LeftMenu";
import { TopMenu } from "./TopMenu";

export async function AppLayout({
  children,
  query,
}: PropsWithChildren<{ query?: string }>) {
  return (
    <div className="flex min-h-screen">

      {/*Left Sidebar*/}
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 min-h-screen"> 
        <LeftMenu />
      </div>

      {/* Right Content */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">

        {/*Top Menu*/}
        <div className="border-b p-4">
          <TopMenu query={query} />
        </div>
        
        {/*Main Content*/}
        <div className="p-6">
          <Content> {children} </Content>
        </div>
      </div>
    </div>
  );
}
