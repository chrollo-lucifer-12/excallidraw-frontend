"use client";

import Image from "next/image";

const Feature1 = () => {
  return (
    <section className="mt-32 flex flex-col items-center gap-y-10 sm:px-10 md:px-20 lg:px-[120px]">
      <div className={"sm:w-[600px] md:w-[700px] w-[300px]"}>
        <h1 className="text-black font-extrabold text-lg sm:text-3xl">
          Your ideas, but visual
        </h1>
        <p className="mt-2 text-gray-700 text-[12px] max-w-[250px] sm:text-[12px] md:text-[16px] sm:max-w-[650px] md:max-w-[1200px]">
          A fast, intuitive online whiteboard built for thinking, planning, and
          real-time collaboration — from quick sketches to complex workflows.
        </p>
      </div>
      <div className="rounded-2xl sm:w-[600px] md:w-[700px] w-[300px] h-auto border p-10 text-black shadow-[0_0_0_2px_rgb(248,28,229),0_0_0_4px_rgba(248,28,229,0.36)]">
        <Image
          src={"/dive-in.png"}
          alt={"dive in "}
          width={200}
          height={100}
          className={"w-full"}
        />
        <p className="text-[18px] font-[1000] bg-gradient-to-r from-[#8A46FF] to-[#F81CE0] bg-clip-text text-transparent">
          Free, unlimited whiteboards
        </p>
        <p className="max-w-[620px] mt-1 text-sm">
          Skip paywalls and seat limits. Create unlimited boards, collaborate
          live, and keep everything in one place — no credit card required.
        </p>
      </div>
    </section>
  );
};

export default Feature1;
