import * as React from "react";
import {
  Sidebar,
  SidebarContent,
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
          url: "/manage-projects",
        },
        {
          title: "Manage Experiences",
          url: "/manage-experiences",
        },
        {
          title: "Manage Blogs",
          url: "/manage-blogs",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarRail />
    </Sidebar>
  );
}
