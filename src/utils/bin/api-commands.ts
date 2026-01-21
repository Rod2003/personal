// // List of commands that require API calls

import React from 'react';
import { getQuote } from '../api';
import { getWeather } from '../api';
import { ProjectsList } from '../../components/projects-list';
import { AskAIResponse } from '../../components/ask-ai-response';

export const projects = async (args: string[]): Promise<React.ReactElement> => {
  return React.createElement(ProjectsList);
};

export const quote = async (args: string[]): Promise<string> => {
  const data = await getQuote();
  return data.quote;
};

export const weather = async (args: string[]): Promise<string> => {
  const city = args.join('+');
  if (!city) {
    return 'Usage: weather [city]. Example: weather casablanca';
  }
  const weather = await getWeather(city);
  const newWeather = weather.replace(
    'Follow @igor_chubin for wttr.in updates',
    '',
  );
  return newWeather;
};

export const grep = async (args: string[]): Promise<React.ReactElement | string> => {
  const query = args.join(' ');
  
  if (!query) {
    return `Usage: grep <your question>

Examples:
  grep Which tech stack do you normally work with?
  grep Summarize your past experience
  grep Tell me about your background`;
  }
  
  return React.createElement(AskAIResponse, { query });
};
