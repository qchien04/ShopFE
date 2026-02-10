/* eslint-disable react/function-component-definition */
import { TFolder, TFormValueCEFolder, TQueryFolder } from '@src/modules'
import { useMutationPostFolder, useMutationPatchFolderById } from '@queries/hooks'
import { Form, Input, Modal } from 'antd'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { TResApi, TResDataListApi } from '@src/configs/interface.config'
import { queryClient } from '@src/queries'
import { LIST_FOLDER } from '@src/queries/keys'

type TCreateEditFolderModal = {
  folder?: TFolder
  paramQsFolders?: TQueryFolder
  folderIdCurrent?: string
  handleAfterEditFolder?: (folder: TFolder | undefined) => void
}
export type THandleCreateEditFolderModal = {
  onOpen: (x: boolean) => void
}

const CreateEditFolderModal: React.ForwardRefRenderFunction<THandleCreateEditFolderModal, TCreateEditFolderModal> = (
  { folder, paramQsFolders, folderIdCurrent, handleAfterEditFolder },
  ref,
) => {
  const [form] = Form.useForm<TFormValueCEFolder>()
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    form.resetFields()
    setIsOpen(false)
    if (handleAfterEditFolder) void handleAfterEditFolder(undefined)
  }

  useEffect(() => {
    if (folder) {
      form.setFieldValue('name', folder?.name)
    }
  }, [folder])

  const { mutate: mutateFolder, isLoading: isLoadingPostFolder } = useMutationPostFolder()
  const { mutate: mutatePathFolderById, isLoading: isLoadingPatchFolderById } = useMutationPatchFolderById()
  const onFinish = ({ name }: TFormValueCEFolder) => {
    if (!folder) {
      mutateFolder(
        { name, parentId: folderIdCurrent },
        {
          onSuccess: (res: TResApi<TFolder>) => {
            const newFolder = res.data
            const old = queryClient.getQueryData<TResDataListApi<TFolder[]>>([
              LIST_FOLDER,
              JSON.stringify(paramQsFolders),
            ])
            queryClient.setQueryData([LIST_FOLDER, JSON.stringify(paramQsFolders)], () => {
              const oldData = old?.data || []
              return {
                ...old,
                data: [newFolder, ...oldData],
              }
            })
            void onClose()
          },
        },
      )
    } else {
      mutatePathFolderById(
        { id: folder?._id, data: { name } },
        {
          onSuccess: () => {
            const old = queryClient.getQueryData<TResDataListApi<TFolder[]>>([
              LIST_FOLDER,
              JSON.stringify(paramQsFolders),
            ])
            queryClient.setQueryData([LIST_FOLDER, JSON.stringify(paramQsFolders)], () => {
              const oldData = old?.data || []
              if (oldData?.length <= 0) return { ...old, data: [] }
              const index = oldData.findIndex((item) => item._id === folder._id)
              if (index >= 0)
                return {
                  ...old,
                  data: [...oldData.slice(0, index), { ...oldData[index], name }, ...oldData.slice(index + 1)],
                }
              return { ...old }
            })
            if (handleAfterEditFolder) void handleAfterEditFolder(undefined)
          },
        },
      )
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen: (x) => setIsOpen(x),
  }))
  return (
    <Modal
      zIndex={10001}
      open={isOpen}
      title={folder ? 'New folder name' : 'Add New Folder'}
      onOk={() => {
        form.submit()
      }}
      onCancel={onClose}
      okText={folder ? 'Save' : 'Create'}
      forceRender
      confirmLoading={!!isLoadingPostFolder || !!isLoadingPatchFolderById}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Folder name is required!',
            },
            {
              max: 30,
              message: 'Folder name cannot be longer than 30 characters!',
            },
            {
              min: 3,
              message: 'Folder name must be at least 3 characters!',
            },
          ]}
        >
          <Input placeholder="New folder name" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(CreateEditFolderModal)
