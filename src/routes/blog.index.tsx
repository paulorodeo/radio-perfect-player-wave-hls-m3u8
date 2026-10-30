import { coverStyle } from "../data/postImages";
import { createFileRoute, Link } from "@tanstack/react-router";
import playerCss from "../styles/original-player.css?url";
import "../styles/blog.css";
import { LOGO_URL } from "../components/radio/RadioContext";
import { posts, SITE_CTA, SITE_NAME } from "../data/posts";

const DESCRIPTION =
  "Notícias, bastidores e reportagens do universo country e do rodeio, pela redação da Fazenda Rodeo Radio.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: `Blog | ${SITE_NAME}` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: `Blog | ${SITE_NAME}` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://radio.fazenda.rodeo/blog" },
      { name: "twitter:title", content: `Blog | ${SITE_NAME}` },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: playerCss }, { rel: "canonical", href: "https://radio.fazenda.rodeo/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const [lead, ...rest] = posts;

  return (
    <div className="blog-page">
      <div className="blog-shell">
        <div className="blog-topbar">
          <div className="blog-brand">
            <img src={LOGO_URL} alt={SITE_NAME} />
          </div>
          <nav className="blog-nav">
            <Link to="/" className="blog-nav-link">
              Início
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
          <p className="blog-kicker">Redação</p>
          <h1 className="blog-title">Notícias country, direto do estúdio</h1>
          <p className="blog-subtitle">{SITE_CTA}</p>
        </header>

        {lead ? (
          <Link
            to="/blog/$slug"
            params={{ slug: lead.slug }}
            className="blog-card blog-card--lead"
          >
            <div className="blog-card-cover blog-card-cover--lead" style={coverStyle(lead.category)}>
              <span className="blog-cover-label">{lead.category}</span>
              <span className="blog-cover-title">{lead.tags[0] ?? lead.category}</span>
              <span className="blog-cover-brand">{SITE_NAME}</span>
            </div>
            <div className="blog-card-body">
              <p className="blog-card-meta">
                {lead.category} · {lead.publishedLabel} · {lead.readingTime}
              </p>
              <h2 className="blog-card-title">{lead.title}</h2>
              <p className="blog-card-excerpt">{lead.excerpt}</p>
            </div>
          </Link>
        ) : null}

        <div className="blog-grid">
          {rest.map((post) => (
            <Link
              key={post.id}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="blog-card"
            >
              <div className="blog-card-cover" style={coverStyle(post.category)}>
                <span className="blog-cover-label">{post.category}</span>
                <span className="blog-cover-title">{post.tags[0] ?? post.category}</span>
                <span className="blog-cover-brand">{SITE_NAME}</span>
              </div>
              <div className="blog-card-body">
                <p className="blog-card-meta">
                  {post.category} · {post.publishedLabel} · {post.readingTime}
                </p>
                <h2 className="blog-card-title">{post.title}</h2>
                <p className="blog-card-excerpt">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        <footer className="blog-footer">© 2026 - BY PAULO RODEO</footer>
      </div>
    </div>
  );
}
