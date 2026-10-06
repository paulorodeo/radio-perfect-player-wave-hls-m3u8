import luto from "../assets/blog-luto.jpg";
import rodeio from "../assets/blog-rodeio.jpg";
import premiacoes from "../assets/blog-premiacoes.jpg";
import palco from "../assets/blog-palco.jpg";
import vinil from "../assets/blog-vinil.jpg";
import americana from "../assets/blog-americana.jpg";
import type { PostCategory } from "./posts";

/** Ilustrações editoriais próprias (não são fotos reais de artistas). */
const byCategory: Record<PostCategory, string> = {
  Luto: luto,
  Rodeio: rodeio,
  Premiações: premiacoes,
  Nashville: palco,
  Turnês: palco,
  Artistas: palco,
  Charts: vinil,
  Lançamentos: vinil,
  Americana: americana,
};

export function getPostImage(category: PostCategory): string {
  return byCategory[category];
}

export function coverStyle(category: PostCategory) {
  return {
    backgroundImage: `linear-gradient(180deg, rgba(8,6,4,0.15) 0%, rgba(8,6,4,0.85) 100%), url(${getPostImage(category)})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
