// // stores/sessions-store.ts
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import toast from "react-hot-toast";
// import { useUserStore } from "./userStore";
// import { sessionService } from "@/lib/api/sessions";

// type Session = {
//   id: string;
//   title: string;
//   description: string;
//   startTime: Date;
//   endTime: Date;
//   meetingUrl: string;
//   status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
//   participants: string[]; // user IDs
//   instructorId: string;
//   courseId?: string; // if related to a course
// };

// type SessionsState = {
//   upcomingSessions: Session[];
//   pastSessions: Session[];
//   loadingState: {
//     loading: boolean;
//     error: string | null;
//   };
// };

// type SessionsActions = {
//   fetchUpcomingSessions: (userId: string) => Promise<void>;
//   fetchPastSessions: (userId: string) => Promise<void>;
//   bookSession: (sessionData: {
//     title: string;
//     description: string;
//     startTime: Date;
//     endTime: Date;
//     instructorId: string;
//     courseId?: string;
//   }) => Promise<void>;
//   cancelSession: (sessionId: string) => Promise<void>;
//   joinSession: (sessionId: string) => Promise<void>;
//   rescheduleSession: (
//     sessionId: string,
//     newStartTime: Date,
//     newEndTime: Date
//   ) => Promise<void>;
// };

// export const useSessionsStore = create<SessionsState & SessionsActions>()(
//   persist(
//     (set, get) => ({
//       upcomingSessions: [],
//       pastSessions: [],
//       loadingState: { loading: false, error: null },

//       fetchUpcomingSessions: async (userId: string) => {
//         set({ loadingState: { loading: true, error: null } });
//         try {
//           const sessions = await sessionService.getUpcomingSessions(userId);
//           set({
//             upcomingSessions: sessions,
//             loadingState: { loading: false, error: null },
//           });
//         } catch (error: any) {
//           set({
//             loadingState: {
//               loading: false,
//               error: error.message || "Failed to fetch upcoming sessions",
//             },
//           });
//           throw error;
//         }
//       },

//       fetchPastSessions: async (userId: string) => {
//         set({ loadingState: { loading: true, error: null } });
//         try {
//           const sessions = await sessionService.getPastSessions(userId);
//           set({
//             pastSessions: sessions,
//             loadingState: { loading: false, error: null },
//           });
//         } catch (error: any) {
//           set({
//             loadingState: {
//               loading: false,
//               error: error.message || "Failed to fetch past sessions",
//             },
//           });
//           throw error;
//         }
//       },

//       bookSession: async (sessionData) => {
//         const { userId } = useUserStore.getState();
//         if (!userId) return;

//         set({ loadingState: { loading: true, error: null } });
//         try {
//           const newSession = await sessionService.bookSession({
//             ...sessionData,
//             participantId: userId,
//           });
//           set((state) => ({
//             upcomingSessions: [...state.upcomingSessions, newSession],
//             loadingState: { loading: false, error: null },
//           }));
//           toast.success("Session booked successfully!");
//         } catch (error: any) {
//           set({
//             loadingState: {
//               loading: false,
//               error: error.message || "Failed to book session",
//             },
//           });
//           throw error;
//         }
//       },

//       // Other actions...

//       cancelSession: async (sessionId) => {
//         set({ loadingState: { loading: true, error: null } });
//         try {
//           await sessionService.cancelSession(sessionId);
//           set((state) => ({
//             upcomingSessions: state.upcomingSessions.filter(
//               (session) => session.id !== sessionId
//             ),
//             loadingState: { loading: false, error: null },
//           }));
//           toast.success("Session cancelled successfully!");
//         } catch (error: any) {
//           set({
//             loadingState: {
//               loading: false,
//               error: error.message || "Failed to cancel session",
//             },
//           });
//           throw error;
//         }
//       },

//         joinSession: async (sessionId) => {
//             set({ loadingState: { loading: true, error: null } });
//             try {
//             await sessionService.joinSession(sessionId);
//             set((state) => ({
//                 upcomingSessions: state.upcomingSessions.map((session) =>
//                 session.id === sessionId
//                     ? { ...session, status: "ONGOING" }
//                     : session
//                 ),
//                 loadingState: { loading: false, error: null },
//             }));
//             toast.success("Joined session successfully!");
//             } catch (error: any) {
//             set({
//                 loadingState: {
//                 loading: false,
//                 error: error.message || "Failed to join session",
//                 },
//             });
//             throw error;
//             }
//         },

//         rescheduleSession: async (sessionId, newStartTime, newEndTime) => {
//             set({ loadingState: { loading: true, error: null } });
//             try {
//             const updatedSession = await sessionService.rescheduleSession(
//                 sessionId,
//                 newStartTime,
//                 newEndTime
//             );
//             set((state) => ({
//                 upcomingSessions: state.upcomingSessions.map((session) =>
//                 session.id === sessionId ? updatedSession : session
//                 ),
//                 loadingState: { loading: false, error: null },
//             }));
//             toast.success("Session rescheduled successfully!");
//             } catch (error: any) {
//             set({
//                 loadingState: {
//                 loading: false,
//                 error: error.message || "Failed to reschedule session",
//                 },
//             });
//             throw error;
//             }
//         },
//     }),
//     {
//       name: "Coursewave-Sessions-Store",
//       // Optional: Only persist certain fields if needed
//       partialize: (state) => ({
//         upcomingSessions: state.upcomingSessions,
//         pastSessions: state.pastSessions,
//       }),
//     }
//   )
// );