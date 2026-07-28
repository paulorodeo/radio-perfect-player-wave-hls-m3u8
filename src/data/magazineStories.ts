export interface MagazineStory {
  id: string;
  category: string;
  title: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  href?: string;
}

export const magazineLead: MagazineStory = {
  id: "lead-1",
  category: "COUNTRY",
  title: "Nashville's New Golden Hour: The Rise of Neo-Traditional Country",
  excerpt:
    "An editorial deep-dive into the sounds and voices shaping country music this season, straight from Music City.",
  author: "Maren Hollis",
  publishedAt: "27 de Jul.",
  readingTime: "4 min",
  image:
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1600&q=80",
  imageAlt: "Country concert stage with lights and audience",
};

export const magazineSideStories: MagazineStory[] = [
  {
    id: "side-1",
    category: "AGRONEJO",
    title: "O Novo Sertanejo: Entre a Modinha e o Palco Global",
    author: "Maren Hollis",
    publishedAt: "27 de Jul.",
    readingTime: "4 min",
    image:
      "https://images.unsplash.com/photo-1505322747495-6afdd3b70760?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Editorial landscape scene with warm tones",
  },
  {
    id: "side-2",
    category: "NASHVILLE",
    title: "The Voices Reshaping Country Music Beyond the Billboard",
    author: "Rafael Lima",
    publishedAt: "25 de Jul.",
    readingTime: "5 min",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Close-up of a vintage microphone on a dark stage",
  },
];
