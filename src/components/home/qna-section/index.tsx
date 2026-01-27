"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Is the whiteboard free to use?",
    answer:
      "Yes! You can create unlimited whiteboards and collaborate in real time for free. Core features like drawing, shapes, text, sticky notes, and live cursors are available without any paywalls. Fair use limits apply to heavy usage and storage.",
  },
  {
    question: "Is my whiteboard data secure?",
    answer:
      "Yes. All data is encrypted in transit and at rest. Boards are private by default, and you stay in control of who can view or edit them. Team and enterprise plans offer advanced access controls and data retention policies.",
  },
  {
    question: "Do I need an account to start?",
    answer:
      "No sign-up required to get started. You can jump straight into a new whiteboard and share the link instantly. Creating an account lets you save boards, manage teams, and access your work across devices.",
  },
];

const QnaSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-32 flex flex-col items-center gap-y-10 px-4 sm:px-10 md:px-20 lg:px-[120px]">
      <div className="sm:w-[600px] md:w-[700px] w-[300px]">
        <h1 className="text-black font-extrabold sm:text-3xl text-lg">
          Questions & answers
        </h1>
      </div>
      <div className="sm:w-[600px] md:w-[700px] w-[300px] mt-2">
        {questions.map((q, i) => (
          <div key={i} className="w-full border-t border-gray-300">
            <button
              onClick={() => toggleAnswer(i)}
              className="w-full flex justify-between items-center text-left p-4 cursor-pointer"
            >
              <p className="font-bold text-black text-sm">{q.question}</p>
              {openIndex === i ? (
                <ChevronDown className="text-black transition-transform rotate-180" />
              ) : (
                <ArrowRight className="text-black" />
              )}
            </button>
            {openIndex === i && (
              <div className="p-4 text-sm text-gray-700 border-t border-gray-200 bg-gray-50">
                {q.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default QnaSection;
