import { createFileRoute, Link } from "@tanstack/react-router";
import playerCss from "../styles/original-player.css?url";
import "../styles/blog.css";
import { LOGO_URL } from "../components/radio/RadioContext";

/**
 * Payload CMS ready: replace `posts` with data coming from the Payload REST API
 * (e.g. `${PAYLOAD_URL}/api/posts?depth=1&limit=12`). The BlogPost shape below
 * mirrors a standard Payload "posts" collection.
 */
export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  coverUrl: string;
};

const posts: BlogPost[] = [];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | Honky Tonk Country Radio" },
      {
        name: "description",
        content:
          "Stories, interviews and features from the Honky Tonk country radio newsroom.",
      },
      { property: "og:title", content: "Blog | Honky Tonk Country Radio" },
      {
        property: "og:description",
        content:
          "Stories, interviews and features from the Honky Tonk country radio newsroom.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: playerCss }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="blog-page">
      <div className="blog-shell">
        <div className="blog-topbar">
          <div className="blog-brand">
            <img src={LOGO_URL} alt="Honky Tonk Country Radio" />
          </div>
          <nav className="blog-nav">
            <Link to="/" className="blog-nav-link">
              Home
            </Link>
            <Link to="/blog" className="blog-nav-link">
              Blog
            </Link>
            <a
              href="https://tv.fazenda.rodeo/"
              className="blog-nav-link"
              target="_blank"
              rel="noreferrer"
            >
              TV
            </a>
          </nav>
        </div>

        <header className="blog-header">
          <p className="blog-kicker">The Newsroom</p>
          <h1 className="blog-title">Country stories, straight from the studio</h1>
          <p className="blog-subtitle">
            Interviews, chart reports and long-form features. The radio keeps
            playing while you read.
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="blog-empty">
            No stories published yet. This page is wired and waiting for the
            Payload CMS content feed.
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <a key={post.id} className="blog-card" href={`/blog/${post.slug}`}>
                <img className="blog-card-media" src={post.coverUrl} alt="" />
                <div className="blog-card-body">
                  <p className="blog-card-meta">
                    {post.category} · {post.publishedAt}
                  </p>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        )}

        <footer className="blog-footer">© 2026 - BY PAULO RODEO</footer>
      </div>
    </div>
  );
}
