import { coverStyle } from "../data/postImages";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import playerCss from "../styles/original-player.css?url";
import "../styles/blog.css";
import { LOGO_URL } from "../components/radio/RadioContext";
import { getPostBySlug, SITE_CTA, SITE_NAME, SITE_URL } from "../data/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: `Matéria não encontrada | ${SITE_NAME}` },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "stylesheet", href: playerCss }],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: post.seoTitle },
        { name: "description", content: post.metaDescription },
        { property: "og:title", content: post.seoTitle },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "stylesheet", href: playerCss },
        { rel: "canonical", href: `${SITE_URL}/blog/${post.slug}` },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: PostPage,
});

function PostNotFound() {
  return (
    <div className="blog-page">
      <div className="blog-shell">
        <div className="blog-empty">
          Esta matéria não existe ou foi movida.{" "}
          <Link to="/blog" className="blog-nav-link">
            Ver todas as matérias
          </Link>
        </div>
      </div>
    </div>
  );
}

function PostPage() {
  const { post } = Route.useLoaderData();

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
          </nav>
        </div>

        <article className="blog-article">
          <p className="blog-kicker">{post.category}</p>
          <h1 className="blog-article-title">{post.title}</h1>
          <p className="blog-article-meta">
            {post.author} · {post.publishedLabel} · {post.readingTime}
          </p>

          <div className="blog-card-cover blog-card-cover--lead" style={coverStyle(post.category)}>
            <span className="blog-cover-label">{post.category}</span>
            <span className="blog-cover-title">{post.tags[0] ?? post.category}</span>
            <span className="blog-cover-brand">{SITE_NAME}</span>
          </div>

          <aside className="blog-summary">
            <h2 className="blog-summary-title">Em resumo</h2>
            <ul>
              {post.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>

          {post.sections.map((section, i) => (
            <section key={section.heading ?? i} className="blog-section">
              {section.heading ? (
                <h2 className="blog-section-heading">{section.heading}</h2>
              ) : null}
              {section.paragraphs.map((p) => (
                <p key={p} className="blog-paragraph">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <p className="blog-cta">{SITE_CTA}</p>

          <section className="blog-sources">
            <h2 className="blog-section-heading">Fontes</h2>
            <ul>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <p className="blog-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="blog-tag">
                {tag}
              </span>
            ))}
          </p>

          <Link to="/blog" className="blog-nav-link">
            ← Todas as matérias
          </Link>
        </article>

        <footer className="blog-footer">© 2026 - BY PAULO RODEO</footer>
      </div>
    </div>
  );
}
