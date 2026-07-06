import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Vision from "@/components/Vision";
import HowItWorks from "@/components/HowItWorks";
import WorkflowSpotlight from "@/components/WorkflowSpotlight";
import SoftwareTalk from "@/components/SoftwareTalk";
import Benefits from "@/components/Benefits";
import UseCases from "@/components/UseCases";
import BeforeAfter from "@/components/BeforeAfter";
import Trust from "@/components/Trust";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Vision />
        <HowItWorks />
        <WorkflowSpotlight />
        <SoftwareTalk />
        <Benefits />
        <UseCases />
        <BeforeAfter />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
