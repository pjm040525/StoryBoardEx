import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ui/error-boundary";

// Auth Pages
import { LoginView } from "./components/auth/LoginView";
import { SignUpView } from "./components/auth/SignUpView";
import { ForgotPasswordView } from "./components/auth/ForgotPasswordView";
import { WelcomeView } from "./components/auth/WelcomeView";

// Home & Main Pages
import { HomeView } from "./components/HomeView";
import { NotificationsView } from "./components/NotificationsView";
import { NotFoundView } from "./components/NotFoundView";

// Explore (Public)
import { ExploreView } from "./components/explore/ExploreView";
import { GroupPreviewView } from "./components/explore/GroupPreviewView";

// Create Group
import { CreateGroupView } from "./components/create/CreateGroupView";

// Profile & Settings
import { ProfileView } from "./components/profile/ProfileView";
import { EditProfileView } from "./components/profile/EditProfileView";
import { SettingsView } from "./components/settings/SettingsView";

// Help & Legal
import { HelpView } from "./components/help/HelpView";
import { TermsView } from "./components/legal/TermsView";
import { PrivacyView } from "./components/legal/PrivacyView";

// Invite
import { InviteView } from "./components/invite/InviteView";

// Group Pages
import { GroupLayout } from "./components/group/GroupLayout";
import { GroupMainView } from "./components/group/GroupMainView";
import { ScheduleListView } from "./components/group/schedule/ScheduleListView";
import { ScheduleDetailView } from "./components/group/schedule/ScheduleDetailView";
import { VoteCreateView } from "./components/group/schedule/VoteCreateView";
import { VoteDetailView } from "./components/group/schedule/VoteDetailView";
import { DuesView } from "./components/group/dues/DuesView";
import { SettlementRequestView } from "./components/group/dues/SettlementRequestView";
import { DuesRulesView } from "./components/group/dues/DuesRulesView";
import { DuesHistoryView } from "./components/group/dues/DuesHistoryView";
import { StoriesView } from "./components/group/stories/StoriesView";
import { CreateStoryView } from "./components/group/stories/CreateStoryView";
import { StoryDetailView } from "./components/group/stories/StoryDetailView";
import { StatsView } from "./components/group/stats/StatsView";
import { AdminView } from "./components/group/admin/AdminView";
import { EditGroupView } from "./components/group/admin/EditGroupView";
import { DuesPolicyView } from "./components/group/admin/DuesPolicyView";
import { MemberManagementView } from "./components/group/admin/MemberManagementView";

// Simple Global Layout for the Home Page
function GlobalLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden">
        <main className="h-full overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Auth Layout (no container constraints for full-screen feel)
function AuthLayout() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <div className="max-w-md mx-auto min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" richColors closeButton />
      <BrowserRouter>
        <Routes>
          {/* Auth Pages */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignUpView />} />
            <Route path="/forgot-password" element={<ForgotPasswordView />} />
            <Route path="/welcome" element={<WelcomeView />} />
          </Route>

          {/* Public/Explore Pages */}
          <Route element={<GlobalLayout />}>
            <Route path="/explore" element={<ExploreView />} />
            <Route path="/explore/:groupId" element={<GroupPreviewView />} />
          </Route>

          {/* Invite Page */}
          <Route element={<AuthLayout />}>
            <Route path="/invite/:inviteCode" element={<InviteView />} />
          </Route>

          {/* Main Pages (Logged In) */}
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/notifications" element={<NotificationsView />} />
            <Route path="/create-group" element={<CreateGroupView />} />
            
            {/* Profile */}
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/edit" element={<EditProfileView />} />
            
            {/* Settings */}
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/settings/notifications" element={<SettingsView />} />
            <Route path="/settings/privacy" element={<PrivacyView />} />
            
            {/* Help & Legal */}
            <Route path="/help" element={<HelpView />} />
            <Route path="/terms" element={<TermsView />} />
            <Route path="/privacy" element={<PrivacyView />} />
          </Route>

          {/* Group Pages */}
          <Route path="/group/:groupId" element={<GroupLayout />}>
            <Route index element={<GroupMainView />} />
            
            {/* Schedule */}
            <Route path="schedule" element={<ScheduleListView />} />
            <Route path="schedule/:scheduleId" element={<ScheduleDetailView />} />
            <Route path="schedule/create-vote" element={<VoteCreateView />} />
            <Route path="vote/:voteId" element={<VoteDetailView />} />
            
            {/* Dues */}
            <Route path="dues" element={<DuesView />} />
            <Route path="dues/settlement-request" element={<SettlementRequestView />} />
            <Route path="dues/rules" element={<DuesRulesView />} />
            <Route path="dues/history" element={<DuesHistoryView />} />
            
            {/* Stories */}
            <Route path="stories" element={<StoriesView />} />
            <Route path="stories/create" element={<CreateStoryView />} />
            <Route path="stories/:storyId" element={<StoryDetailView />} />
            
            {/* Stats */}
            <Route path="stats" element={<StatsView />} />
            
            {/* Admin */}
            <Route path="admin" element={<AdminView />} />
            <Route path="admin/edit-group" element={<EditGroupView />} />
            <Route path="admin/dues-policy" element={<DuesPolicyView />} />
            <Route path="admin/members" element={<MemberManagementView />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
