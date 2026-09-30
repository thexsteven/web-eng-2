const response = {
  data: {
    user: {
      id: 42,
      profile: {
        bio: "Entwickler aus Stuttgart",
        social: {
          github: "maxdev",
          // twitter fehlt absichtlich
        },
      },
      posts: [
        { title: "Erster Post", tags: ["javascript", "react"] },
        { title: "Zweiter Post" }, // tags fehlt absichtlich
      ],
    },
  },
};

// 1. Bio des Users oder "Keine Bio"
const bio = response.data?.user?.profile?.bio ?? "Keine Bio";

// 2. Twitter-Handle oder "Nicht verknüpft"
const twitter = response.data?.user?.profile?.social?.twitter ?? "Nicht verknüpft";

// 3. Erster Tag des zweiten Posts oder "Kein Tag"
const firstTag = response.data?.user?.posts?.[1]?.tags?.[0] ?? "Kein Tag";

// 4. Nicht existierende Eigenschaft settings.theme oder "light"
const theme = response.data?.user?.settings?.theme ?? "light";

console.log("1.", bio);
console.log("2.", twitter);
console.log("3.", firstTag);
console.log("4.", theme);
