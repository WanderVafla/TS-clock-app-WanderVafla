import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";

import "../styles.css";
import { SideNavigation } from "#/componets/SideNavigation";
import { fetchClockStatus } from "#/api/api.clock";

export const Route = createRootRoute({
  loader: fetchClockStatus,
  component: RootComponent,
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
