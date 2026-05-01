import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Link,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const dependencies = [
  {
    name: "Supabase",
    version: "2.101.1",
    tag: "Backend",
    blurb:
      "Open-source Firebase alternative providing a Postgres database, authentication, storage, and real-time subscriptions.",
    logo: "/supabaselogo.jpg",
    url: "https://supabase.com/docs",
  },
  {
    name: "Express",
    version: "5.2.1",
    tag: "Backend",
    blurb:
      "Node.js web application framework providing a wide set of features for web and API applications.",
    logo: "/ExpressLogo.png",
    url: "https://expressjs.com/",
  },
  {
    name: "Multer",
    version: "2.1.1",
    tag: "Backend",
    blurb:
      "Node.js middleware for handling multipart/form-data, primarily used for file uploads in Express applications.",
    logo: "/ExpressLogo.png",
    url: "https://github.com/expressjs/multer",
  },
  {
    name: "PostgreSQL",
    version: "18.3",
    tag: "Database",
    blurb:
      "Open-source relational database with over 35 years of active development.",
    logo: "/PostgreSQL-Logo.wine.png",
    url: "https://www.postgresql.org/docs/",
  },
  {
    name: "Prisma",
    version: "7.6.0",
    tag: "ORM",
    blurb:
      "ORM for Node.js and TypeScript with data model, migrations, and a type-safe query builder.",
    logo: "/PrismaLogo.png",
    url: "https://www.prisma.io/docs",
  },
  {
    name: "MUI",
    version: "7.3.9",
    tag: "UI Library",
    blurb:
      "Comprehensive suite of React UI components implementing Google's Material Design, with theming support.",
    logo: "/MUILogo.png",
    url: "https://mui.com/getting-started/overview/",
  },
  {
    name: "react-doc-viewer",
    version: "1.17.1",
    tag: "UI Library",
    blurb:
      "React component for rendering a wide range of document formats directly in the browser.",
    logo: "/reactLogo.png",
    url: "https://github.com/cyntler/react-doc-viewer",
  },
  {
    name: "Tailwind CSS",
    version: "4.2.2",
    tag: "Styling",
    blurb:
      "Utility-first CSS framework for building custom designs without leaving your HTML.",
    logo: "/TailWindLogo.png",
    url: "https://tailwindcss.com/docs",
  },
  {
    name: "Lucide",
    version: "1.8.0",
    tag: "Icons",
    blurb:
      "An open-source icon library with over 1,000 SVG icons, available as React components.",
    logo: "/LucideLogo.jpg",
    url: "https://lucide.dev/guide/",
  },
  {
    name: "Framer Motion",
    version: "12.38.0",
    tag: "Animation",
    blurb:
      "Animation library for React, enabling gestures, layout animations, and complex motion sequences.",
    logo: "/FramerLogo.png",
    url: "https://www.framer.com/motion/",
  },
  {
    name: "React Router",
    version: "17.13.2",
    tag: "Routing",
    blurb:
      "Declarative routing library for React enabling navigation between views, nested routes, and URL-driven UI state.",
    logo: "/ReactRouterLogo.png",
    url: "https://reactrouter.com/en/main",
  },
  {
    name: "Apryse",
    version: "11.12.0",
    tag: "Documents",
    blurb:
      "SDK for viewing, editing, annotating, and processing PDFs and documents across web and mobile platforms.",
    logo: "/ApryseLogo.png",
    url: "https://docs.apryse.com/",
  },
  {
    name: "i18next",
    version: "26.0.6",
    tag: "i18n",
    blurb:
      "Internationalization framework for JavaScript with extensive plugin support, enabling multi-language applications.",
    logo: "/i18nextLogo.png",
    url: "https://www.i18next.com/",
  },
  {
    name: "react-i18next",
    version: "17.0.4",
    tag: "i18n",
    blurb:
      "i18next binding for React, providing hooks and components for translation in React applications.",
    logo: "/i18nextLogo.png",
    url: "https://react.i18next.com/",
  },
  {
    name: "npm",
    version: "11.12.1",
    tag: "Tooling",
    blurb:
      "The default package manager for Node.js, used to install, share, and manage JavaScript dependencies and scripts.",
    logo: "/npmLogo.png",
    url: "https://www.npmjs.com",
  },
  {
    name: "cross-env",
    version: "10.1.0",
    tag: "Tooling",
    blurb:
      "Sets environment variables cross-platform so the same npm scripts work on Windows, macOS, and Linux.",
    logo: "/npmLogo.png",
    url: "https://www.npmjs.com/package/cross-env",
  },
  {
    name: "dotenv",
    version: "17.4.0",
    tag: "Tooling",
    blurb:
      "Loads environment variables from a .env file into process.env, keeping secrets and config out of source code.",
    logo: "/envLogo.png",
    url: "https://github.com/motdotla/dotenv",
  },
  {
    name: "FullCalendar",
    version: "17.4.0",
    tag: "Tooling",
    blurb:
      "Loads environment variables from a .env file into process.env, keeping secrets and config out of source code.",
    logo: "/FullCalendar.png",
    url: "https://fullcalendar.io/docs/react",
  },
];

