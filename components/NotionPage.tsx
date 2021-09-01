import React from 'react'
import Link from 'next/link'
import { NotionRenderer, Collection, CollectionRow } from 'react-notion-x'
import * as types from 'lib/types'
import Footer from './Footer'
import { mapPageUrl } from 'lib/map-page-url'
import { useRouter } from 'next/dist/client/router'
import { getBlockTitle } from 'notion-utils'
import * as config from 'lib/config'
import Head from 'next/head'
import { mapNotionImageUrl } from 'lib/map-image-url'

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId,
}) => {
  const router = useRouter()

  if (router.isFallback) {
    return <span>Loading...</span>
  }

  const keys = Object.keys(recordMap?.block || {})
  const block = recordMap?.block?.[keys[0]]?.value

  const siteMapPageUrl = mapPageUrl(site, recordMap, new URLSearchParams())
  const title = getBlockTitle(block, recordMap) || site.name

  console.log('notion page', {
    isDev: config.isDev,
    title,
    pageId,
    rootNotionPageId: site.rootNotionPageId,
    recordMap,
  })

  const isBlogPost =
    block.type === 'page' && block.parent_table === 'collection'
  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  return (
    <>
      <Head>
        <meta property="og:title" content={title} />
        <title>{title}</title>
      </Head>

      <NotionRenderer
        components={{
          pageLink: ({
            href,
            as,
            passHref,
            prefetch,
            replace,
            scroll,
            shallow,
            locale,
            ...props
          }) => (
            <Link
              href={href}
              as={as}
              passHref={passHref}
              prefetch={prefetch}
              replace={replace}
              scroll={scroll}
              shallow={shallow}
              locale={locale}
            >
              <a {...props} />
            </Link>
          ),
          collection: Collection,
          collectionRow: CollectionRow,
        }}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        fullPage={true}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapNotionImageUrl}
        footer={<Footer />}
      />
    </>
  )
}

export default NotionPage
