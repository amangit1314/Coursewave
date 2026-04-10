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
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { usePreferencesStore } from "@/zustand/preferencesStore";
import { dmSans } from "@/lib/config/fonts";
import { PageContainer, PageHeader } from "@/components/shared";

export default function SettingsPage() {
  const preferences = usePreferencesStore();

  const settingsConfig = [
    {
      title: "Notifications & Communication",
      description: "Choose what updates and alerts you want to receive.",
      icon: <Bell className="h-5 w-5 text-primary-foreground" />,
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
    },
  ];

  return (
    <PageContainer size="md">
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences."
      />

      {settingsConfig.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-6">
            <CardTitle
              className={`${dmSans.className} flex items-center tracking-tight gap-3 text-xl`}
            >
              <div className="rounded-lg bg-primary p-2">
                {card.icon}
              </div>
              {card.title}
            </CardTitle>
            <CardDescription className="text-base">
              {card.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {card.items.map((item, index) => (
              <div key={item.key}>
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="flex-1 mr-4">
                    <Label
                      className={`${dmSans.className} text-base font-semibold text-foreground`}
                    >
                      {item.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(
                      preferences[item.key as keyof typeof preferences]
                    )}
                    onCheckedChange={() =>
                      preferences.toggle(item.key as keyof typeof preferences & string)
                    }
                  />
                </div>
                {index < card.items.length - 1 && (
                  <Separator className="my-1" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Changes are automatically saved when you toggle settings.
        </p>
      </div>
    </PageContainer>
  );
}
