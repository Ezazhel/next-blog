import Head from 'next/head'
import { NotionPage } from 'components'
import { PageProps } from 'lib/types'
import { domain } from 'lib/config'
import { resolveNotionPage } from 'lib/resolve-notion-page'

export async function getStaticProps() {
  try {
    const props = await resolveNotionPage(domain)
    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)
    throw err
  }
}

export default function Home(props: PageProps) {
  return <NotionPage {...props} />
}
