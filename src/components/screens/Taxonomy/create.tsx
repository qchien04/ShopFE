import FormSidebar from '@components/layout/FormSidebar'
import ActionPublish from '@components/widgets/ActionPublish'
import HeadHtml from '@components/layout/HeadHtml'
import PageHeader from '@components/widgets/PageHeader'
import { checkAuth, getLocalStored } from '@libs/localStorage'
import { TPostTaxonomy } from '@modules/index'
import { queryClient } from '@queries/index'
import { useMutationPostTaxonomy, useQueryTaxonomyMakeTree } from '@queries/hooks'
import { MAKE_TREE_TAXONOMY } from '@queries/keys'
import { Card, Col, Form } from 'antd'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import FormInput from './Components/FormInput'

type TCreateTaxonomy = {
  postType: string
  pageTitle: string
  categoryPath: string
}

function CreateTaxonomy({ postType, pageTitle, categoryPath }: TCreateTaxonomy) {
  const lang = getLocalStored('lang')
  const token = checkAuth()
  const [form] = Form.useForm<TPostTaxonomy>()
  const {
    data: taxonomyMakeTreeData,
    isLoading: isLoadingTaxonomyMakeTree,
    isFetching: isFetchingTaxonomyMakeTree,
  } = useQueryTaxonomyMakeTree(postType, token, lang)
  const taxonomyMakeTree = useMemo(
    () => (taxonomyMakeTreeData?.data ? [taxonomyMakeTreeData?.data] : []),
    [taxonomyMakeTreeData, isLoadingTaxonomyMakeTree, isFetchingTaxonomyMakeTree],
  )

  const { mutate, isLoading } = useMutationPostTaxonomy()
  const navigate = useNavigate()
  const onFinish = (values: TPostTaxonomy) => {
    mutate(
      { ...values, postType },
      {
        onSuccess: () => {
          queryClient.refetchQueries([MAKE_TREE_TAXONOMY, postType])
          navigate(categoryPath)
        },
      },
    )
  }

  return (
    <>
      <HeadHtml title={pageTitle} />
      <Col span={24}>
        <FormSidebar isLoading={isLoadingTaxonomyMakeTree} scrollToFirstError form={form} onFinish={onFinish}>
          <>
            <FormSidebar.Content>
              <Card hoverable title={<PageHeader title={pageTitle} isSearch={false} inCard />}>
                <FormInput taxonomyMakeTree={taxonomyMakeTree} />
              </Card>
            </FormSidebar.Content>
            <FormSidebar.Sidebar>
              <ActionPublish
                onPublish={() => form.submit()}
                loadingPublish={isLoading}
                showInput={{ publishedLanguage: true }}
              />
            </FormSidebar.Sidebar>
          </>
        </FormSidebar>
      </Col>
    </>
  )
}

export default CreateTaxonomy
