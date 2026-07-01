import { Contact } from "@/components/contact";
import { CopyLink } from "@/components/copy-link";
import { Demos } from "@/components/demos";
import { EventTracker } from "@/components/event-tracker";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { Proof } from "@/components/proof";
import { SiteFooter } from "@/components/site-footer";
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
              <CopyLink hash="demos" />
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
              <CopyLink hash="experience" />
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
              <CopyLink hash="stack" />
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
              <CopyLink hash="contact" />
              <span className="rule" />
            </div>
            <Contact />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
