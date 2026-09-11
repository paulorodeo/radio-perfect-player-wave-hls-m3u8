import { Link } from "@tanstack/react-router";
import "../../styles/magazine.css";
import { featuredPost, secondaryPosts, type Post } from "../../data/posts";

function MagazineMeta({ story }: { story: Post }) {
  return (
    <p className="magazine-meta">
      <span>{story.author}</span>
      <span>{story.publishedLabel}</span>
      <span>{story.readingTime}</span>
    </p>
  );
}

function MagazineCover({ story, variant }: { story: Post; variant: "lead" | "side" }) {
  return (
    <div className={`magazine-cover magazine-cover--${variant}`} aria-hidden="true">
      <span className="magazine-cover-label">{story.category}</span>
      <span className="magazine-cover-title">{story.title}</span>
      <span className="magazine-cover-brand">Fazenda Rodeo Radio</span>
    </div>
  );
}

function MagazineLeadStory() {
  return (
    <article className="magazine-lead">
      <Link
        to="/blog/$slug"
        params={{ slug: featuredPost.slug }}
        className="magazine-link"
      >
        <MagazineCover story={featuredPost} variant="lead" />
      </Link>
      <p className="magazine-category">{featuredPost.category}</p>
      <h2 className="magazine-headline">
        <Link
          to="/blog/$slug"
          params={{ slug: featuredPost.slug }}
          className="magazine-link"
        >
          {featuredPost.title}
        </Link>
      </h2>
      <p className="magazine-excerpt">{featuredPost.excerpt}</p>
      <MagazineMeta story={featuredPost} />
    </article>
  );
}

function MagazineSideStory({ story }: { story: Post }) {
  return (
    <article className="magazine-side-story">
      <Link to="/blog/$slug" params={{ slug: story.slug }} className="magazine-link">
        <MagazineCover story={story} variant="side" />
      </Link>
      <p className="magazine-category">{story.category}</p>
      <h3 className="magazine-side-headline">
        <Link to="/blog/$slug" params={{ slug: story.slug }} className="magazine-link">
          {story.title}
        </Link>
      </h3>
      <MagazineMeta story={story} />
    </article>
  );
}

export function MagazineSection() {
  return (
    <section className="magazine-section">
      <div className="magazine-container">
        <div className="magazine-topline">
          <h2 className="magazine-section-title">Notícias Country</h2>
          <Link to="/blog" className="magazine-all-link">
            Ver todas as matérias
          </Link>
        </div>
        <div className="magazine-grid">
          <MagazineLeadStory />
          <div className="magazine-side-column">
            {secondaryPosts.map((story) => (
              <MagazineSideStory key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
