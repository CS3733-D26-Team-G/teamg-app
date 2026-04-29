import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

const underwriterPortalSections = [
  "Submission triage",
  "Risk review shortcuts",
  "Guideline and approval references",
];

export default function UnderwriterPortalPage() {
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
            Underwriter Portal
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, color: "rgba(255, 255, 255, 0.8)" }}
          >
            Template page reserved for future underwriter-facing workflows.
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
                This placeholder restores the page module scaffold while keeping
                the implementation intentionally lightweight.
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                flexWrap="wrap"
              >
                {underwriterPortalSections.map((section) => (
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
