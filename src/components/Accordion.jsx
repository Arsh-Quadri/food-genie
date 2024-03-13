import { useState } from "react";
import down from "../assets/down.png";

const AccordionItem = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-item">
      <button
        type="button"
        className="accordion-button rounded-lg p-3 text-left text-[18px] font-medium focus:outline-none`"
        onClick={toggleAccordion}
      >
        <div className="flex justify-between items-center">
          {title}
          <img
            src={down}
            alt=""
            width={20}
            className={isOpen ? "rotate-180" : ""}
          />
        </div>
        <div
          className={`accordion-content text-[16px] font-[400]  ${
            isOpen ? "open" : "closed"
          }`}
        >
          {children}
        </div>
      </button>
    </div>
  );
};

const Accordion = ({ items }) => {
  return (
    <div className="w-[80%] mt-5 space-y-4">
      {items.map((item) => (
        <AccordionItem key={item.title} title={item.title}>
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
