import { useRouter } from 'next/router';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const router = useRouter();

  useEffect(() => {
    void router.replace('/');
  }, [router]);

  return null;
};

export default NotFoundPage;
