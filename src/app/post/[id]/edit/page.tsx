import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import style from './page.module.scss';
import SessionService from '@/services/sessionService';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';

export default async function Page({ params }: { params: { id: string } }) {
  const groups = await SessionService.getActiveGroups();
  const newsPost = await NewsService.get(Number.parseInt(params.id));

  if (newsPost === null) {
    return notFound();
  }

  if (
    !((await getServerSession(authConfig))?.user?.id === newsPost.writtenByCid)
  ) {
    return notFound();
  }

  return (
    <main className={style.main}>
      <div className={style.content}>
        <NewsPostForm
          groups={groups}
          id={newsPost!.id}
          titleEn={newsPost!.titleEn}
          titleSv={newsPost!.titleSv}
          contentEn={newsPost!.contentEn}
          contentSv={newsPost!.contentSv}
          writtenByCid={newsPost!.writtenByCid}
        />
      </div>
    </main>
  );
}