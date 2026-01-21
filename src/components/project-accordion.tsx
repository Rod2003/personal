import React, { useState } from 'react';
import { ProjectSection } from '../types/project';
import { BlockRenderer } from './project-blocks/block-renderer';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from './dialog';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Ps1 } from './Ps1';

interface ProjectProps {
  name: string;
  description: string;
  sections: ProjectSection[];
}

export const ProjectAccordion: React.FC<ProjectProps> = ({
  name,
  description,
  sections,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="mb-3 text-left px-3 py-2 bg-yellow/10 hover:bg-yellow/20 border border-yellow/30 hover:border-yellow rounded-lg transition-all duration-200 text-yellow font-medium cursor-pointer group relative">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {name}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="text-foreground text-sm mt-1 font-light">
                  {description.split('.')[0]}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent
        hideCloseButton
        className="w-screen h-screen max-w-none bg-background border border-yellow rounded-xl p-2 sm:p-4 md:p-8 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:duration-200 data-[state=open]:duration-300"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="h-full border rounded-xl border-yellow relative overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-yellow/30">
            <div className="flex items-center font-mono text-sm">
              <Ps1 route={`projects/${name.toLowerCase()}`} />
            </div>
            
            <TooltipProvider delayDuration={500}>
              <Tooltip disableHoverableContent>
                <TooltipTrigger asChild>
                  <DialogClose asChild>
                    <button className="rounded-full bg-background/80 backdrop-blur-sm p-1.5 opacity-70 transition-all duration-200 hover:opacity-100 hover:bg-yellow/10 focus:outline-none border border-gray">
                      <ArrowLeft className="h-3 w-3 text-foreground" />
                      <span className="sr-only">Go back</span>
                    </button>
                  </DialogClose>
                </TooltipTrigger>
                <TooltipContent
                  className="border-[1px] z-50 rounded-[4px] border-white bg-background text-xs"
                  sideOffset={5}
                >
                  Go back
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div
              className="text-foreground max-w-4xl mx-auto"
              style={{ lineHeight: '1.6' }}
            >
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx} className="mb-6">
                  {section.title && (
                    <h3 className="font-semibold text-lg mb-3 text-yellow">
                      {section.title}
                    </h3>
                  )}
                  {section.content.map((block, blockIdx) => (
                    <BlockRenderer key={blockIdx} block={block} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

