import "../../styles/magazine.css";
import { magazineLead, magazineSideStories, type MagazineStory } from "../../data/magazineStories";

function MagazineMeta({ story }: { story: MagazineStory }) {
  return (
    <p className="magazine-meta">
      <span>{story.author}</span>
      <span>{story.publishedAt}</span>
      <span>{story.readingTime}</span>
    </p>
  );
}

function MagazineLeadStory() {
  return (
    <article className="magazine-lead">
      <img
        className="magazine-lead-image"
        src={magazineLead.image}
        alt={magazineLead.imageAlt}
      />
      <p className="magazine-category">{magazineLead.category}</p>
      <h2 className="magazine-headline">{magazineLead.title}</h2>
      {magazineLead.excerpt && (
        <p className="magazine-excerpt">{magazineLead.excerpt}</p>
      )}
      <MagazineMeta story={magazineLead} />
    </article>
  );
}

function MagazineSideStory({ story }: { story: MagazineStory }) {
  return (
    <article className="magazine-side-story">
      <img className="magazine-side-image" src={story.image} alt={story.imageAlt} />
      <p className="magazine-category">{story.category}</p>
      <h3 className="magazine-side-headline">{story.title}</h3>
      <MagazineMeta story={story} />
    </article>
  );
}

export function MagazineSection() {
  return (
    <section className="magazine-section">
      <div className="magazine-container">
        <div className="magazine-grid">
          <MagazineLeadStory />
          <div className="magazine-side-column">
            {magazineSideStories.map((story) => (
              <MagazineSideStory key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
