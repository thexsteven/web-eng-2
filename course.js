const movies = [
  { title: "Dune", year: 2021, rating: 8, genres: ["Sci-Fi", "Action"] },
  { title: "The Matrix", year: 1999, rating: 8.7, genres: ["Sci-Fi", "Thriller"] },
  { title: "Inception", year: 2010, rating: 8.8, genres: ["Sci-Fi", "Thriller"] },
  { title: "Pulp Fiction", year: 1994, rating: 8.9, genres: ["Crime", "Drama"] },
  { title: "Oppenheimer", year: 2023, rating: 8.5, genres: ["Drama", "History"] },
];

// 1. Alle Filme ab dem Jahr 2000
const since2000 = movies.filter((movie) => movie.year >= 2000);
console.log("1.", since2000);

// 2. Film mit der besten Bewertung
 const best = movies.reduce((acc, movie) => (movie.rating > acc.rating ? movie : acc));
 console.log("2.", best);

// 3. Array nur der Titel
 const titles = movies.map((movie) => movie.title);
 console.log("3.", titles);

// 4. Durchschnittliche Bewertung (reduce)
 const average = movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length;
 console.log("4.", average);

// 5. Titel der Sci-Fi-Filme (filter -> map)
 const sciFiTitles = movies.filter((movie) => movie.genres.includes("Sci-Fi")).map((movie) => movie.title);
 console.log("5.", sciFiTitles);