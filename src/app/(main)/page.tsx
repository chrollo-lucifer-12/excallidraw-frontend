import Navbar from "@/components/home/navbar";
import HeroBanner from "@/components/home/hero-banner";
import TutorialVideo from "@/components/home/tutorial-video";
import Feature1 from "@/components/home/feature-1";
import Feature6 from "@/components/home/feature-6";

import QnaSection from "@/components/home/qna-section";
import Footer from "@/components/home/footer";

const Page = async () => {
  return (
    <div>
      <Navbar />
      <HeroBanner />
      <TutorialVideo />
      <Feature1 />
      <Feature6 />
      <QnaSection />
      <Footer />
    </div>
  );
};

export default Page;
