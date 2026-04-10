import {
  Typography,
  Avatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Box,
} from "@mui/material";

function UnderWriterPortal() {
  return (
    <>
      <br />
      {/* Row Box of all Paper Components */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          width: "fit-content",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
        }}
      >
        {/* Avatar Paper Component */}
        <Paper
          elevation={2}
          sx={{
            width: 410,
            height: "680px",
            p: 2,
          }}
        >
          <Stack alignItems="center">
            <Avatar
              variant="square"
              sx={{ width: 200, height: 200 }}
            ></Avatar>
            <Typography variant={"h6"}>Underwriter</Typography>
          </Stack>
          <br />
          <br />
          <Typography>
            <b>My Goal:</b> Make informed underwriting decisions quickly and
            accurately.
          </Typography>
          <br />
          <Typography sx={{ fontWeight: "bold" }}>About My Role:</Typography>
          <Typography>
            I assess risk and ensure policies comply with guidelines. I rely on
            iBank for quick access to underwriting rules, filing information,
            and state-specific requirements. Accuracy and speed are critical
            because my decisions directly affect revenue and compliance.
          </Typography>
          <br /> <br />
          <Typography sx={{ fontWeight: "bold" }}>
            I May Think & Say...
          </Typography>
          <ul>
            <li>"What’s the eligibility guideline for this risk?"</li>
            <br />
            <li>"I need the latest flood underwriting rules."</li>
            <br />
            <li>"Is this filing approved for this state?"</li>
          </ul>
        </Paper>
        {/* Column Box of 'Critical Capabilities & Frequency of Access & Criticality' Paper Components*/}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            width: "fit-content",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/*Critical Capabilities Paper Component*/}
          <Paper
            elevation={2}
            sx={{
              width: 300,
              height: "260px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Critical Capabilities (1–5)
            </Typography>
            <ul>
              <li>Integrated Thinking: 4</li>
              <br />
              <li>Change Readiness: 3</li>
              <br />
              <li>Consultative: 3</li>
              <br />
              <li>Business / IT Fluency: 3</li>
              <br />
              <li>Shift Left Mindset: 2</li>
              <br />
              <li>Peer Networking: 3</li>
            </ul>
          </Paper>
          {/*Frequency of Access & Criticality Paper Component*/}
          <Paper
            elevation={2}
            sx={{
              width: 300,
              height: "260px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Frequency of Access & Criticality
            </Typography>
            <ul>
              <li>Access: Daily</li>
              <br />
              <li>
                Criticality: Very High — inability to access guidelines halts
                underwriting
              </li>
            </ul>
          </Paper>
        </Box>
        {/* Column Box of 'Skills & Typical Traits' Paper Components*/}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            width: "fit-content",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/*Skills Paper Component*/}
          <Paper
            elevation={2}
            sx={{
              width: 300,
              height: "260px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Skills</Typography>
            <ul>
              <li>Risk assessment</li>
              <br />
              <li>Regulatory compliance</li>
              <br />
              <li>Decision-making under pressure</li>
              <br />
              <li>Attention to detail</li>
            </ul>
          </Paper>
          {/*Typical Traits Paper Component*/}
          <Paper
            elevation={2}
            sx={{
              width: 300,
              height: "260px",
              p: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>Typical Traits</Typography>
            <ul>
              <li>Analytical</li>
              <br />
              <li>Precise</li>
              <br />
              <li>Deadline-driven</li>
            </ul>
          </Paper>
        </Box>
        {/* Useful Links Paper Component */}
        <Paper
          elevation={2}
          sx={{
            width: 340,
            height: "650px",
            p: 2,
          }}
        >
          <Typography sx={{ fontWeight: "bold" }}>Useful Links:</Typography>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Desktop Management Tool"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"States on Hold"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"RiskMeter Online"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"ISOnet Website"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Forms Knowledge Base"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Experience & Schedule Rating Plans"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Property View"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Coastal Guidelines"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"IPS (Image & Processing System)"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Underwriting Workstation"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default UnderWriterPortal;
