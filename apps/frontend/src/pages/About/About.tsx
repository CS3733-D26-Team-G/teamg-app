import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const teamMembers = [
  {
    name: "Myer Cheng",
    position: "Lead Software Engineer",
    photo: "/Myer.png",
    quote: `"In the midst of chaos, there is also opportunity"\n - Sun Tzu, The Art of War`,
  },

  {
    name: "Tj Elysee",
    position: "Product Owner",
    photo: "/Tj.jpg",
    quote: `"I can do all things through him who strengthens me"\n - Philippians 4:13`,
  },

  {
    name: "Shriya Kulkarni",
    position: "Lead Back-End Developer",
    photo: "/Shriya.jpg",
    quote: `"But I suppose a fox's duty is to be... well, a fox."\n - Mr. Fox, Fantastic Mr. Fox`,
  },

  {
    name: "Justin Gauthier",
    position: "Project Manager",
    photo: "/Justin.jpg",
    quote:
      '"Without pain, without sacrifice, we would have nothing"\n - Tyler Durden/ Chuck Palahniuk',
  },

  {
    name: "Colin Truong",
    position: "Lead Front-End Developer",
    photo: "/Colin.jpg",
    quote: `"That's rough buddy"\n - Prince Zuko, Son of Ozai `,
  },

  {
    name: "Isaac Gonzalez",
    position: "Documentation",
    photo: "/Isaac.png",
    quote: `"Keep Moving Forward."\n- Cornelius Robinson`,
  },

  {
    name: "Jillian Chee",
    position: "Full-Time Software Engineer",
    photo: "/Jillian.png",
    quote: `"Just be a rock."\n- Joy Wang Everything Everywhere All At Once`,
  },

  {
    name: "Thomas Gilbert",
    position: "Scrum Master",
    photo: "/Thomas.jpg",
    quote: `"I wish there was a way to know you're in the good old days before you've actually left them."\n- Andy Bernard`,
  },

  {
    name: "Sam Rodrigues",
    position: "Full-Time Software Engineer",
    photo: "/Sam.png",
    quote: `"If you don't like something, change it. If you can't change it, change your attitude."\n - Maya Angelou`,
  },

  {
    name: "Ronan Heatley",
    position: "Full-Time Software Engineer",
    photo: "/Ronan.png",
    quote:
      "“A man that fears suffering is already suffering from what he fears.”\n- Michel de Montaigne",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, fontFamily: "'Rubik', sans-serif" }}>
      <style></style>

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
          sx={{ position: "absolute", left: 0, top: 0, color: "white" }}
        >
          Return to Home
        </Button>

        <Box sx={{ width: "100%", textAlign: "center", color: "white" }}>
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
            mb={0.25}
            sx={{ color: "white" }}
          >
            Prof. Wilson Wong
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "white" }}
          >
            Team Coach: Katherine Tse
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2 }}
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
                  <Tooltip
                    title={member.quote}
                    arrow
                    placement="bottom"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: "1rem",
                          maxWidth: 400,
                          p: 1.5,
                          whiteSpace: "pre-line",
                          textAlign: "center",
                        },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={member.photo}
                      alt={member.name}
                      sx={{
                        "width": 90,
                        "height": 90,
                        "borderRadius": 2,
                        "objectFit": "cover",
                        "flexShrink": 0,
                        "cursor": "pointer",
                        "transition":
                          "transform 0.15s ease, box-shadow 0.15s ease",
                        "&:hover": {
                          transform: "scale(1.06)",
                        },
                        "&:active": { transform: "scale(0.97)" },
                      }}
                    />
                  </Tooltip>
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
                      color="black"
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
          align="center"
          sx={{
            color: "white",
            fontSize: 25,
            fontFamily: '"Rubik", sans-serif',
          }}
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
