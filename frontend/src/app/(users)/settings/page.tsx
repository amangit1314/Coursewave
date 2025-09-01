// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Bell, Lock, Moon, Palette, User } from "lucide-react";

// export default function SettingsPage() {
//   return (
//     <div className="container mx-auto py-10 space-y-8">
//       <div className="flex flex-col gap-4">
//         <h1 className="text-4xl font-bold">Settings</h1>
//         <p className="text-muted-foreground">
//           Manage your account settings and preferences.
//         </p>
//       </div>

//       <Tabs defaultValue="profile" className="w-full">
//         <TabsList className="grid w-full md:w-[400px] grid-cols-4">
//           <TabsTrigger value="profile" className="flex items-center gap-2">
//             <User className="h-4 w-4" />
//             <span className="hidden md:inline">Profile</span>
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="flex items-center gap-2">
//             <Bell className="h-4 w-4" />
//             <span className="hidden md:inline">Alerts</span>
//           </TabsTrigger>
//           <TabsTrigger value="appearance" className="flex items-center gap-2">
//             <Palette className="h-4 w-4" />
//             <span className="hidden md:inline">Theme</span>
//           </TabsTrigger>
//           <TabsTrigger value="security" className="flex items-center gap-2">
//             <Lock className="h-4 w-4" />
//             <span className="hidden md:inline">Security</span>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Profile Information</CardTitle>
//               <CardDescription>
//                 Update your profile details and public information.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center gap-6">
//                 <Avatar className="h-24 w-24">
//                   <AvatarImage src="/assets/images/user/user-01.png" />
//                   <AvatarFallback>JD</AvatarFallback>
//                 </Avatar>
//                 <Button>Change Avatar</Button>
//               </div>
//               <Separator />
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input id="name" defaultValue="John Doe" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input id="email" type="email" defaultValue="john@example.com" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input id="username" defaultValue="johndoe" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Bio</Label>
//                   <Input id="bio" defaultValue="Full-stack developer and course creator" />
//                 </div>
//               </div>
//               <Button className="w-full md:w-auto">Save Changes</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="notifications" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Notification Preferences</CardTitle>
//               <CardDescription>
//                 Choose what notifications you want to receive.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>Course Updates</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Get notified when a course you're enrolled in is updated.
//                     </p>
//                   </div>
//                   <Switch defaultChecked />
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>New Messages</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Receive notifications for new messages and replies.
//                     </p>
//                   </div>
//                   <Switch defaultChecked />
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>Marketing Emails</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Receive emails about new courses and promotions.
//                     </p>
//                   </div>
//                   <Switch />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="appearance" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Appearance Settings</CardTitle>
//               <CardDescription>
//                 Customize how CourseWave looks on your device.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>Dark Mode</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Switch between light and dark themes.
//                     </p>
//                   </div>
//                   <Switch />
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>Reduce Animations</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Minimize motion and animations.
//                     </p>
//                   </div>
//                   <Switch />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Security Settings</CardTitle>
//               <CardDescription>
//                 Manage your security preferences and login options.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="current-password">Current Password</Label>
//                   <Input id="current-password" type="password" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="new-password">New Password</Label>
//                   <Input id="new-password" type="password" />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="confirm-password">Confirm New Password</Label>
//                   <Input id="confirm-password" type="password" />
//                 </div>
//                 <Button className="w-full md:w-auto">Update Password</Button>
//                 <Separator />
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <Label>Two-Factor Authentication</Label>
//                     <p className="text-sm text-muted-foreground">
//                       Add an extra layer of security to your account.
//                     </p>
//                   </div>
//                   <Switch />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

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
import { Bell, Lock, Palette, User } from "lucide-react";
import { usePreferencesStore } from "@/zustand/preferencesStore";

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

  return (
    <div className="container mx-auto py-10 space-y-10 dark:bg-zinc-900">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences in one place.
        </p>
      </div>

      {/* Notifications */}
      <Card className="dark:bg-zinc-950 border-stroke dark:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Notifications &
            Communication
          </CardTitle>
          <CardDescription>
            Choose what updates and alerts you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>Course Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when a course you're enrolled in is updated.
              </p>
            </div>
            <Switch
              checked={courseUpdates}
              onCheckedChange={() => toggle("courseUpdates")}
              className="
    data-[state=checked]:bg-blue-500
    dark:data-[state=checked]:bg-blue-400
    data-[state=unchecked]:bg-gray-300
    dark:data-[state=unchecked]:bg-gray-600
  "
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>New Messages</Label>
              <p className="text-sm text-muted-foreground">
                Notifications for new messages and replies.
              </p>
            </div>
            <Switch
              checked={newMessages}
              onCheckedChange={() => toggle("newMessages")}
              className="
    data-[state=checked]:bg-blue-500
    dark:data-[state=checked]:bg-blue-400
    data-[state=unchecked]:bg-gray-300
    dark:data-[state=unchecked]:bg-gray-600
  "
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new courses and promotions.
              </p>
            </div>
            <Switch
              checked={marketingEmails}
              onCheckedChange={() => toggle("marketingEmails")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Enable reminders for deadlines and upcoming events.
              </p>
            </div>
            <Switch
              checked={remindersEnabled}
              onCheckedChange={() => toggle("remindersEnabled")}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>In-Mails</Label>
              <p className="text-sm text-muted-foreground">
                Receive in-platform messages from connections.
              </p>
            </div>
            <Switch
              checked={inMailsEnabled}
              onCheckedChange={() => toggle("inMailsEnabled")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="dark:bg-zinc-950 border-stroke dark:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" /> Appearance
          </CardTitle>
          <CardDescription>Customize how the interface looks.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes.
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={() => toggle("darkMode")}
              className="
    data-[state=checked]:bg-blue-500
    dark:data-[state=checked]:bg-blue-400
    data-[state=unchecked]:bg-gray-300
    dark:data-[state=unchecked]:bg-gray-600
  "
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduce Animations</Label>
              <p className="text-sm text-muted-foreground">
                Minimize motion and animations.
              </p>
            </div>
            <Switch
              checked={reduceAnimations}
              onCheckedChange={() => toggle("reduceAnimations")}
              className="
    data-[state=checked]:bg-blue-500
    dark:data-[state=checked]:bg-blue-400
    data-[state=unchecked]:bg-gray-300
    dark:data-[state=unchecked]:bg-gray-600
  "
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="dark:bg-zinc-950 border-stroke dark:border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Security
          </CardTitle>
          <CardDescription>
            Manage your password and authentication methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button className="w-full bg-gray-400 text-white border-stroke dark:bg-blue-300 hover:cursor-pointer hover:bg-blue-500 hover:text-white">Update Password</Button>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Switch
              checked={twoFactorAuth}
              className="
    data-[state=checked]:bg-blue-500
    dark:data-[state=checked]:bg-blue-400
    data-[state=unchecked]:bg-gray-300
    dark:data-[state=unchecked]:bg-gray-600
  "
              onCheckedChange={() => toggle("twoFactorAuth")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
