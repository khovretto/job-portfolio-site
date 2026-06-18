import { Contact } from "@/components/contact";
import { Demos } from "@/components/demos";
import { EventTracker } from "@/components/event-tracker";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Proof } from "@/components/proof";
import { Stack } from "@/components/stack";
import { getMessages } from "@/lib/i18n/server";

export default async function HomePage() {
  const m = await getMessages();
  return (
    <>
      <EventTracker />
      <Nav />
      <main>
        <Hero />
        <Proof />
        <section id="demos" className="section-pad">
          <div className="container">
            <div className="sec-hd">
              <span className="num">02</span>
              <span className="name">{m.sections.demos}</span>
              <span className="rule" />
            </div>
            <Demos />
          </div>
        </section>
        <section id="experience" className="section-pad">
          <div className="container">
            <div className="sec-hd">
              <span className="num">03</span>
              <span className="name">{m.sections.experience}</span>
              <span className="rule" />
            </div>
            <Experience />
          </div>
        </section>
        <section id="stack" className="section-pad">
          <div className="container">
            <div className="sec-hd">
              <span className="num">04</span>
              <span className="name">{m.sections.stack}</span>
              <span className="rule" />
            </div>
            <Stack />
          </div>
        </section>
        <section id="contact" className="section-pad" style={{ paddingBottom: 80 }}>
          <div className="container">
            <div className="sec-hd">
              <span className="num">05</span>
              <span className="name">{m.sections.contact}</span>
              <span className="rule" />
            </div>
            <Contact />
          </div>
        </section>
      </main>
      <a href="/cv.pdf" className="btn primary floating-cv" aria-label={m.hero.downloadCv}>
        <span>CV</span>
      </a>
    </>
  );
}
