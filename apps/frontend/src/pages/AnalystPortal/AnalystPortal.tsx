import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

const analystPortalSections = [
  "Role-specific dashboard widgets",
  "Workflow and requirements summaries",
  "Linked claim and document insights",
];

export default function AnalystPortalPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Stack
        spacing={3}
        sx={{ maxWidth: 960, mx: "auto" }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={700}
            color="white"
          >
            Analyst Portal
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}
          >
            Template page reserved for future analyst-facing workflows.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Planned structure</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                This placeholder keeps the route module structure in place
                without reviving the old abandoned implementation.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {analystPortalSections.map((section) => (
                  <Chip
                    key={section}
                    label={section}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
