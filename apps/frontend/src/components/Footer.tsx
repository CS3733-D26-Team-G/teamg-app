import { Box, Stack, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "primary.main",
        color: "white",
        width: "100%",
        position: "relative",
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          paddingX: "5rem",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Stack
          className="browser-stack"
          direction="column"
          spacing={1}
          alignItems="center"
        >
          <Typography variant="body2">
            <b>Browser</b>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999"
              target="_self"
              color="inherit"
            >
              Home
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/AboutUs"
              target="_self"
              color="inherit"
            >
              About Us
            </MuiLink>
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="h4"
            align="center"
          >
            I'm thinking of adding awards here or their motto or both. Let me
            know what you think?
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={15}
        >
          <Stack
            className="contact-stack"
            direction="column"
            spacing={1}
            alignItems="center"
          >
            <Typography variant="body2">
              <b>Contact</b>
            </Typography>
            <Typography variant="body2">
              <MuiLink
                href="https://maps.google.com/?q=440+Lincoln+Street+Worcester,+MA+01653"
                target="_blank"
                color="inherit"
              >
                Location
              </MuiLink>
            </Typography>
            <Typography variant="body2">
              <MuiLink
                href="mailto:Welit@teamg.com"
                target="_blank"
                color="inherit"
              >
                Email
              </MuiLink>
            </Typography>
            <Typography variant="body2">
              <MuiLink
                href="tel:+1-800-TEAM-G"
                target="_blank"
                color="inherit"
              >
                Phone Number
              </MuiLink>
            </Typography>
          </Stack>
          <Stack
            className="Support-stack"
            direction="column"
            spacing={1}
            alignItems="center"
          >
            <Typography variant="body2">
              <b>Support</b>
            </Typography>
            <Typography variant="body2">
              <MuiLink
                href="http://localhost:9999/FAQ"
                target="_self"
                color="inherit"
              >
                FAQ
              </MuiLink>
            </Typography>
            <Typography variant="body2">
              <MuiLink
                href="http://localhost:9999/ITSupport"
                target="_self"
                color="inherit"
              >
                IT Support
              </MuiLink>
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack
        className="legal-stack"
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{
          width: "100%",
          marginTop: "2rem",
          borderTop: "1px solid white",
          paddingTop: "1rem",
        }}
      >
        <Typography variant="body2">
          <MuiLink
            href="http://localhost:9999/PrivacyPolicy"
            target="_self"
            color="inherit"
          >
            Privacy Policy
          </MuiLink>
        </Typography>
        <Typography variant="body2">
          <MuiLink
            href="http://localhost:9999/TermsOfUse"
            target="_self"
            color="inherit"
          >
            Terms of Use
          </MuiLink>
        </Typography>
        <Typography variant="body2">
          <MuiLink
            href="http://localhost:9999/CookiePolicy"
            target="_self"
            color="inherit"
          >
            Cookie Policy
          </MuiLink>
        </Typography>
        <Typography variant="body2">
          <MuiLink
            href="http://localhost:9999/Accessibility"
            target="_self"
            color="inherit"
          >
            Accessibility
          </MuiLink>
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          width: "100%",
          marginTop: "0.5rem",
        }}
        align="center"
      >
        © 2026 The Hangover Insurance Group, Team G Prototype Inc. All rights
        reserved.
      </Typography>
    </Box>
  );
}
