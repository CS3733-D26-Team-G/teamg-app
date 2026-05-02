import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "./ContentHeader.css";

interface SearchBarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
  setSearchQuery?: (query: string) => void;
}

const SearchBar = ({
  searchQuery = "",
  onSearch,
  setSearchQuery,
}: SearchBarProps) => {
  const [draftQuery, setDraftQuery] = useState(searchQuery);

  useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (onSearch ?? setSearchQuery)?.(draftQuery);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <TextField
          id="search-bar"
          placeholder="search"
          variant="outlined"
          size="small"
          color="primary"
          fullWidth
          value={draftQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const nextQuery = e.target.value;
            setDraftQuery(nextQuery);
            if (!onSearch) {
              setSearchQuery?.(nextQuery);
            }
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: "4px",
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
};

export default SearchBar;
