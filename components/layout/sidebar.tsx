"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Video, LogOut, Sun, Moon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logo from '../../public/logo/logo.png'
import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useDashboard } from "@/components/layout/DashboardWrapper";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Create Video", href: "/create-video", icon: Plus },
  { name: "All Video", href: "/all-videos", icon: Video },
];

export default function Sidebar() {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useDashboard();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeNav, setActiveNav] = useState(pathname);
  const { theme, toggleTheme } = useTheme();

  // Sync activeNav with pathname changes
  React.useEffect(() => {
    setActiveNav(pathname);
  }, [pathname]);

  const handleLogout = () => {
    setShowLogoutModal(false);
    // Add your logout logic here
    console.log("User logged out");
  };

  return (
    <>
    {/* Mobile Overlay */}
    {isMobileMenuOpen && (
      <div 
        className="fixed inset-0 z-60 bg-black/50 md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside 
      className={cn(
        "shrink-0 flex-col rounded-lg z-40 transition-transform duration-300 sticky",
        "md:flex w-[280px] md:w-64 lg:w-72",
        isMobileMenuOpen ? "flex translate-x-0 fixed" : "-translate-x-full md:translate-x-0 fixed md:sticky"
      )}
      style={{ 
        top: '10px',
        height: 'calc(100vh - 20px)',
        backgroundColor: theme === "dark" ? '#272727' : '#FFFFFF', 
        border: theme === "dark" ? '1px solid #5E5E5E' : '1px solid #E5E7EB',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none',
        left: 0,
        overflowY: 'auto'
      }}
    >
      {/* Sidebar Container */}
      <div className="flex flex-col h-full px-5 py-5">
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: theme === "dark" ? '#3F3F46' : '#E4E4E7',
            color: theme === "dark" ? "#FAFAFA" : "#000000"
          }}
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Logo */}
        <div className="mb-6 md:mb-8 flex justify-center">
          <div className="flex items-center justify-center">
           <Image src={logo} alt="Logo" width={100} height={100} className="md:w-[110px] md:h-[110px] lg:w-[120px] lg:h-[120px]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-8">
          {navigation.map((item) => {
            const isActive = activeNav === item.href;
            const Icon = item.icon;
            return (
              <div key={item.name} className="flex justify-center">
                <Link href={item.href} onClick={() => {
                  setActiveNav(item.href);
                  setIsMobileMenuOpen(false);
                }}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="justify-start text-sm md:text-base font-medium"
                    style={{
                      backgroundColor: isActive ? "#3B82F6" : "transparent",
                      color: isActive ? "#FFFFFF" : (theme === "dark" ? "#D4D4D8" : "#3F3F46"),
                      border: isActive ? "none" : "1px solid #5E5E5E",
                      width: "240px",
                      height: "48px",
                      borderRadius: "8px",
                      padding: "12px",
                      gap: "12px"
                    }}
                  >
                    <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    {item.name}
                  </Button>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          <div className="flex gap-2 justify-center">
          <Button 
            variant="outline" 
            className="flex-1 gap-2 md:gap-3 px-3 md:px-4 py-3 md:py-5 text-sm md:text-base font-medium"
            style={{
              borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
              color: theme === "dark" ? "#D4D4D8" : "#3F3F46",
              backgroundColor: "transparent"
            }}
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5" style={{ color: '#E33629', width: '24px', height: '24px' }} />
            Logout
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="shrink-0 aspect-square py-3 md:py-5"
            style={{
              borderColor: theme === "dark" ? "#3F3F46" : "#D4D4D8",
              color: theme === "dark" ? "#D4D4D8" : "#3F3F46",
              backgroundColor: "transparent",
              width: "auto",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem"
            }}
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Moon className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </div>
      </div>
      </div>
    </aside>

    {/* Logout Confirmation Modal - Rendered outside sidebar */}
    {showLogoutModal && (
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 p-4"
        onClick={() => setShowLogoutModal(false)}
      >
        <div 
          className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="mb-4 text-center text-lg font-semibold text-zinc-50">
            Are you sure you want to logout?
          </h3>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#3B82F6] hover:bg-[#3B82F6]/90"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
