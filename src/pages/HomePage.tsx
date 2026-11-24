import { Hero } from "./home/Hero";
import { Collections, Differentials, Faq, Featured, Location, Steps } from "./home/Sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Featured />
      <Collections />
      <Differentials />
      <Steps />
      <Faq />
      <Location />
    </>
  );
}
