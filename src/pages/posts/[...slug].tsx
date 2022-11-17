import { GetServerSideProps } from "next"
import { unstable_getServerSession } from "next-auth"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import { authOptions, SessionProps }  from '../api/auth/[...nextauth]';
import styles from './post.module.scss'


interface PostProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string,
  }
}

export default function Post({post}:PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div className={styles.postContent} dangerouslySetInnerHTML={{__html: post.content}}/>
        </article>
      </main>
    </>
  )      
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  
  const session: SessionProps = await unstable_getServerSession(req, res, authOptions)
  const { slug } = params;
  

  if(!session?.activeSubscription){
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient()

  const response = await prismic.getByUID('post', slug.toString())

  const post = {
    slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.content),
      updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
  }

  return {
    props: {   
      post   
    }
  }

}