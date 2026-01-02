import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ErrorBoundary } from "./components/ui/error-boundary";
import { HomeView } from "./components/HomeView";
import { NotificationsView } from "./components/NotificationsView";
import { CreateGroupView } from "./components/create/CreateGroupView";
import { GroupLayout } from "./components/group/GroupLayout";
import { GroupMainView } from "./components/group/GroupMainView";
import { ScheduleListView } from "./components/group/schedule/ScheduleListView";
import { VoteCreateView } from "./components/group/schedule/VoteCreateView";
import { DuesView } from "./components/group/dues/DuesView";
import { StoriesView } from "./components/group/stories/StoriesView";
import { StatsView } from "./components/group/stats/StatsView";
import { AdminView } from "./components/group/admin/AdminView";
import { EditGroupView } from "./components/group/admin/EditGroupView";
import { DuesPolicyView } from "./components/group/admin/DuesPolicyView";
import { MemberManagementView } from "./components/group/admin/MemberManagementView";
import { SettlementRequestView } from "./components/group/dues/SettlementRequestView";
import { DuesRulesView } from "./components/group/dues/DuesRulesView";
import { DuesHistoryView } from "./components/group/dues/DuesHistoryView";

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

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-center" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route element={<GlobalLayout />}>
            <Route path="/" element={<HomeView />} />
            <Route path="/notifications" element={<NotificationsView />} />
            <Route
              path="/create-group"
              element={<CreateGroupView />}
            />
          </Route>

          <Route path="/group/:groupId" element={<GroupLayout />}>
            <Route index element={<GroupMainView />} />
            <Route
              path="schedule"
              element={<ScheduleListView />}
            />
            <Route
              path="schedule/create-vote"
              element={<VoteCreateView />}
            />
            <Route path="dues" element={<DuesView />} />
            <Route path="dues/settlement-request" element={<SettlementRequestView />} />
            <Route path="dues/rules" element={<DuesRulesView />} />
            <Route path="dues/history" element={<DuesHistoryView />} />
            <Route path="stories" element={<StoriesView />} />
            <Route path="stats" element={<StatsView />} />
            <Route path="admin" element={<AdminView />} />
            <Route path="admin/edit-group" element={<EditGroupView />} />
            <Route path="admin/dues-policy" element={<DuesPolicyView />} />
            <Route path="admin/members" element={<MemberManagementView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}