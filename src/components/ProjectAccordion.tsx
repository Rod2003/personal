import React, { useState } from 'react';

interface ProjectProps {
  name: string;
  description: string;
  stars?: number;
  githubUrl: string;
  techStack: string[];
  features: string[];
  impact?: Array<{ metric: string; value: string }>;
}

export const ProjectAccordion: React.FC<ProjectProps> = ({
  name,
  description,
  stars,
  githubUrl,
  techStack,
  features,
  impact,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="mb-3 cursor-pointer border border-gray rounded p-2"
      style={{ borderColor: '#A89BB9' }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="select-none"
        style={{ outline: 'none' }}
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
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue underline ml-4 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            → View on GitHub
          </a>
        </div>
      </div>

      {isOpen && (
        <div
          className="mt-3 pt-3 border-t text-foreground"
          style={{ borderColor: '#A89BB9', lineHeight: '1.6' }}
        >
          <div className="mb-3">
            <strong className="text-green">Description:</strong>
            <br />
            {description}
          </div>

          <div className="mb-3">
            <strong className="text-green">Tech Stack:</strong>
            <br />
            {techStack.join(' • ')}
          </div>

          <div className="mb-3">
            <strong className="text-green">Features:</strong>
            <br />
            {features.map((feature, idx) => (
              <div key={idx}>• {feature}</div>
            ))}
          </div>

          {impact && impact.length > 0 && (
            <div className="mb-3">
              <strong className="text-green">Impact:</strong>
              <br />
              {impact.map((item, idx) => (
                <div key={idx}>
                  • {item.metric}: {item.value}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

