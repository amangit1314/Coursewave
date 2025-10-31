import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Lock, Moon, Palette, User } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

interface NotificationSettings {
  courseUpdates: boolean;
  newMessages: boolean;
  marketingEmails: boolean;
}

interface AppearanceSettings {
  darkMode: boolean;
  reduceAnimations: boolean;
}

// API functions
const fetchUserProfile = async (): Promise<UserProfile> => {
  const response = await axios.get("/api/profile/me");
  return response.data;
};

const fetchNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await axios.get("/api/profile/notifications");
  return response.data;
};

const fetchAppearanceSettings = async (): Promise<AppearanceSettings> => {
  const response = await axios.get("/api/profile/appearance");
  return response.data;
};

const updateProfile = async (data: Partial<UserProfile>) => {
  const response = await axios.patch("/api/profile/me", data);
  return response.data;
};

const updateNotifications = async (data: Partial<NotificationSettings>) => {
  const response = await axios.patch("/api/profile/notifications", data);
  return response.data;
};

const updateAppearance = async (data: Partial<AppearanceSettings>) => {
  const response = await axios.patch("/api/profile/appearance", data);
  return response.data;
};

const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const response = await axios.post("/api/profile/change-password", data);
  return response.data;
};

export default function SettingsPageWithAPI() {
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Queries
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
  });

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotificationSettings,
  });

  const { data: appearance, isLoading: isAppearanceLoading } = useQuery({
    queryKey: ["appearance"],
    queryFn: fetchAppearanceSettings,
  });

  // Mutations
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const notificationsMutation = useMutation({
    mutationFn: updateNotifications,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Notification preferences updated",
      });
    },
  });

  const appearanceMutation = useMutation({
    mutationFn: updateAppearance,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appearance settings updated",
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);
    profileMutation.mutate(data as Partial<UserProfile>);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    passwordMutation.mutate(passwordData);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Theme</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your profile details and public information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatarUrl} />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button type="button">Change Avatar</Button>
                </div>
                <Separator className="my-6" />
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile?.name}
                      disabled={isProfileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile?.email}
                      disabled={isProfileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      defaultValue={profile?.username}
                      disabled={isProfileLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      defaultValue={profile?.bio}
                      disabled={isProfileLoading}
                    />
                  </div>
                </div>
                <Button
                  className="w-full md:w-auto mt-6"
                  type="submit"
                  disabled={profileMutation.isPending}
                >
                  {profileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Course Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a course you're enrolled in is updated.
                    </p>
                  </div>
                  <Switch
                    checked={notifications?.courseUpdates}
                    onCheckedChange={(checked) =>
                      notificationsMutation.mutate({ courseUpdates: checked })
                    }
                    disabled={isNotificationsLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>New Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications for new messages and replies.
                    </p>
                  </div>
                  <Switch
                    checked={notifications?.newMessages}
                    onCheckedChange={(checked) =>
                      notificationsMutation.mutate({ newMessages: checked })
                    }
                    disabled={isNotificationsLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about new courses and promotions.
                    </p>
                  </div>
                  <Switch
                    checked={notifications?.marketingEmails}
                    onCheckedChange={(checked) =>
                      notificationsMutation.mutate({ marketingEmails: checked })
                    }
                    disabled={isNotificationsLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how CourseWave looks on your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes.
                    </p>
                  </div>
                  <Switch
                    checked={appearance?.darkMode}
                    onCheckedChange={(checked) =>
                      appearanceMutation.mutate({ darkMode: checked })
                    }
                    disabled={isAppearanceLoading}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Reduce Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize motion and animations.
                    </p>
                  </div>
                  <Switch
                    checked={appearance?.reduceAnimations}
                    onCheckedChange={(checked) =>
                      appearanceMutation.mutate({ reduceAnimations: checked })
                    }
                    disabled={isAppearanceLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your security preferences and login options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    className="w-full md:w-auto"
                    type="submit"
                    disabled={passwordMutation.isPending}
                  >
                    {passwordMutation.isPending
                      ? "Updating Password..."
                      : "Update Password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 