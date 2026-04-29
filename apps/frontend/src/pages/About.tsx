import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const teamMembers = [
  {
    name: "Myer Cheng",
    position: "Lead Software Engineer",
    photo: "/Myer.png",
  },
  { name: "Tj Elysee", position: "Product Owner", photo: "/Tj.jpg" },
  {
    name: "Shriya Kulkarni",
    position: "Lead Back-End Developer",
    photo: "/Shriya.jpg",
  },
  {
    name: "Justin Gauthier",
    position: "Project Manager",
    photo: "/Justin.jpg",
  },
  {
    name: "Colin Truong",
    position: "Lead Front-End Developer",
    photo: "/Colin.jpg",
  },
  { name: "Isaac Gonzalez", position: "Documentation", photo: "/Isaac.png" },
  {
    name: "Jillian Chee",
    position: "Full-Time Software Engineer",
    photo: "/Jillian.png",
  },
  { name: "Thomas Gilbert", position: "Scrum Master", photo: "/Thomas.jpg" },
  {
    name: "Sam Rodrigues",
    position: "Full-Time Software Engineer",
    photo: "/Sam.png",
  },
  {
    name: "Ronan Heatley",
    position: "Full-Time Software Engineer",
    photo: "/Ronan.png",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, fontFamily: "'Rubik', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600&display=swap');
        * { font-family: 'Rubik', sans-serif !important; }`}
      </style>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="outlined"
          size="small"
          sx={{
            color: "white",
            border: "1px solid white",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        >
          Return to Home
        </Button>

        <Box sx={{ width: "100%", textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={0.5}
            sx={{ color: "white" }}
          >
            WPI Computer Science Department
          </Typography>
          <Typography
            variant="h6"
            fontWeight={500}
            mb={0.5}
            sx={{ color: "white" }}
          >
            CS3733-D26 Software Engineering
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={0.25}
            sx={{ color: "white" }}
          >
            Prof. Wilson Wong
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ color: "white" }}
          >
            Team Coach: Katherine Tse
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
        }}
      >
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{ borderRadius: 2, height: "100%" }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
              >
                {member.photo ?
                  <Box
                    component="img"
                    src={member.photo}
                    alt={member.name}
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 2,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                : <Box
                    sx={{
                      width: 90,
                      height: 90,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      border: "1px dashed",
                      borderColor: "divider",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.disabled"
                    >
                      Photo
                    </Typography>
                  </Box>
                }

                <Stack spacing={0.5}>
                  <Typography
                    variant="body1"
                    fontWeight={500}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {member.position}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 3,
          minHeight: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          color="black"
          align="center"
          sx={{ color: "white" }}
        >
          Thank you to Hanover Insurance for the opportunity to develop real
          world full-stack web development experience by allowing us to use your
          platform. We would like to extend a specific thank you to Brandon
          Roche and Meaghan Jenket for making this possible.
        </Typography>
      </Box>
    </Box>
  );
}
