import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Logout from "./modules/authentications/logout";
import { getUserSession } from "@/lib/getUserSession";
import { IUser } from "@/interfaces/user.interfaces";

// This is sample data.
const data = {
  navMain: [
    {
      title: "View Yourself",
      url: "#",
      items: [
        {
          title: "About",
          url: "/about",
        },
        {
          title: "Contact",
          url: "/contacs",
        },
        {
          title: "Blogs",
          url: "/blogs",
        },
        {
          title: "projects",
          url: "/projects",
        },
      ],
    },
    {
      title: "Owner Options",
      url: "#",
      items: [
        {
          title: "Manage Projects",
          url: "/dashboard/manage-projects",
        },
        {
          title: "Manage Experiences",
          url: "/dashboard/manage-experiences",
        },
        {
          title: "Manage Blogs",
          url: "/dashboard/manage-blogs",
        },
      ],
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const token = await getUserSession();
  console.log(token);


    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/getme`,
      {
        method: "GET",
        headers: {
          Authorization: token,
        },
        next: {
          revalidate: 60,
        },
      }
    );
    console.log(response);

    const responseData = await response.json();
    console.log("response:", response);
    console.log("response Data:", responseData);
    const  user:IUser = responseData.data

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href={"/"} className="flex items-center gap-2">
          <h1 className="text-xl dark:text-white/90 md:text-2xl lg:text-[28px] font-semibold">
            Rasel Shikder<span className="text-red-600">.</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Logout user={user} token={token} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
