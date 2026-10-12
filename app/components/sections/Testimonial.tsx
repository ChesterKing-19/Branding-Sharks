"use client";

export function Testimonial() {
  return (
    <section className="quote" aria-labelledby="testimonial-heading">
      <p className="eyebrow">Kind words</p>
      <h2 id="testimonial-heading" className="sr-only">Client testimonial</h2>
      <blockquote>
        &ldquo;They gave us a completely new way of thinking about our brand — then made it move.&rdquo;
      </blockquote>
      <div>
        <span>Jade Morris</span>
        <span>Chief Growth Officer / NOVA</span>
      </div>
    </section>
  );
}
