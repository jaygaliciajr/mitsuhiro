"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/content/faq";

export function FaqSection() {
  return (
    <Accordion type="single" collapsible className="border-t border-rule">
      {faqs.map((faq, index) => (
        <AccordionItem
          key={faq.question}
          value={`faq-${index}`}
          className="border-b border-rule not-last:border-b"
        >
          <AccordionTrigger className="min-h-tap gap-6 rounded-none py-5 font-display text-lg font-medium text-ink hover:no-underline **:data-[slot=accordion-trigger-icon]:mt-1 **:data-[slot=accordion-trigger-icon]:text-brass-deep">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="prose-block max-w-2xl pb-6 text-base text-ink-soft">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
