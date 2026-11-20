import { ServicesDiagram } from "./ServicesDiagram";
import { ServicesHeading } from "./ServicesHeading";

/* ============================================================
   LEGACY SERVICES — kept on disk for rollback. Do not delete.

   The section used to be a WebGL sphere (InfiniteMenu) behind a
   SplitFlapText heading. To restore it:

     1. Uncomment the InfiniteMenu import and the ITEMS map below.
     2. Replace the <ServicesDiagram /> line in the return with the
        commented-out legacy JSX at the bottom of this file.
     3. Uncomment the `.services*` / `.services-stage` rules in
        app/globals.css (marked LEGACY SERVICES).

   The old component files are untouched:
     app/components/effects/InfiniteMenu.tsx  + .css
     app/components/effects/SplitFlapText.tsx + .css
   ============================================================ */
// import InfiniteMenu from "../effects/InfiniteMenu";
// import { SERVICES } from "../../data/content";
//
// const ITEMS = SERVICES.map(({ title, description, image }) => ({
//   image,
//   link: "",
//   title,
//   description,
// }));

export function Services() {
  return (
    <section
      className="services section"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="services-head">
        <p className="services-eyebrow">Our services</p>
        <ServicesHeading />
      </div>
      <ServicesDiagram />
      {/*
        LEGACY JSX — restore together with the imports above.

        <div className="sr-only">
          <h3>Services</h3>
          <ul>
            {SERVICES.map(({ title, description }) => (
              <li key={title}>
                {title}: {description}
              </li>
            ))}
          </ul>
        </div>
        <div className="services-stage">
          <InfiniteMenu
            items={ITEMS}
            roundness={1}
            backgroundColor="#000"
            theme="dark"
            accentColor="#a8c814"
          />
        </div>
      */}
    </section>
  );
}