export default function Credits() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, fontFamily: "'Rubik', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap');
        * { font-family: 'Rubik', sans-serif !important; }`}
      </style>

      <Typography
        variant="h5"
        fontWeight={500}
        mb={0.5}
        sx={{ color: "white", fontFamily: "'Rubik', sans-serif" }}
      >
        Credits
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        mb={3}
        sx={{
          color: "white",
          lineHeight: 1.8,
          fontFamily: "'Rubik', sans-serif",
        }}
      >
        This website was developed using the <strong>PERN stack</strong>, which
        consists of <strong>PostgreSQL</strong>, a powerful open-source
        relational database; <strong>Express</strong>, a lightweight Node.js
        framework for building APIs; <strong>React</strong>, a JavaScript
        library for building dynamic user interfaces; and{" "}
        <strong>Node.js</strong>, a JavaScript runtime that powers the server.
        Together, these tools aided the development of this application. The
        additional libraries and packages listed below furthered this
        development by easing the implementation of various features.
      </Typography>

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        variant="outlined"
        size="small"
        sx={{
          color: "white",
          mb: 3,
          fontFamily: "'Rubik', sans-serif",
          border: "1px solid white",
        }}
      >
        Return
      </Button>

      <Typography
        variant="h6"
        fontWeight={500}
        mb={2}
        sx={{ color: "white", fontFamily: "'Rubik', sans-serif" }}
      >
        Libraries &amp; Dependencies
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {dependencies.map((dep) => (
          <Card
            key={dep.name}
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                flexGrow: 1,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
              >
                {dep.logo ?
                  <Box
                    component="img"
                    src={dep.logo}
                    alt={dep.name}
                    sx={{
                      width: 36,
                      height: 36,
                      objectFit: "contain",
                      borderRadius: 1,
                      flexShrink: 0,
                    }}
                  />
                : <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 500,
                      bgcolor: "action.hover",
                      flexShrink: 0,
                      fontFamily: "'Rubik', sans-serif",
                    }}
                  ></Box>
                }
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    lineHeight={1.2}
                    sx={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    {dep.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ fontFamily: "'Rubik', sans-serif" }}
                  >
                    v{dep.version}
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  lineHeight: 1.6,
                  fontFamily: "'Rubik', sans-serif",
                }}
              >
                {dep.blurb}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Chip
                  label={dep.tag}
                  size="small"
                  sx={{
                    fontSize: 11,
                    height: 22,
                    fontFamily: "'Rubik', sans-serif",
                  }}
                />
                <Link
                  href={dep.url}
                  target="_blank"
                  rel="noopener"
                  variant="caption"
                  underline="hover"
                  sx={{ fontFamily: "'Rubik', sans-serif" }}
                >
                  Docs →
                </Link>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
