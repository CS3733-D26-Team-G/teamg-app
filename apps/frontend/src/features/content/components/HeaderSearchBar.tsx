import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import "./ContentHeader.css";

interface SearchBarProps {
  searchQuery?: string;
  onSearch?: (query: string) => void;
  setSearchQuery?: (query: string) => void;
  debounceMs?: number;
}

const SearchBar = ({
  searchQuery = "",
  onSearch,
  setSearchQuery,
  debounceMs,
}: SearchBarProps) => {
  const [draftQuery, setDraftQuery] = useState(searchQuery);
  const debounceTimeoutRef = useRef<number | null>(null);
  const onSearchRef = useRef(onSearch);
  const isDebouncedSearch = onSearch !== undefined && debounceMs !== undefined;

  useEffect(() => {
    setDraftQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (!isDebouncedSearch) return;

    debounceTimeoutRef.current = window.setTimeout(() => {
      onSearchRef.current?.(draftQuery);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debounceMs, draftQuery, isDebouncedSearch]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (debounceTimeoutRef.current !== null) {
      window.clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
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
            backgroundColor: "background.paper",
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
