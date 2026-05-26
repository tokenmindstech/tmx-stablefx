"use client";

import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
};

function NavItemCollapsed({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }, []);

  React.useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  if (!item.items?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          className="hover:bg-[#FFF5FC] hover:text-[#FF4FD8] data-[active=true]:bg-[#FFF5FC] data-[active=true]:text-[#FF4FD8]"
        >
          <item.icon className="size-4" />
          <span className="font-medium">{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <SidebarMenuItem
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <SidebarMenuButton
            onClick={() => setOpen(!open)}
            className="hover:bg-[#FFF5FC] hover:text-[#FF4FD8] data-[active=true]:bg-[#FFF5FC] data-[active=true]:text-[#FF4FD8]"
          >
            <item.icon className="size-4" />
            <span className="font-medium">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </PopoverAnchor>
      <PopoverContent
        side="right"
        align="start"
        sideOffset={8}
        className="w-48 p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {item.title}
        </div>
        <div className="h-px bg-border my-1" />
        {item.items.map((subItem) => (
          <a
            key={subItem.title}
            href={subItem.url}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-[#FFF5FC] hover:text-[#FF4FD8] transition-colors"
          >
            {subItem.icon && (
              <subItem.icon className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            <span>{subItem.title}</span>
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function NavMain({ items }: { items: NavItem[] }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Platform
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          if (isCollapsed) {
            return <NavItemCollapsed key={item.title} item={item} />;
          }

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="hover:bg-[#FFF5FC] hover:text-[#FF4FD8] data-[active=true]:bg-[#FFF5FC] data-[active=true]:text-[#FF4FD8]">
                    <item.icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items?.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90 hover:bg-[#FFF5FC] hover:text-[#FF4FD8]">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              className="hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                            >
                              <a
                                href={subItem.url}
                                className="flex items-center gap-2"
                              >
                                {subItem.icon && (
                                  <subItem.icon className="size-3.5 text-muted-foreground" />
                                )}
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
