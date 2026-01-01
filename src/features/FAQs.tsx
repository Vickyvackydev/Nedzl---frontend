import { useState } from "react";
import MainLayout from "../layout/MainLayout";
import CategoryBar from "../components/CategoryBar";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
  return (
    <div
      className="w-full bg-white rounded-[16px] border border-[#EEEEEE] shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="p-6 md:px-8 md:py-5 flex items-center justify-between gap-x-4">
        <h3
          className={`text-[16px] md:text-[18px] font-bold text-[#333333] transition-colors ${
            isOpen ? "text-primary-300" : ""
          }`}
        >
          {question}
        </h3>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isOpen ? "bg-primary-300/10" : "bg-[#00A63E0D]"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-primary-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#999999]" />
          )}
        </div>
      </div>
      {isOpen && (
        <div className="px-6 md:px-8 pb-8 animate-fadeIn">
          <p className="text-[15px] md:text-[16px] leading-[1.7] text-[#555555]">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      question: "1. What is Nedzl.com?",
      answer:
        "Nedzl.com is an online marketplace designed specifically for university students to buy and sell used items such as gadgets, books, clothes, furniture, and more — safely and easily within their campus community.",
    },
    {
      question: "2. Who can use Nedzl.com?",
      answer:
        "Nedzl is open to everyone, but it is primarily built for students in universities and tertiary institutions in Nigeria. Both buyers and sellers can use the platform to connect and trade.",
    },
    {
      question: "3. Is registration required?",
      answer:
        "Only sellers need to register to list products. Buyers can browse and contact sellers freely without registration.",
    },
    {
      question: "4. How do I list an item for sale?",
      answer:
        "Create a seller account, log in, click “Post Product,” add item details and images, and submit. Your item will appear on the homepage and be visible to buyers.",
    },
    {
      question: "5. How do I contact a seller?",
      answer:
        "Each product listing contains the seller’s contact info or a message button. Reach out directly to ask questions or arrange a purchase.",
    },
    {
      question: "6. Does Nedzl handle payments or delivery?",
      answer:
        "Not at the moment. Nedzl simply connects buyers and sellers. All payments and delivery arrangements are made between both parties.",
    },
    {
      question: "7. Is it safe to buy and sell on Nedzl?",
      answer:
        "We recommend meeting in safe public locations and verifying items before purchase. Since it's campus-based, many students find it more trustworthy.",
    },
    {
      question: "8. What kind of products can I sell?",
      answer:
        "You can sell gently used or pre-owned items that are legal and student-appropriate, such as electronics, textbooks, fashion, household items, etc.",
    },
    {
      question: "9. Can I sell brand-new products too?",
      answer:
        "Yes, as long as they’re appropriate for the student audience and meet our terms of service.",
    },
    {
      question: "10. Is there a fee to use Nedzl?",
      answer: "Currently, Nedzl is free to use for both buyers and sellers.",
    },
    {
      question: "11. What should I do if a buyer or seller is not responding?",
      answer:
        "If you can’t reach a seller or buyer after reasonable attempts, you can report the listing or try another available option on the platform.",
    },
    {
      question: "12. Can I list services, not just products?",
      answer:
        "Yes, but only student-relevant services like tutoring, hairdressing, tech repair, etc. All service listings must follow our guidelines.",
    },
    {
      question: "13. How can I give feedback or suggest improvements?",
      answer:
        "We welcome feedback! Use the contact/support page or email our team directly to share your suggestions.",
    },
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MainLayout>
      <CategoryBar />
      <div className="w-full font-open-sans bg-white pb-20">
        <div className="w-full flex flex-col gap-y-1 bg-[#F2FEF0] h-[300px] items-center justify-center mb-16">
          <h1 className="lg:text-[32px] text-2xl text-center md:text-[40px] font-bold text-primary-300">
            Frequently Asked Questions
          </h1>
          <p className="text-[#555555] text-center text-[15px] md:text-[16px] font-medium max-w-[600px] px-4">
            Find answers to common questions about using Nedzl.com as a buyer or
            seller.
          </p>
        </div>

        <div className="max-w-[1000px] mx-auto px-4 md:px-0 flex flex-col gap-y-5">
          {faqData.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQs;
