'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';

export type AccordionItem = { id: string; question: ReactNode; answer: ReactNode };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const base = useId();

  return (
    <div>
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${base}-${item.id}-button`;
        const panelId = `${base}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-t border-outline-variant">
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : item.id)}
              className="state-layer relative flex w-full items-baseline justify-between gap-5
                         py-5 text-left font-heading text-title-large text-on-surface
                         cursor-pointer hover:text-primary transition-colors duration-200 ease-standard"
            >
              <span>{item.question}</span>
              <Icon
                name={open ? 'remove' : 'add'}
                size={24}
                className="shrink-0 self-center text-primary"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="grid transition-[grid-template-rows] duration-200 ease-standard"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="pb-6 max-w-[68ch] text-body-large text-on-surface-variant">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
