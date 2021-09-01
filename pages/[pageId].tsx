import React from 'react'
import { resolveNotionPage } from 'lib/resolve-notion-page'
import { isDev, domain } from 'lib/config'
import { getSiteMaps } from 'lib/get-site-maps'
import { NotionPage } from 'components'
import { PageProps } from 'lib/types'
import { NotionRenderer } from 'react-notion-x'

export const getStaticProps = async (context) => {
  const rawPageId = context.params.pageId as string

  try {
    if (rawPageId === 'sitemap.xml' || rawPageId === 'robots.txt') {
      return {
        redirect: {
          destination: `/api/${rawPageId}`,
        },
      }
    }

    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}
export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true,
    }
  }

  const siteMaps = await getSiteMaps()

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        params: {
          pageId,
        },
      })),
    ),
    // paths: [],
    fallback: true,
  }

  console.log(ret.paths)
  return ret
}

function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}

export default NotionDomainDynamicPage
