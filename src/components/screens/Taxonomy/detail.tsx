import FormSidebar from '@components/layout/FormSidebar'
import ActionPublish from '@components/widgets/ActionPublish'
import PageHeader from '@components/widgets/PageHeader'
import { checkAuth, getLocalStored } from '@libs/localStorage'
import {
  useMutationPatchTaxonomyById,
  useMutationPutSlugTaxonomyById,
  useQueryTaxonomyById,
  useQueryTaxonomyMakeTree,
} from '@queries/hooks'
import { TPatchTaxonomy, TTaxonomy } from '@modules/index'
import { queryClient } from '@queries/index'
import { DETAIL_TAXONOMY, MAKE_TREE_TAXONOMY } from '@queries/keys'
import { Card, Col, Form } from 'antd'
import { useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { TResApi } from '@configs/interface.config'
import EditSlugModal, { THandleEditSlugModal } from '@components/widgets/EditSlugModal'
import HeadHtml from '@components/layout/HeadHtml'

import FormInput from './Components/FormInput'
import EditParentModal, { THandleEditParentModal } from './Components/EditParentModal'

type TTaxonomyDetail = {
  postType: string
  pageTitle: string
}

function TaxonomyDetail({ postType, pageTitle }: TTaxonomyDetail) {
  const lang = getLocalStored('lang')
  const { id } = useParams()
  const token = checkAuth()
  const [form] = Form.useForm<TPatchTaxonomy>()

  const editParentModalRef = useRef<null | THandleEditParentModal>(null)
  const editSlugModalRef = useRef<null | THandleEditSlugModal>(null)

  const {
    data: taxonomyMakeTreeData,
    isLoading: isLoadingTaxonomyMakeTree,
    isFetching: isFetchingTaxonomyMakeTree,
  } = useQueryTaxonomyMakeTree(postType, token, lang)
  const taxonomyMakeTree = useMemo(
    () => (taxonomyMakeTreeData?.data ? [taxonomyMakeTreeData?.data] : []),
    [taxonomyMakeTreeData, isLoadingTaxonomyMakeTree, isFetchingTaxonomyMakeTree],
  )

  const {
    data: taxonomyData,
    isLoading: isLoadingTaxonomy,
    isFetching: isFetchingTaxonomy,
    status: statusTaxonomyById,
  } = useQueryTaxonomyById(id || '', token, lang)
  const taxonomy = useMemo(() => taxonomyData?.data, [taxonomyData, isLoadingTaxonomy, isFetchingTaxonomy])

  const { mutate: mutatePatchTaxonomyById, isLoading: isLoadingPatchTaxonomyById } = useMutationPatchTaxonomyById()
  const onFinish = (values: TPatchTaxonomy) => {
    if (id)
      mutatePatchTaxonomyById(
        { id, data: values },
        {
          onSuccess: () => {
            queryClient.refetchQueries([MAKE_TREE_TAXONOMY, postType])
            queryClient.setQueryData([DETAIL_TAXONOMY, id, lang], () => {
              const old = queryClient.getQueryData<TResApi<TTaxonomy>>([DETAIL_TAXONOMY, id, lang])
              if (old && old?.data)
                return {
                  ...old,
                  data: { ...old.data, ...values },
                }
              return old
            })
          },
        },
      )
  }

  const { mutate: mutatePutSlugTaxonomyById, isLoading: isLoadingPutSlugTaxonomyById } =
    useMutationPutSlugTaxonomyById()
  const onUpdateSlug = (slug: string) => {
    if (id)
      mutatePutSlugTaxonomyById(
        { id, slug },
        {
          onSuccess: () => {
            queryClient.refetchQueries([MAKE_TREE_TAXONOMY, postType])
            queryClient.setQueryData([DETAIL_TAXONOMY, id], () => {
              const old = queryClient.getQueryData<TResApi<TTaxonomy>>([DETAIL_TAXONOMY, id])
              if (old && old?.data)
                return {
                  ...old,
                  data: { ...old.data, slug },
                }
              return old
            })
            editSlugModalRef.current?.onOpen(false)
          },
        },
      )
  }
  return (
    <>
      <HeadHtml title={taxonomy?.name || pageTitle} />
      <Col span={24}>
        <FormSidebar
          form={form}
          isLoading={!!isLoadingTaxonomy}
          scrollToFirstError
          onFinish={onFinish}
          isStatus={statusTaxonomyById}
        >
          <>
            <FormSidebar.Content>
              <Card
                hoverable
                title={
                  <PageHeader
                    extra={[
                      { text: 'Edit parent', action: () => editParentModalRef.current?.onOpen(true) },
                      { text: 'Edit slug', action: () => editSlugModalRef.current?.onOpen(true) },
                    ]}
                    title={taxonomy?.name || pageTitle}
                    isSearch={false}
                    inCard
                  />
                }
              >
                <FormInput taxonomyMakeTree={taxonomyMakeTree} data={taxonomy} />
              </Card>
            </FormSidebar.Content>
            <FormSidebar.Sidebar>
              <ActionPublish
                // data={{ publishedLanguage: taxonomy?.publishedLanguage }}
                loadingUpdate={isLoadingPatchTaxonomyById}
                onUpdate={() => form.submit()}
                showInput={{ publishedLanguage: true }}
              />
            </FormSidebar.Sidebar>
          </>
        </FormSidebar>
      </Col>
      <EditParentModal
        taxonomyMakeTree={taxonomyMakeTree}
        initialValue={taxonomy?.parent._id}
        taxonomy={taxonomy}
        postType={postType}
        ref={editParentModalRef}
      />
      <EditSlugModal
        slug={taxonomy?.slug}
        onSave={(x) => onUpdateSlug(x)}
        confirmLoading={isLoadingPutSlugTaxonomyById}
        ref={editSlugModalRef}
      />
    </>
  )
}

export default TaxonomyDetail
