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
        size="x-small"
        fullWidth // Added fullWidth so it fills your container
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
