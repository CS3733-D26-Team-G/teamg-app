import { type ChangeEvent } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "./ContentHeader.css";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ setSearchQuery }: SearchBarProps) => (
  <div className="search-container">
    {/* Add onSubmit to prevent page reloads */}
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        id="search-bar"
        placeholder="search"
        variant="outlined"
        size="small"
        color="primary"
        fullWidth // Added fullWidth so it fills container
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: "4px", // Matches default MUI radius
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
    </form>
  </div>
);

export default SearchBar;
