import { Box, Stack, Typography, Link as MuiLink } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "primary.main",
        color: "white",
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "100%",
          //paddingX: "17rem",
          justifyContent: "space-between",
          alignItems: "flex-start",
          fontSize: "1.2rem",
        }}
      >
        <Stack
          className="browser-stack"
          direction="column"
          spacing={1}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.5rem",
            }}
          >
            <b>Browser</b>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999"
              color="inherit"
            >
              Home
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/AboutUs"
              color="inherit"
            >
              About Us
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/GuideTour"
              color="inherit"
            >
              Guide Tour
            </MuiLink>
          </Typography>
        </Stack>
        <Stack
          className="employee-access-stack"
          direction="column"
          spacing={1}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.5rem",
            }}
          >
            <b>Employee Access</b>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/EmployeePortal"
              color="inherit"
            >
              Employee Portal
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/EmployeePortal/HR-Self-Service"
              color="inherit"
            >
              HR-Self Service
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/EmployeePortal/News-&-Updates"
              color="inherit"
            >
              News & Updates
            </MuiLink>
          </Typography>
        </Stack>
        <Stack
          className="support-stack"
          direction="column"
          spacing={1}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.5rem",
            }}
          >
            <b>Support</b>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/FAQ"
              color="inherit"
            >
              FAQ
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/ITSupport"
              color="inherit"
            >
              IT Support
            </MuiLink>
          </Typography>
        </Stack>
        <Stack
          className="legal-&-security-stack"
          direction="column"
          spacing={1}
          alignItems="center"
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.5rem",
            }}
          >
            <b>Legal & Security</b>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/PrivacyPolicy"
              color="inherit"
            >
              Privacy Policy
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/TermsOfUse"
              color="inherit"
            >
              Terms of Use
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/CookiePolicy"
              color="inherit"
            >
              Cookie Policy
            </MuiLink>
          </Typography>
          <Typography variant="body2">
            <MuiLink
              href="http://localhost:9999/Accessibility"
              color="inherit"
            >
              Accessibility
            </MuiLink>
          </Typography>
        </Stack>
        <Stack
          className="contact-us-stack"
          direction="column"
          alignItems="flex-start"
          spacing={1}
          sx={{
            marginTop: "1rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
            }}
          >
            <b>Contact Us</b>
          </Typography>
          <Stack
            className="email-stack"
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              fontSize: "1.8rem",
            }}
          >
            <img
              src="/email-icon.png"
              alt="Email Icon"
              style={{
                width: "40px",
                height: "40px",
                mixBlendMode: "multiply",
              }}
            />
            <Typography variant="body2">
              <MuiLink
                href="mailto:teamG@welit.com"
                target="_blank"
                color="inherit"
              >
                teamG@welit.com
              </MuiLink>
            </Typography>
          </Stack>
          <Stack
            className="phone-stack"
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              fontSize: "1.8rem",
            }}
          >
            <img
              src="/phone-icon.png"
              alt="Phone Icon"
              style={{
                width: "33px",
                height: "33px",
                mixBlendMode: "multiply",
              }}
            />
            <Typography variant="body2">
              <MuiLink
                href="+1-800-TEAM-G"
                target="_blank"
                color="inherit"
              >
                1-800-TEAM-G
              </MuiLink>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        className="copy-rights-&-awwards-stack"
        direction="column"
        spacing={1}
        alignItems="center"
        sx={{
          marginTop: "3rem",
        }}
      >
        <Stack
          className="awards-stack"
          direction="row"
          spacing={5}
          alignItems="center"
        >
          <img
            src="/best-company-award.png"
            alt="Best Company Award"
            style={{
              width: "80px",
              height: "80px",
            }}
          />
          <img
            src="/disability-award.png"
            alt="Disability Award"
            style={{
              width: "120px",
              height: "50px",
            }}
          />
          <img
            src="/equality-award.png"
            alt="Equalink Award"
            style={{
              width: "95px",
              height: "65px",
            }}
          />
        </Stack>

        <Typography
          variant="body2"
          sx={{
            fontSize: "1rem",
            marginTop: "2rem",
            opacity: 0.7,
          }}
          align="center"
        >
          © 2026 The Hangover Insurance Group, Team G Prototype Inc. All rights
          reserved.
        </Typography>
      </Stack>
    </Box>
  );
}
