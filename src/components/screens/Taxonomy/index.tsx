import { checkAuth, getLocalStored } from '@src/libs/localStorage'
import { useQueryTaxonomyMakeTree } from '@src/queries/hooks'
import { Col, Row, Table } from 'antd'
import { useMemo } from 'react'

import { columnsTableTaxonomy } from './configs/table.config'

type TTaxonomyScreen = {
  postType: string
  prefixDetailUrl: string
}

function TaxonomyScreen({ postType, prefixDetailUrl }: TTaxonomyScreen) {
  const lang = getLocalStored('lang')
  const token = checkAuth()
  const {
    data: taxonomyMakeTreeData,
    isLoading: isLoadingTaxonomyMakeTree,
    isFetching: isFetchingTaxonomyMakeTree,
  } = useQueryTaxonomyMakeTree(postType, token, lang)

  const taxonomyMakeTree = useMemo(
    () => taxonomyMakeTreeData?.data.children,
    [taxonomyMakeTreeData, isLoadingTaxonomyMakeTree, isFetchingTaxonomyMakeTree],
  )

  const columns = columnsTableTaxonomy(prefixDetailUrl, postType)
  return (
    <Col span={24}>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            rowKey="_id"
            dataSource={taxonomyMakeTree}
            loading={isLoadingTaxonomyMakeTree}
            pagination={false}
            scroll={{ x: 992 }}
          />
        </Col>
      </Row>
    </Col>
  )
}

export default TaxonomyScreen
