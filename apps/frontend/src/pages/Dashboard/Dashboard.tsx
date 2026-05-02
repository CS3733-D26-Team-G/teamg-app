import { useState } from "react";
import DashboardRecentActivity from "../../features/dashboard/components/DashboardRecentActivity.tsx";
import EditableDashboardCard, {
  type dashboardCardID,
} from "../../features/dashboard/components/EditableDashboard.tsx";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensors,
  useSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SearchBar from "../../features/dashboard/components/SearchBar.tsx";
import PieChart from "../../features/dashboard/components/PieChart.tsx";
import TypeBarChart from "../../features/dashboard/components/BarChart.tsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.tsx";
import {
  Box,
  styled,
  Toolbar,
  Typography,
  CardHeader,
  Divider,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useAuth } from "../../auth/AuthContext.tsx";
import HelpPopup from "../../components/HelpPopup";
import HitsLineChart from "../../features/dashboard/components/HitsLineChart.tsx";
import AdminCards from "../../features/dashboard/components/AdminCards.tsx";
import { useProfile } from "../../profile/ProfileContext.tsx";
import { useDashboardBootstrap } from "../../features/dashboard/useDashboardBootstrap.ts";

export default function Dashboard() {
  const [_searchQuery, setSearchQuery] = useState("");
  const [cardOrder, setCardOrder] = useState<dashboardCardID[]>([
    "employee-demographics",
    "recent-activity",
    "role-ba",
    "role-uw",
    "role-actuarial",
    "role-exl",
    "role-bus-ops",
    "employee-activity",
    "file-types",
    "popular-content-search",
    "employee-edits-by-day",
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    setCardOrder((items) => {
      const oldIndex = items.indexOf(active.id as dashboardCardID);
      const newIndex = items.indexOf(over.id as dashboardCardID);
      if (oldIndex === -1 || newIndex === -1) {
        return items;
      }
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const { session } = useAuth();
  const { data, loading, error } = useDashboardBootstrap();
  const rawLogs = data?.activityAll ?? [];
  const analytics = (data?.contentCounts ?? {}) as Record<string, number>;
  const employeeCounts = (data?.employeeCounts ?? {}) as Record<string, number>;
  const fileTypeCounts = data?.fileTypeCounts ?? [];
  const employeePieData = [
    {
      id: 0,
      value: employeeCounts.BUSINESS_ANALYST ?? 0,
      label: "Business Analyst",
      color: "#bea5aa",
    },
    {
      id: 1,
      value: employeeCounts.BUSINESS_OP_RATING ?? 0,
      label: "Business Ops Rating Team",
      color: "#509edd",
    },
    {
      id: 2,
      value: employeeCounts.UNDERWRITER ?? 0,
      label: "Underwriter",
      color: "#395176",
    },
    {
      id: 3,
      value: employeeCounts.ACTUARIAL_ANALYST ?? 0,
      label: "Actuarial Analyst",
      color: "#ba667b",
    },
    {
      id: 4,
      value: employeeCounts.ADMIN ?? 0,
      label: "Admin",
      color: "#74414e",
    },
    {
      id: 5,
      value: employeeCounts.EXL_OPERATIONS ?? 0,
      label: "EXL Operations",
      color: "#721b31",
    },
  ];
  const roles = [
    "Business Analyst",
    "Underwriter",
    "Actuarial Analyst",
    "EXL Operations",
    "Business Ops Team",
  ];
  const getRolecard = (role: string): dashboardCardID => {
    const mapping: Record<string, dashboardCardID> = {
      "Business Analyst": "role-ba",
      "Underwriter": "role-uw",
      "Actuarial Analyst": "role-actuarial",
      "EXL Operations": "role-exl",
      "Business Ops Team": "role-bus-ops",
    };
    return mapping[role];
  };
  const getAnalyticsKey = (role: string) => {
    const mapping: Record<string, string> = {
      "Business Analyst": "BUSINESS_ANALYST",
      "Underwriter": "UNDERWRITER",
      "Actuarial Analyst": "ACTUARIAL_ANALYST",
      "EXL Operations": "EXL_OPERATIONS",
      "Business Ops Team": "BUSINESS_OP_RATING",
    };

    return mapping[role] || role.replace(/\s+/g, "_").toUpperCase();
  };

  const helpDescriptions: Record<string, string> = {
    UNDERWRITER:
      "You are an UnderWriter, please give us time to give you help.",
    BUSINESS_ANALYST:
      "You are an Business Analyst, please give us time to give you help.",
    ACTUARIAL_ANALYST:
      "You are an Actuarial Analyst, please give us time to give you help.",
    EXL_OPERATIONS:
      "You are an EXL Operations, please give us time to give you help.",
    BUSINESS_OP_RATING:
      "You are an Business OP Rating, please give us time to give you help.",
    ADMIN:
      "The Dashboard gives you a full organizational overview including employee demographics, recent activity, and content counts by role.",
  };

  const helpText =
    helpDescriptions[session?.position ?? ""] ??
    "The Dashboard gives you an overview of your organization.";

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    flexDirection: "column",
    alignItems: "stretch",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    minHeight: 128,
  }));

  const { profile } = useProfile();

  const employeeDemographicsCard = (
    <Card
      className="h-full w-full min-w-0 outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            Employee Demographics
            <HelpPopup
              description="The Employee Demographics chart provides a breakdown of how many employees belong to each role. Hover over a slice of the chart to see exact numbers!"
              infoOrHelp={false}
            />
          </Typography>
        }
      />
      <Divider />
      <CardContent className="flex items-center justify-center p-6">
        <div className="w-full">
          <PieChart data={employeePieData} />
        </div>
      </CardContent>
    </Card>
  );

  const fileTypesCard = (
    <Card
      className="outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            File Types
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <TypeBarChart data={fileTypeCounts} />
      </CardContent>
    </Card>
  );

  const popularContentSearchCard = (
    <Card
      className="outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            Popular Content Search
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <Typography
          variant="body2"
          color="text.secondary"
        >
          No popular search data available yet.
        </Typography>
      </CardContent>
    </Card>
  );

  const employeeEditsByDay = (
    <Card
      className="flex-1 outline-1 outline-gray-200"
      sx={{ margin: 0, borderRadius: 3 }}
    >
      <CardHeader
        sx={{ py: 1.5, px: 2 }}
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1.3rem" }}
          >
            Employee Edits By Day
            <HelpPopup
              description={
                "This graphic shows the fluctuation in content hits by role."
              }
              infoOrHelp={false}
            />
          </Typography>
        }
      />
      <Divider />
      <CardContent className="p-6">
        <HitsLineChart />
      </CardContent>
    </Card>
  );

  const buildroleCard = (role: string) => {
    const key = getAnalyticsKey(role);
    const count = analytics[key] ?? 0;
    return (
      <Card
        className="h-full outline-1 outline-gray-200"
        sx={{ borderRadius: 3 }}
      >
        <CardContent className="p-4">
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
          >
            {" "}
            {role}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            {" "}
            {count}
          </Typography>
          <Typography
            variant="caption"
            color="primary.main"
            sx={{ fontWeight: "bold" }}
          >
            {" "}
            Total Items
            <HelpPopup
              description={`This is the total amount of content accessible by ${role}s`}
              infoOrHelp={false}
            />
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const dashboardCards = [
    {
      id: "employee-demographics" as dashboardCardID,
      node: employeeDemographicsCard,
      className: "col-span-12 xl:col-span-4",
    },
    {
      id: "recent-activity" as dashboardCardID,
      node: <DashboardRecentActivity rawLogs={rawLogs} />,
      className: "col-span-12 xl:col-span-6",
    },
    ...roles.map((role) => ({
      id: getRolecard(role),
      node: buildroleCard(role),
      className: "col-span-3 sm:col-span-4 lg:col-span-2 xl:col-span-2",
    })),
    ...(session?.position === "ADMIN" ?
      [
        {
          id: "employee-activity" as dashboardCardID,
          node: <AdminCards />,
          className: "col-span-3 lg:col-span-5",
        },
      ]
    : []),
    {
      id: "file-types" as dashboardCardID,
      node: fileTypesCard,
      className: "col-span-3 lg:col-span-4",
    },
    {
      id: "popular-content-search" as dashboardCardID,
      node: popularContentSearchCard,
      className: "col-span-12 lg:col-span-4",
    },
    {
      id: "employee-edits-by-day" as dashboardCardID,
      node: employeeEditsByDay,
      className: "col-span-3 lg:col-span-8",
    },
  ];
  const visibleCardIDs = dashboardCards.map((card) => card.id);
  const orderedDashboardCards = cardOrder
    .filter((id) => visibleCardIDs.includes(id))
    .map((id) => dashboardCards.find((card) => card.id === id))
    .filter((card): card is (typeof dashboardCards)[number] => Boolean(card));

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "auto",
        width: "100%",
      }}
    >
      <StyledToolbar
        sx={{
          background:
            "linear-gradient(90deg, #1A1E4B 0%, #395176 60%, #4a7aab 100%)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="flex justify-between items-center px-8 py-6">
          <Typography
            variant="h2"
            sx={{ fontWeight: "bold", color: "white" }}
          >
            Welcome Back {profile?.firstName}!
          </Typography>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: "absolute",
                borderRadius: "50%",
                border: "1px solid rgba(238, 31, 31, 0.12)",
                width: 120 + i * 80,
                height: 120 + i * 80,
                top: -40 - i * 30,
                right: -40 - i * 30,
              }}
            />
          ))}
          <div className="flex items-center gap-2">
            <HelpPopup
              description={helpText}
              infoOrHelp={true}
            />
            <NotificationBell />
            <div className="w-80">
              <SearchBar setSearchQuery={setSearchQuery} />
            </div>
          </div>
        </div>
      </StyledToolbar>
      <Card
        className="m-auto mr-2 mb-2 flex h-auto min-h-[95vh] flex-col"
        sx={{ borderRadius: 3 }}
      >
        <CardContent
          className="mr-1 flex flex-col gap-5"
          sx={{
            padding: 5,
            minHeight: "88vh",
            backgroundColor: "background.default",
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedDashboardCards.map((card) => card.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-12 gap-8 items-start">
                {orderedDashboardCards.map((card) => (
                  <EditableDashboardCard
                    key={card.id}
                    id={card.id}
                    className={card.className}
                  >
                    {" "}
                    {card.node}
                  </EditableDashboardCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </Box>
  );
}
