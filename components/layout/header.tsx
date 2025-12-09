"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useDashboard } from "@/components/layout/DashboardWrapper";

interface HeaderProps {
  title: string;
  description?: string;
  showCreateButton?: boolean;
  icon?: string;
}

export default function Header({ 
  title, 
  description, 
  showCreateButton = true,
  icon
}: HeaderProps) {
  const { theme } = useTheme();
  const { toggleMobileMenu } = useDashboard();  
  
  return (
    <header 
      className="mb-6 lg:mt-3 sm:mb-5 mt-4 md:mb-6 rounded-lg p-4 sm:p-5 md:p-6"
      style={{
        backgroundColor: theme === "dark" ? "#272727" : "#FFFFFF",
        border: theme === "dark" ? '1px solid #5E5E5E' : '1px solid #E5E7EB',
        boxShadow: theme === "light" ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      <div className="flex items-center justify-between gap-4 sm:gap-5 md:gap-6">
        
        {/* Left: Logo + Text + Description */}
        <div className="flex flex-col">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="flex md:hidden items-center justify-center w-12 h-12 shrink-0 rounded-lg"
              style={{
                border: theme === "dark" ? '1px solid #3F3F46' : '1px solid #E5E7EB'
              }}
            >
              <Menu className="h-6 w-6" style={{ color: theme === "dark" ? "#FAFAFA" : "#000000" }} />
            </button>

            {icon && (
              <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center">
                <Image src={icon} alt="Icon" width={48} height={48} className="w-full h-full object-contain" />
              </div>
            )}

            <h1 
              className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold"
              style={{ color: theme === "dark" ? "#FEFEFE" : "#000000" }}
            >
              {title}
            </h1>
          </div>

          {/* Description */}
          {description && (
            <p 
              className="mt-1 text-xs sm:text-sm md:text-base"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#52525B" }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Right: Create Button */}
        {showCreateButton && (
          <div className="shrink-0 flex items-center">
            <Link href="/create-video">
              <Button 
                className="text-sm md:text-base font-medium whitespace-nowrap"
                style={{
                  height: "46px",
                  borderRadius: "8px",
                  backgroundColor: "#3B82F6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0 1rem"
                }}
              >
                <Plus className="h-5 w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">Create New Video</span>
              </Button>
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
