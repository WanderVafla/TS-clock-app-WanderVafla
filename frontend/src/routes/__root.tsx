import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import "../styles.css";
import { fetchClockStatus } from "#/api/api.clock";
import { fetchEntries } from "#/api/api.entries";
import { fetchEntriesLabels } from "#/api/api.entriesLabels";
import { fetchLabels } from "#/api/api.labels";
import { fetchProjects } from "#/api/api.projects";
import { Pending } from "#/componets/placeholders/Pending";
import { SideNavigation } from "#/componets/SideNavigation";

const loadRootData = async () => {
  const [isClockRunning, projects, labels, lastEntries] = await Promise.all([
    fetchClockStatus(),
    fetchProjects(),
    fetchLabels(),
    fetchEntries({ order: "end_time", sizePage: 1 }),
  ]);

  const running = lastEntries.data[0];
  const entriesLabels =
    running && !running.end_time ? await fetchEntriesLabels([running.id]) : [];
  return { isClockRunning, projects, labels, lastEntries, entriesLabels };
};

export const Route = createRootRoute({
  loader: loadRootData,
  component: RootComponent,
  pendingComponent: Pending,
});

function RootComponent() {
  return (
    <div className="flex flex-col w-full h-dvh md:flex-row">
      <SideNavigation />
      <Outlet />

      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "TanStack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}
