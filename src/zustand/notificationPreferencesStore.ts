import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

type NotificationPreferences = {
  course_update_reminder: boolean;
  instructor_new_course_reminder: boolean;
  session_reminders: boolean;
  qandAns_reminders: boolean;
  course_updates: boolean;
  marketing_emails: boolean;
  security_emails: boolean;
};

type NotificationPreferencesStore = {
  preferences: NotificationPreferences;
  setPreferences: (preferences: Partial<NotificationPreferences>) => void;
  updatePreferences: (
    userId: string,
    preferences: Partial<NotificationPreferences>
  ) => Promise<void>;
};

const useNotificationPreferencesStore = create<NotificationPreferencesStore>()(
  persist(
    (set) => ({
      preferences: {
        course_update_reminder: false,
        instructor_new_course_reminder: false,
        session_reminders: false,
        qandAns_reminders: true,
        course_updates: false,
        marketing_emails: false,
        security_emails: true,
      },
      setPreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      updatePreferences: async (userId, preferences) => {
        try {
          const response = await axios.post(
            `api/profile/${userId}/preferences`,
            {
              preferences,
            }
          );

          if (response.status === 200) {
            set((state) => ({
              preferences: { ...state.preferences, ...preferences },
            }));
            console.log("Preferences updated successfully:", response.data);
          } else {
            console.error("Failed to update preferences:", response.data);
          }
        } catch (error) {
          console.error("Error updating preferences:", error);
        }
      },
    }),
    { name: "notification-preferences" }
  )
);

export default useNotificationPreferencesStore;
