// List of commands that do not require API calls

import config from '../../../config.json';

// Help - returns a special marker for React component rendering
export const help = async (args: string[]): Promise<string> => {
  // Return a special marker that will be intercepted by the shell
  return '__HELP_COMPONENT__';
};

// About
export const about = async (args: string[]): Promise<string> => {
  return `Hi, I'm ${config.name}.

Peruvian born, Canadian raised.

I'm an Ex-Founder and Software Engineer.

More about me:
'linkedin' - my LinkedIn profile.
'github' - my GitHub profile.`;
};

export const github = async (args: string[]): Promise<string> => {
  window.open(`https://github.com/${config.social.github}/`);

  return 'Opening github...';
};

// LinkedIn
export const linkedin = async (args: string[]): Promise<string> => {
  window.open(`https://www.linkedin.com/in/${config.social.linkedin}/`);

  return 'Opening linkedin...';
};


// Typical linux commands
export const echo = async (args: string[]): Promise<string> => {
  return args.join(' ');
};

export const whoami = async (args: string[]): Promise<string> => {
  return `${config.ps1_username}`;
};

export const ls = async (args: string[]): Promise<string> => {
  if (args[0] === '-a') {
    return `a 
bunch
of 
fake
directories
.you
.know
.your
.shell
.commands!`;
  } else {
    return `a
bunch
of
fake
directories`;
  }
};

export const cd = async (args: string[]): Promise<string> => {
  return `unfortunately, i cannot afford more directories.`;
};

export const date = async (args: string[]): Promise<string> => {
  return new Date().toString();
};

export const vi = async (args: string[]): Promise<string> => {
  return `woah, you still use 'vi'? just try 'vim'.`;
};

export const vim = async (args: string[]): Promise<string> => {
  return `'vim' is so outdated. how about 'nvim'?`;
};

export const nvim = async (args: string[]): Promise<string> => {
  return `'nvim'? too fancy. why not 'emacs'?`;
};

export const emacs = async (args?: string[]): Promise<string> => {
  return `you know what? just use vscode.`;
};

export const sudo = async (args?: string[]): Promise<string> => {
  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank'); // ...I'm sorry
  return `Permission denied: with little power comes... no responsibility? `;
};

// Mode command - returns a special marker for mode display
export const mode = async (args: string[]): Promise<string> => {
  // This will be handled specially in the shell
  return '__MODE_INFO__';
};

// Hidden restart command
export const rodrodrod = async (args: string[]): Promise<string> => {
  if (args[0] === 'start') {
    return '__RESTART__';
  }
  return `rodrodrod: unknown command '${args[0]}'`;
};

// Music player with audio visualizer
export const music = async (args: string[]): Promise<string> => {
  return '__MUSIC_COMPONENT__';
};

