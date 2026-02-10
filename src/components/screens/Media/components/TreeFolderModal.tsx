/* eslint-disable react/function-component-definition */
import { FOLDER_ROOT_ID, NWarning } from '@src/configs/const.config'
import { TResDataListApi } from '@src/configs/interface.config'
import { TFile, TFolder, TFolderMakeTree, TMoveFolder, TQueryFile, TQueryFolder } from '@src/modules'
import { queryClient } from '@src/queries'
import { useMutationMoveFileById, useMutationMoveFolderById } from '@src/queries/hooks'
import { FOLDER_MAKE_TREE, LIST_FILE, LIST_FOLDER } from '@src/queries/keys'
import { Form, Modal, notification, TreeSelect } from 'antd'
import { SHOW_ALL } from 'rc-tree-select'
import React, { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

type TTreeFolderModal = {
  folderMakeTree?: TFolderMakeTree
  handleAfterMoveFolder?: (folder: TFolder | undefined) => void
  handleAfterMoveFile?: (file: TFile | undefined) => void
  file: TFile | undefined
  folder: TFolder | undefined
  paramsQsFolders?: TQueryFolder
  paramsQsFiles?: TQueryFile
}

export type THandleTreeFolderModal = {
  onOpen: (x: boolean) => void
}

const TreeFolderModal: React.ForwardRefRenderFunction<THandleTreeFolderModal, TTreeFolderModal> = (
  { folderMakeTree, handleAfterMoveFolder, folder, paramsQsFolders, handleAfterMoveFile, file, paramsQsFiles },
  ref,
) => {
  const [form] = Form.useForm<TMoveFolder>()
  const [onOpen, setOnOpen] = useState(false)

  const treeData = useMemo(
    () => [
      {
        ...folderMakeTree,
      },
    ],
    [folderMakeTree],
  )

  const onClose = () => {
    form.resetFields()
    setOnOpen(false)
    if (handleAfterMoveFolder && folder) void handleAfterMoveFolder(undefined)
    if (handleAfterMoveFile && file) void handleAfterMoveFile(undefined)
  }

  const { mutate: mutateMoveFolderById, isLoading: isLoadingMoveFolderById } = useMutationMoveFolderById()
  const { mutate: mutateMoveFileById, isLoading: isLoadingMoveFileById } = useMutationMoveFileById()
  const onFinish = ({ newParentId }: TMoveFolder) => {
    if (folder) {
      if (folder?.parent?._id === newParentId) {
        notification.warning({
          message: NWarning,
          description: 'The destination directory is the same as the current directory parent!',
        })
        return false
      }
      if (folder?._id === newParentId) {
        notification.warning({
          message: NWarning,
          description: 'The destination directory is the same as the current directory!',
        })
        return false
      }

      mutateMoveFolderById(
        { id: folder?._id, data: { newParentId } },
        {
          onSuccess: () => {
            // Update make tree folder
            queryClient.invalidateQueries([FOLDER_MAKE_TREE])

            // Update folder current
            const old = queryClient.getQueryData<TResDataListApi<TFolder[]>>([
              LIST_FOLDER,
              JSON.stringify(paramsQsFolders),
            ])
            queryClient.setQueryData([LIST_FOLDER, JSON.stringify(paramsQsFolders)], () => {
              const oldData = old?.data || []
              if (oldData?.length <= 0) return { ...old, data: [] }
              const index = oldData.findIndex((item) => item._id === folder._id)
              if (index >= 0) {
                setOnOpen(false)
                return {
                  ...old,
                  data: [...oldData.slice(0, index), ...oldData.slice(index + 1)],
                }
              }
              return { ...old }
            })

            // Invalidate Queries destination folder
            queryClient.invalidateQueries([
              LIST_FOLDER,
              JSON.stringify({
                ...paramsQsFolders,
                parentId: newParentId === FOLDER_ROOT_ID ? undefined : newParentId,
              }),
            ])
            void onClose()
          },
        },
      )
      return true
    }

    if (file) {
      const folderId = newParentId
      if (file?.folder?._id === folderId) {
        notification.warning({
          message: NWarning,
          description: 'The destination directory is the same as the current directory!',
        })
        return false
      }
      mutateMoveFileById(
        { id: file?._id, data: { folderId: folderId === FOLDER_ROOT_ID ? undefined : folderId } },
        {
          onSuccess: () => {
            // Update file current
            const old = queryClient.getQueryData<TResDataListApi<TFile[]>>([LIST_FILE, JSON.stringify(paramsQsFiles)])
            queryClient.setQueryData([LIST_FILE, JSON.stringify(paramsQsFiles)], () => {
              const oldData = old?.data || []
              if (oldData?.length <= 0) return { ...old, data: [] }
              const index = oldData.findIndex((item) => item._id === file._id)
              if (index >= 0) {
                setOnOpen(false)
                return {
                  ...old,
                  data: [...oldData.slice(0, index), ...oldData.slice(index + 1)],
                }
              }
              return { ...old }
            })

            // Invalidate Queries destination file
            queryClient.invalidateQueries([
              LIST_FILE,
              JSON.stringify({
                ...paramsQsFiles,
                folderId: folderId === FOLDER_ROOT_ID ? undefined : folderId,
              }),
            ])
            void onClose()
          },
        },
      )
    }
    return false
  }

  useImperativeHandle(ref, () => ({
    onOpen: (x) => setOnOpen(x),
  }))
  return (
    <Modal
      open={onOpen}
      title="Select the folders where the media belong"
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Move"
      confirmLoading={!!isLoadingMoveFolderById || !!isLoadingMoveFileById}
      zIndex={10001}
    >
      <div id="new-parent-id">
        <Form onFinish={onFinish} form={form}>
          <Form.Item
            name="newParentId"
            rules={[
              {
                required: true,
                message: 'Folder Parent is required!',
              },
            ]}
          >
            <TreeSelect
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              placeholder="Please select folder parent"
              fieldNames={{ label: 'name', value: '_id', children: 'children' }}
              bordered
              showCheckedStrategy={SHOW_ALL}
              treeLine
              treeDefaultExpandAll
              dropdownMatchSelectWidth={false}
              allowClear
              getPopupContainer={() => document.getElementById('new-parent-id') as HTMLElement}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default forwardRef(TreeFolderModal)
