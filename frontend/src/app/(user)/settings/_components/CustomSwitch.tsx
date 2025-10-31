"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Lock, Palette, User, Shield, Eye, EyeOff, Check } from "lucide-react";
import { usePreferencesStore } from "@/zustand/preferencesStore";
import { useState } from "react";

// Custom Switch Component
const CustomSwitch = ({ 
  checked, 
  onCheckedChange, 
  color = "blue",
  size = "default",
  disabled = false 
}: {
  checked: boolean;
  onCheckedChange: () => void;
  color?: "blue" | "purple" | "green" | "orange" | "red";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
}) => {
  const sizeClasses = {
    sm: { switch: "h-5 w-9", thumb: "h-4 w-4", translate: "translate-x-4" },
    default: { switch: "h-6 w-11", thumb: "h-5 w-5", translate: "translate-x-5" },
    lg: { switch: "h-7 w-13", thumb: "h-6 w-6", translate: "translate-x-6" }
  };

  const colorClasses = {
    blue: {
      checked: "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/50",
      focus: "focus:ring-blue-500/50"
    },
    purple: {
      checked: "bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-purple-900/50",
      focus: "focus:ring-purple-500/50"
    },
    green: {
      checked: "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200 dark:shadow-green-900/50",
      focus: "focus:ring-green-500/50"
    },
    orange: {
      checked: "bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200 dark:shadow-orange-900/50",
      focus: "focus:ring-orange-500/50"
    },
    red: {
      checked: "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200 dark:shadow-red-900/50",
      focus: "focus:ring-red-500/50"
    }
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[color];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange()}
      className={`
        relative inline-flex ${currentSize.switch} shrink-0 cursor-pointer rounded-full 
        transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 
        focus:ring-offset-white dark:focus:ring-offset-gray-900
        ${disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "active:scale-95 hover:shadow-lg"
        }
        ${checked 
          ? `${currentColor.checked} ${currentColor.focus}` 
          : `bg-gray-300 dark:bg-gray-600 focus:ring-gray-300/50 hover:bg-gray-400 dark:hover:bg-gray-500`
        }
      `}
    >
      <span className="sr-only">Toggle setting</span>
      
      {/* Switch Track */}
      <span className="absolute inset-0 rounded-full">
        {/* Inner glow effect when checked */}
        <span 
          className={`
            absolute inset-0 rounded-full transition-opacity duration-300
            ${checked ? "opacity-100" : "opacity-0"}
            ${checked ? "bg-gradient-to-r from-white/20 to-transparent" : ""}
          `} 
        />
      </span>
      
      {/* Switch Thumb */}
      <span
        className={`
          pointer-events-none relative inline-block ${currentSize.thumb} transform rounded-full 
          bg-white shadow-lg transition-all duration-300 ease-in-out
          ring-0 border-2 border-transparent
          ${checked 
            ? `${currentSize.translate} shadow-xl` 
            : "translate-x-0.5 shadow-md"
          }
          ${!disabled && checked 
            ? "bg-gradient-to-br from-white to-gray-50" 
            : "bg-white"
          }
        `}
      >
        {/* Thumb inner highlight */}
        <span 
          className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${checked 
              ? "bg-gradient-to-br from-white/80 via-transparent to-transparent" 
              : "bg-gradient-to-br from-white/60 via-transparent to-gray-100/20"
            }
          `} 
        />
        
        {/* Active indicator dot */}
        <span 
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-1.5 h-1.5 rounded-full transition-all duration-300
            ${checked 
              ? `opacity-100 ${color === 'blue' ? 'bg-blue-500' : color === 'purple' ? 'bg-purple-500' : color === 'green' ? 'bg-green-500' : color === 'orange' ? 'bg-orange-500' : 'bg-red-500'}` 
              : "opacity-0 bg-gray-400"
            }
          `} 
        />
      </span>
    </button>
  );
};

export default function SettingsPage() {
  const {
    courseUpdates,
    newMessages,
    marketingEmails,
    remindersEnabled, 
    inMailsEnabled,
    darkMode,
    reduceAnimations,
    twoFactorAuth,
    toggle,
  } = usePreferencesStore();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900">
      <div className="container mx-auto py-8 px-4 space-y-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center space-y-4 pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Manage your account settings and preferences in one place.
            </p>
          </div>
        </div>

        {/* Notifications Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              Notifications & Communication
            </CardTitle>
            <CardDescription className="text-base">
              Choose what updates and alerts you want to receive.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                key: "courseUpdates",
                label: "Course Updates",
                description: "Get notified when a course you're enrolled in is updated.",
                checked: courseUpdates,
              },
              {
                key: "newMessages",
                label: "New Messages",
                description: "Notifications for new messages and replies.",
                checked: newMessages,
              },
              {
                key: "marketingEmails",
                label: "Marketing Emails",
                description: "Receive emails about new courses and promotions.",
                checked: marketingEmails,
              },
              {
                key: "remindersEnabled",
                label: "Reminders",
                description: "Enable reminders for deadlines and upcoming events.",
                checked: remindersEnabled,
              },
              {
                key: "inMailsEnabled",
                label: "In-Platform Messages",
                description: "Receive in-platform messages from connections.",
                checked: inMailsEnabled,
              },
            ].map((item, index) => (
              <div key={item.key}>
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex-1">
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <CustomSwitch
                    checked={item.checked}
                    onCheckedChange={() => toggle(item.key as any)}
                    color="blue"
                  />
                </div>
                {index < 4 && <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Appearance Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              Appearance
            </CardTitle>
            <CardDescription className="text-base">
              Customize how the interface looks and feels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                key: "darkMode",
                label: "Dark Mode",
                description: "Switch between light and dark themes.",
                checked: darkMode,
              },
              {
                key: "reduceAnimations",
                label: "Reduce Animations",
                description: "Minimize motion and animations for better performance.",
                checked: reduceAnimations,
              },
            ].map((item, index) => (
              <div key={item.key}>
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex-1">
                    <Label className="text-base font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <CustomSwitch
                    checked={item.checked}
                    onCheckedChange={() => toggle(item.key as any)}
                    color="purple"
                  />
                </div>
                {index < 1 && <Separator className="my-2 bg-gray-200 dark:bg-gray-700" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                <Lock className="h-5 w-5 text-white" />
              </div>
              Security
            </CardTitle>
            <CardDescription className="text-base">
              Manage your password and authentication methods.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Update Section */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-zinc-800/50 dark:to-zinc-800/30 rounded-xl border border-gray-200 dark:border-zinc-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Update Password
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      className="pr-10 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      className="pr-10 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className="pr-10 bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-600 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Update Password
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-200 dark:bg-gray-700" />

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
              <div className="flex-1">
                <Label className="text-base font-medium text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Add an extra layer of security to your account.
                </p>
              </div>
              <CustomSwitch
                checked={twoFactorAuth}
                onCheckedChange={() => toggle("twoFactorAuth")}
                color="green"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Changes Footer */}
        <div className="text-center pt-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Changes are automatically saved when you toggle settings.
          </p>
        </div>
      </div>
    </div>
  );
}