import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CalendarDays,
  LayoutDashboard,
  Users,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Serviços",
    href: "/services",
    icon: BriefcaseBusiness,
  },
  {
    label: "Usuários",
    href: "/users",
    icon: Users,
  },
  {
    label: "Agendamentos",
    href: "/appointments",
    icon: CalendarDays,
  },
];
