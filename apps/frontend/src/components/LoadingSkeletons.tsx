import { Box, Skeleton, Stack } from "@mui/material";

/** Full-page header + table skeleton, matches ContentManagement / EmployeeManagement layout */
export function PageTableSkeleton({
  rowCount = 8,
  showFilters = true,
}: {
  rowCount?: number;
  showFilters?: boolean;
}) {
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Header area */}
      <Box
        sx={{ px: 4, pt: 5, pb: 3, position: "relative", overflow: "hidden" }}
      >
        <Skeleton
          variant="text"
          width={320}
          height={60}
          sx={{ bgcolor: "rgba(255,255,255,0.12)" }}
        />
        <Skeleton
          variant="text"
          width={420}
          height={24}
          sx={{ bgcolor: "rgba(255,255,255,0.08)", mt: 0.5 }}
        />

        {showFilters && (
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 3, pb: 1 }}
          >
            <Skeleton
              variant="rounded"
              width={280}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}
            />
            <Skeleton
              variant="rounded"
              width={100}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}
            />
            <Skeleton
              variant="rounded"
              width={110}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Skeleton
              variant="rounded"
              width={140}
              height={40}
              sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: "4px" }}
            />
          </Stack>
        )}
      </Box>

      {/* Table rows */}
      <Box sx={{ width: "95%", mx: "auto" }}>
        {/* Header row */}
        <Skeleton
          variant="rounded"
          width="100%"
          height={56}
          sx={{
            mb: 0.5,
            bgcolor: "rgba(255,255,255,0.08)",
            borderRadius: "4px",
          }}
        />
        {[...Array(rowCount)].map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width="100%"
            height={52}
            sx={{
              mb: 0.5,
              borderRadius: "4px",
              opacity: Math.max(0.15, 1 - i * 0.1),
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

/** Centered spinner overlay for dialogs / modals */
export function InlineLoader({ minHeight = 200 }: { minHeight?: number }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        width: "100%",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            "width": 40,
            "height": 40,
            "border": "3px solid",
            "borderColor": "divider",
            "borderTopColor": "primary.main",
            "borderRadius": "50%",
            "animation": "spin 0.8s linear infinite",
            "mx": "auto",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      </Box>
    </Box>
  );
}

/** Card-grid skeleton for dashboard */
export function DashboardCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ width: "100%" }}
    >
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          sx={{ flex: 1 }}
        >
          <Skeleton
            variant="rounded"
            width="100%"
            height={100}
            sx={{ borderRadius: "12px" }}
          />
        </Box>
      ))}
    </Stack>
  );
}

/** Timeline item skeleton for activity page */
export function ActivityTimelineSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box sx={{ pl: "40px", pr: "40px", pt: 2 }}>
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
        >
          <Skeleton
            variant="circular"
            width={36}
            height={36}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="rounded"
              width="100%"
              height={56}
              sx={{ borderRadius: "8px" }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
}
