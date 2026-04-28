import { type ChangeEvent } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "../Management/ContentHeader.css";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ setSearchQuery }: SearchBarProps) => (
  <div className="search-container">
    <form onSubmit={(e) => e.preventDefault()}>
      <TextField
        id="search-bar"
        placeholder="search"
        variant="outlined"
        size="small"
        sx={{
          width: "90%",
          marginLeft: "24px",
          backgroundColor: "white",
          borderRadius: "4px", // Matches default MUI radius
        }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setSearchQuery(e.target.value);
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
