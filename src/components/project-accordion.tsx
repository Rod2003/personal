import React, { useState } from 'react';
import { ProjectSection } from '../types/project';
import { BlockRenderer } from './project-blocks/block-renderer';

interface ProjectProps {
  name: string;
  description: string;
  stars?: number;
  githubUrl?: string;
  sections: ProjectSection[];
}

export const ProjectAccordion: React.FC<ProjectProps> = ({
  name,
  description,
  stars,
  githubUrl,
  sections,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="mb-3 border border-gray rounded p-2"
      style={{ borderColor: '#A89BB9' }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`select-none cursor-pointer ${isOpen ? 'sticky top-0 bg-background z-20 -m-2 p-2 rounded-t border-b' : ''}`}
        style={{ outline: 'none', borderColor: isOpen ? '#A89BB9' : undefined }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1">
            <span
              className="inline-block transition-transform duration-200"
              style={{
                transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              }}
            >
              ▶
            </span>
            <div className="ml-2 flex-1">
              <div className="text-yellow font-semibold">
                {name}
                {stars !== undefined && stars > 0 && (
                  <span className="ml-2">⭐ {stars}</span>
                )}
              </div>
              <div className="text-foreground text-sm mt-1">
                {description.split('.')[0]}.
              </div>
            </div>
          </div>
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue underline ml-4 flex-shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              → View on GitHub
            </a>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="pt-4 text-foreground"
          style={{ lineHeight: '1.6' }}
          onClick={(e) => e.stopPropagation()}
        >
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-4">
              {section.title && (
                <h3 className="text-green font-semibold text-lg mb-3">
                  {section.title}
                </h3>
              )}
              {section.content.map((block, blockIdx) => (
                <BlockRenderer key={blockIdx} block={block} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

