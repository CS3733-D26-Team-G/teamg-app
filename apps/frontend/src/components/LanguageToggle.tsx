import { useTranslation } from "react-i18next";
import { Stack, Typography, Switch } from "@mui/material";
import { useState } from "react";

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === "es";
  const toggleLanguage = () => {
    i18n.changeLanguage(isSpanish ? "en" : "es");
  };

  const active = { fontWeight: "bold", color: "text.main" };
  const inactive = { fontWeight: "normal", color: "text.primary" };

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
    >
      <Typography sx={isSpanish ? inactive : active}>🇺🇸 EN</Typography>
      <Switch
        checked={isSpanish}
        onChange={toggleLanguage}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "white",
            opacity: 0.9,
          },
          "& .MuiSwitch-track": {
            backgroundColor: "white",
            opacity: 0.9,
          },
          "& .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb": {
            color: "white",
          },
        }}
      />

      <Typography sx={isSpanish ? active : inactive}>🇪🇸 ES</Typography>
    </Stack>
  );
};
