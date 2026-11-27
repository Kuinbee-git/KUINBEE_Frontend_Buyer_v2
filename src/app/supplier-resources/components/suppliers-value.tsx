"use client";

import { useEffect, useRef } from "react";
import {
  DiscoveryDrawing,
  EnquiryDrawing,
  FolioDrawing,
  GovernanceDrawing,
  PriceDrawing,
} from "./supplier-benefit-drawings";
import { SupplierVisibilityPreview } from "./supplier-visibility-preview";
import styles from "./suppliers-value.module.css";

const questions = [
  {
    title: "Who will find my work?",
    benefits: [
      {
        title: "Curated discovery",
        copy: "Reach buyers browsing a catalogue where each published dataset has passed review.",
        Drawing: DiscoveryDrawing,
      },
      {
        title: "Email-verified enquiries",
        copy: "Buyers confirm their email address before sending an enquiry about your dataset.",
        Drawing: EnquiryDrawing,
      },
    ],
  },
  {
    title: "On whose terms do I sell?",
    benefits: [
      {
        title: "Supplier-set pricing",
        copy: "Set a fixed price for an off-the-shelf dataset. Buyers see your price before they purchase.",
        Drawing: PriceDrawing,
      },
      {
        title: "Clear usage rights",
        copy: "Publish the licence, source and schema together so buyers can assess provenance and permitted use.",
        Drawing: GovernanceDrawing,
      },
    ],
  },
  {
    title: "How much control do I have?",
    benefits: [
      {
        title: "A portfolio with depth",
        copy: "Use samples, collection methods and use cases to show what each dataset can do and where its limits are.",
        Drawing: FolioDrawing,
      },
      {
        title: "Control over visibility",
        copy: "Choose which collections buyers can discover. You can change a dataset’s visibility after publication.",
        Drawing: SupplierVisibilityPreview,
      },
    ],
  },
];

export function SuppliersValue() {
  const spread = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spread.current || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.removeAttribute("data-pending");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    const drawings = spread.current.querySelectorAll("[data-illustration]");
    drawings.forEach((drawing) => {
      if (drawing.getBoundingClientRect().top >= window.innerHeight) {
        drawing.setAttribute("data-pending", "");
        observer.observe(drawing);
      }
    });
    return () => {
      observer.disconnect();
      drawings.forEach((drawing) => drawing.removeAttribute("data-pending"));
    };
  }, []);

  return (
    <section
      id="why-suppliers"
      className={styles.section}
      aria-labelledby="supplier-value-title"
    >
      <div className={styles.inner}>
        <h2 id="supplier-value-title">Why Suppliers Choose Kuinbee</h2>
        <div className={styles.spread} ref={spread}>
          {questions.map(({ title, benefits }) => (
            <div className={styles.pair} key={title}>
              <h3>{title}</h3>
              {benefits.map(({ title: benefit, copy, Drawing }) => (
                <div className={styles.benefit} key={benefit}>
                  <div className={styles.illustration} data-illustration="">
                    <Drawing />
                  </div>
                  <h4>{benefit}</h4>
                  <p>{copy}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
