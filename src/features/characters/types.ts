// Types for the Rick and Morty API
// API docs: https://rickandmortyapi.com/documentation

// The API wraps list responses in a paginated envelope
// LEARNING NOTE: Generic types like PaginatedResponse<T> let you reuse
// the same pagination shape for characters, locations, episodes, etc.
export interface PaginatedResponse<T> {
  info: {
    count: number;   // total items across all pages
    pages: number;   // total number of pages
    next: string | null;   // URL of next page (null if last)
    prev: string | null;   // URL of previous page (null if first)
  };
  results: T[];
}

export interface CharacterLocation {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;        // sub-species (often empty string)
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown';
  origin: CharacterLocation;
  location: CharacterLocation;
  image: string;       // URL to character portrait (300x300)
  episode: string[];   // array of episode URLs the character appeared in
  url: string;
  created: string;     // ISO date string
}

// Query params the API accepts for filtering characters
export interface CharacterFilters {
  page?: number;
  name?: string;
  status?: Character['status'] | '';
  gender?: Character['gender'] | '';
}
