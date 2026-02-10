/* eslint-disable react/function-component-definition */
import { TResDataListApi } from '@src/configs/interface.config'
import { TFolder, TQueryFolder } from '@src/modules'
import { queryClient } from '@src/queries'
import { useMutationRemoveFolderById } from '@src/queries/hooks'
import { LIST_FOLDER } from '@src/queries/keys'
import { Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

type TDeleteFolderModal = {
  folderId: string
  paramsQsFolders: TQueryFolder
}
export type THandleDeleteFolderModal = {
  onOpen: (x: boolean) => void
}

const DeleteFolderModal: React.ForwardRefRenderFunction<THandleDeleteFolderModal, TDeleteFolderModal> = (
  { folderId, paramsQsFolders },
  ref,
) => {
  const [onOpen, setOnOpen] = useState(false)

  const { mutate: mutateRemoveFolderById, isLoading: isLoadingRemoveFolderById } = useMutationRemoveFolderById()
  const onDelete = () => {
    if (folderId) {
      mutateRemoveFolderById(folderId, {
        onSuccess: () => {
          const old = queryClient.getQueryData<TResDataListApi<TFolder[]>>([
            LIST_FOLDER,
            JSON.stringify(paramsQsFolders),
          ])
          queryClient.setQueryData([LIST_FOLDER, JSON.stringify(paramsQsFolders)], () => {
            const oldData = old?.data || []
            if (oldData?.length <= 0) return { ...old, data: [] }
            const index = oldData.findIndex((item) => item._id === folderId)
            if (index >= 0) {
              setOnOpen(false)
              return {
                ...old,
                data: [...oldData.slice(0, index), ...oldData.slice(index + 1)],
              }
            }
            return { ...old }
          })
        },
      })
    }
  }

  useImperativeHandle(ref, () => ({
    onOpen: (x: boolean) => setOnOpen(x),
  }))
  return (
    <Modal
      zIndex={10001}
      open={onOpen}
      title="Are you sure to want to delete this folder?"
      okText="Remove"
      onOk={onDelete}
      onCancel={() => setOnOpen(false)}
      confirmLoading={!!isLoadingRemoveFolderById}
    />
  )
}

export default forwardRef(DeleteFolderModal)
