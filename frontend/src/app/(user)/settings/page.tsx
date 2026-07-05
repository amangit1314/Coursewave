"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  User,
} from "lucide-react";
import { usePreferencesStore } from "@/zustand/preferencesStore";
import { dmSans } from "@/lib/config/fonts";

// ---------------- Custom Switch Component ----------------
const CustomSwitch = ({
  checked,
  onCheckedChange,
  color = "blue",
  size = "default",
  disabled = false,
}: {
  checked: boolean;
  onCheckedChange: () => void;
  color?: "blue" | "purple" | "green" | "orange" | "red";
  size?: "sm" | "default" | "lg";
  disabled?: boolean;
}) => {
  const sizeClasses = {
    sm: { switch: "h-5 w-9", thumb: "h-3.5 w-3.5", translate: "translate-x-4" },
    default: {
      switch: "h-6 w-11",
      thumb: "h-4.5 w-4.5",
      translate: "translate-x-5",
    },
    lg: {
      switch: "h-7 w-13",
      thumb: "h-5.5 w-5.5",
      translate: "translate-x-6",
    },
  };

  const colorClasses = {
    blue: {
      checked:
        "bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-blue-900/50",
      focus: "focus:ring-blue-500/50",
    },
    purple: {
      checked:
        "bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-200 dark:shadow-purple-900/50",
      focus: "focus:ring-purple-500/50",
    },
    green: {
      checked:
        "bg-gradient-to-r from-green-500 to-green-600 shadow-green-200 dark:shadow-green-900/50",
      focus: "focus:ring-green-500/50",
    },
    orange: {
      checked:
        "bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-200 dark:shadow-orange-900/50",
      focus: "focus:ring-orange-500/50",
    },
    red: {
      checked:
        "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200 dark:shadow-red-900/50",
      focus: "focus:ring-red-500/50",
    },
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
        focus:ring-offset-background
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-95 hover:shadow-lg"}
        ${checked ? `${currentColor.checked} ${currentColor.focus}` : `bg-input focus:ring-ring/30 hover:bg-muted-foreground/30`}
      `}
    >
      <span className="sr-only">Toggle setting</span>
      <span className="absolute inset-0 rounded-full">
        <span
          className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
            checked
              ? "opacity-100 bg-gradient-to-r from-white/20 to-transparent"
              : "opacity-0"
          }`}
        />
      </span>

      {/* INDICATOR */}
      <span
        className={`
          pointer-events-none relative inline-block ${currentSize.thumb} transform rounded-full 
          bg-white shadow-lg transition-all duration-300 ease-in-out
          ring-0 border-2 border-transparent
          ${checked ? `${currentSize.translate} shadow-xl` : "translate-x-0.5 shadow-md"}
          ${!disabled && checked ? "bg-gradient-to-br from-white to-gray-50" : "bg-white"}
          translate-y-[2px]
        `}
      >
        <span
          className={`
            absolute inset-0 rounded-full transition-all duration-300 ${
              checked
                ? "bg-gradient-to-br from-white/80 via-transparent to-transparent"
                : "bg-gradient-to-br from-white/60 via-transparent to-gray-100/20"
            }
          `}
        />
        <span
          className={`
            absolute top-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-1.5 h-1.5 rounded-full transition-all duration-300
            ${checked ? `opacity-100 ${color}-500` : "opacity-0 bg-gray-400"}
          `}
        />
      </span>
    </button>
  );
};

// ---------------- Settings Page ----------------
export default function SettingsPage() {
  const preferences = usePreferencesStore();

  // Card configuration for dynamic rendering
  const settingsConfig = [
    {
      title: "Notifications & Communication",
      description: "Choose what updates and alerts you want to receive.",
      icon: <Bell className="h-5 w-5 text-primary-foreground" />,
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      items: [
        {
          key: "courseUpdates",
          label: "Course Updates",
          description:
            "Get notified when a course you're enrolled in is updated.",
        },
        {
          key: "newMessages",
          label: "New Messages",
          description: "Notifications for new messages and replies.",
        },
        {
          key: "marketingEmails",
          label: "Marketing Emails",
          description: "Receive emails about new courses and promotions.",
        },
        {
          key: "remindersEnabled",
          label: "Reminders",
          description: "Enable reminders for deadlines and upcoming events.",
        },
        {
          key: "inMailsEnabled",
          label: "In-Platform Messages",
          description: "Receive in-platform messages from connections.",
        },
      ],
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8 max-w-4xl">
        {/* Header */}
        <div className="text-center space-y-4 pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1
              className={`${dmSans.className} text-4xl tracking-tight font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent`}
            >
              Settings
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your account settings and preferences in one place.
            </p>
          </div>
        </div>

        {/* Cards */}
        {settingsConfig.map((card) => (
          <Card
            key={card.title}
            className="border-0 bg-card/80 backdrop-blur-sm transition-all duration-300"
          >
            <CardHeader className="pb-6">
              <CardTitle
                className={`${dmSans.className} flex items-center tracking-tight gap-3 text-xl`}
              >
                <div className={`p-2 ${card.iconBg} rounded-lg`}>
                  {card.icon}
                </div>
                {card.title}
              </CardTitle>
              <CardDescription className="text-base">
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* {card.extraContent} */}

              {card.items.map((item, index) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <Label
                        className={`${dmSans.className}  text-base font-semibold text-foreground`}
                      >
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                    <CustomSwitch
                      checked={Boolean(
                        preferences[item.key as keyof typeof preferences]
                      )}
                      onCheckedChange={() =>
                        preferences.toggle(item.key as any)
                      }
                      color={
                        card.color as
                          | "blue"
                          | "purple"
                          | "green"
                          | "orange"
                          | "red"
                      }
                    />
                  </div>
                  {index < card.items.length - 1 && (
                    <Separator className="my-2 bg-border" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Footer */}
        <div className="text-center pt-6">
          <p className="text-sm text-muted-foreground">
            Changes are automatically saved when you toggle settings.
          </p>
        </div>
      </div>
    </div>
  );
}
