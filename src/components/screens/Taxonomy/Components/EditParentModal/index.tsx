/* eslint-disable react/function-component-definition */
import { NWarning } from '@src/configs/const.config'
import { TMoveTaxonomy, TTaxonomy, TTaxonomyMakeTree } from '@src/modules'
import { queryClient } from '@src/queries'
import { useMutationMoveTaxonomyById } from '@src/queries/hooks'
import { MAKE_TREE_TAXONOMY } from '@src/queries/keys'
import { Form, Modal, notification, TreeSelect } from 'antd'
import { SHOW_ALL } from 'rc-tree-select'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

type TEditParentModal = {
  postType: string
  taxonomyMakeTree: TTaxonomyMakeTree[]
  initialValue?: string
  taxonomy?: TTaxonomy
}

export type THandleEditParentModal = {
  onOpen: (v: boolean) => void
}

const EditParentModal: React.ForwardRefRenderFunction<THandleEditParentModal, TEditParentModal> = (
  { taxonomyMakeTree, initialValue, taxonomy, postType },
  ref,
) => {
  const [form] = Form.useForm<TMoveTaxonomy>()

  const [isOpen, setIsOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    onOpen: (v) => setIsOpen(v),
  }))

  const onClose = () => {
    form.resetFields()
    setIsOpen(false)
  }

  const { mutate, isLoading } = useMutationMoveTaxonomyById()
  const onFinish = (values: TMoveTaxonomy) => {
    if (taxonomy) {
      if (taxonomy?.parent?._id === values.newParentId) {
        notification.warning({
          message: NWarning,
          description: 'The target parent value is the same as current parent!',
        })
        return false
      }
      if (taxonomy?._id === values.newParentId) {
        notification.warning({
          message: NWarning,
          description: 'The target parent value cannot be the same as the current parent value!',
        })
        return false
      }
      mutate(
        { id: taxonomy._id, newParentId: values.newParentId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries([MAKE_TREE_TAXONOMY, postType])
            void onClose()
          },
        },
      )
    }
    return true
  }
  return (
    <Modal
      open={isOpen}
      title="Select the parent"
      okText="Move"
      confirmLoading={isLoading}
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          name="newParentId"
          rules={[
            {
              required: true,
              message: 'Parent is required!',
            },
          ]}
          initialValue={initialValue}
        >
          <TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={taxonomyMakeTree}
            placeholder="Please select parent"
            fieldNames={{ label: 'name', value: '_id', children: 'children' }}
            bordered
            showCheckedStrategy={SHOW_ALL}
            treeLine
            treeDefaultExpandAll
            dropdownMatchSelectWidth={false}
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(EditParentModal)
