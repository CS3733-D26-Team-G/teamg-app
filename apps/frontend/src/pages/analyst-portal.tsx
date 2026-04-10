import {
  Typography,
  Avatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Box,
} from "@mui/material";

function AnalystPortal() {
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
            <Typography variant={"h6"}>Business Analyst</Typography>
          </Stack>
          <br />
          <br />
          <Typography>
            <b>My Goal:</b> Ensure accurate documentation and seamless process
            integration.
          </Typography>
          <br />
          <Typography sx={{ fontWeight: "bold" }}>About My Role:</Typography>
          <Typography>
            I validate workflows and system entry procedures. I use iBank to
            confirm updates and answer end-user questions. My role ensures
            smooth integration between business processes and technology.
          </Typography>
          <br /> <br />
          <Typography sx={{ fontWeight: "bold" }}>
            I May Think & Say...
          </Typography>
          <ul>
            <li>
              "Does this procedure reflect the latest system enhancement?"
            </li>
            <br />
            <li>"I need to confirm the ACT guide before responding."</li>
            <br />
            <li>"How do we streamline this workflow?"</li>
          </ul>
        </Paper>
        {/* Column Box of 'Critical Capabilities & Frequency of Access & Criticality & Content Accessed' Paper Components*/}
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
              <li>Change Readiness: 4</li>
              <br />
              <li>Consultative: 4</li>
              <br />
              <li>Business / IT Fluency: 4</li>
              <br />
              <li>Shift Left Mindset: 3</li>
              <br />
              <li>Peer Networking: 4</li>
            </ul>
          </Paper>
          {/*Frequency of Access & Criticality + Content Accessed Paper Component*/}
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
              <li>Access: Weekly</li>
              <br />
              <li>
                Criticality: High — incorrect workflows disrupt operations
              </li>
            </ul>
            <br />
            <Typography sx={{ fontWeight: "bold" }}>
              Content Accessed
            </Typography>
            <ul>
              <li>User reference guides</li>
              <br />
              <li>System entry procedures</li>
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
              <li>Workflow analysis</li>
              <br />
              <li>System validation</li>
              <br />
              <li>Communication</li>
              <br />
              <li>Problem-solving</li>
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
              <li>Collaborative</li>
              <br />
              <li>Detail-oriented</li>
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
                primary={"States on Hold"}
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
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"CPP Rater Resource Site"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"PMS URG"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Kentucky Tax and Tax Exemption Job Aid"}
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
                primary={"Error Lookup Tool"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
            <ListItemButton
              component={"a"}
              href={"#"}
            >
              <ListItemText
                primary={"Workaround Tool"}
                sx={{ "& .MuiListItemText-primary": { color: "blue" } }}
              />
            </ListItemButton>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default AnalystPortal;
