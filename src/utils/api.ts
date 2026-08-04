import config from '../config/site.json';

const request = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response;
};

export const getProjects = async () => {
  const response = await request(
    `https://api.github.com/users/${config.social.github}/repos`,
  );
  return response.json();
};

export const getWeather = async (city: string) => {
  try {
    const response = await request(
      `https://wttr.in/${encodeURIComponent(city)}?ATm`,
    );
    return response.text();
  } catch (error) {
    return error;
  }
};

export const getQuote = async () => {
  const response = await request('https://api.quotable.io/random');
  const data = await response.json();
  return {
    quote: `“${data.content}” — ${data.author}`,
  };
};
