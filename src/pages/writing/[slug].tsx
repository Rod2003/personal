import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from 'next';
import { WritingArticlePage } from '../../components/writing-page';
import { articles, type Article } from '../../config/articles';

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: articles.map(({ slug }) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<{ article: Article }> = async ({
  params,
}) => {
  const article = articles.find((entry) => entry.slug === params?.slug);

  return article ? { props: { article } } : { notFound: true };
};

export default function WritingArticleRoute({
  article,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <WritingArticlePage article={article} />;
}
