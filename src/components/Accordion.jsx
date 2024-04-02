import { useState } from "react";
import down from "../assets/down.png";

const AccordionItem = ({ title, children, isOpen, toggleAccordion }) => {
  return (
    <div className="accordion-item">
      <button
        type="button"
        className="accordion-button rounded-lg p-3 text-left text-sm sm:text-[18px] font-medium focus:outline-none"
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
          className={`accordion-content text-[12px] sm:text-[16px] font-[400] ${
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
  const [openItemIndex, setOpenItemIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenItemIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="w-[80%] mt-5 space-y-4">
      {items.map((item, index) => (
        <AccordionItem
          key={item.title}
          title={item.title}
          isOpen={openItemIndex === index}
          toggleAccordion={() => toggleAccordion(index)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
};

export default Accordion;
