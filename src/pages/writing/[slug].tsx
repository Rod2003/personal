import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { WritingPage } from '../../components/writing-page';
import { articles } from '../../config/articles';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: articles.map(({ slug }) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: {
    article: articles.find(
      (article) => article.slug === params?.slug,
    ),
  },
});

export default function WritingArticlePage({
  article,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <WritingPage article={article} />;
}
