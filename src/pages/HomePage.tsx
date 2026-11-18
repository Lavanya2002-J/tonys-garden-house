import { PageLayout } from "@/components/layout/PageLayout";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/home/Reveal";
import { StickyBook } from "@/components/home/StickyBook";
import { FaqSection } from "@/components/home/FaqSection";
import {
  ContactSection,
  ExperiencesSection,
  GallerySection,
  GuestWall,
  HostSection,
  LocationSection,
  QuickFacts,
  ReviewsSection,
  RoomsSection,
} from "@/components/home/HomeSections";

export default function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <Reveal><QuickFacts /></Reveal>
      <Reveal><HostSection /></Reveal>
      <Reveal><GallerySection /></Reveal>
      <Reveal><RoomsSection /></Reveal>
      <Reveal><ExperiencesSection /></Reveal>
      <Reveal><ReviewsSection /></Reveal>
      <Reveal><GuestWall /></Reveal>
      <Reveal><FaqSection /></Reveal>
      <Reveal><LocationSection /></Reveal>
      <Reveal><ContactSection /></Reveal>
      <div className="h-20 md:hidden" aria-hidden="true" />
      <StickyBook />
    </PageLayout>
  );
}
