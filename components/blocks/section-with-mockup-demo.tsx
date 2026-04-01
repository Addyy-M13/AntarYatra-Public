"use client";

import React from "react";
import SectionWithMockup from "@/components/blocks/section-with-mockup";

// Example data for newsletter section
const newsletterData = {
  title: (
    <>
      Intelligence,
      <br />
      delivered to you.
    </>
  ),
  description: (
    <>
      Get a tailored Monday morning brief directly in your inbox, crafted by
      your personal AI assistant, spotlighting essential watchlist stories and
      insights for the week ahead.
    </>
  ),
  primaryImageSrc:
    "https://images.unsplash.com/photo-1517694712202-14819c9cb5b6?w=500&h=800&fit=crop",
  secondaryImageSrc:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=800&fit=crop",
};

// Example data for second section (reversed layout)
const featureData = {
  title: (
    <>
      Real-time insights
      <br />
      Anytime, anywhere.
    </>
  ),
  description: (
    <>
      Access comprehensive analytics and data-driven recommendations through
      our intuitive mobile and web interfaces, designed for seamless
      cross-platform experience.
    </>
  ),
  primaryImageSrc:
    "https://images.unsplash.com/photo-1512941691920-13ba8469a8d6?w=500&h=800&fit=crop",
  secondaryImageSrc:
    "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=800&fit=crop",
};

export function SectionWithMockupDemo() {
  return (
    <div className="space-y-20">
      {/* First section - default layout */}
      <div>
        <SectionWithMockup
          title={newsletterData.title}
          description={newsletterData.description}
          primaryImageSrc={newsletterData.primaryImageSrc}
          secondaryImageSrc={newsletterData.secondaryImageSrc}
        />
      </div>

      {/* Second section - reversed layout */}
      <div>
        <SectionWithMockup
          title={featureData.title}
          description={featureData.description}
          primaryImageSrc={featureData.primaryImageSrc}
          secondaryImageSrc={featureData.secondaryImageSrc}
          reverseLayout={true}
        />
      </div>
    </div>
  );
}
