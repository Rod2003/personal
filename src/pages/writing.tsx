import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { WritingPage } from '../components/writing-page';
import { articles } from '../config/articles';

export const getStaticProps: GetStaticProps = async () => ({
  props: { articles },
});

export default function WritingPageRoute({
  articles,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <WritingPage articles={articles} />;
}
