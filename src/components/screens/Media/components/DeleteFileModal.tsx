/* eslint-disable react/function-component-definition */
import { TResDataListApi } from '@src/configs/interface.config'
import { TFolder, TQueryFolder } from '@src/modules'
import { queryClient } from '@src/queries'
import { useMutationRemoveFileById } from '@src/queries/hooks'
import { LIST_FILE } from '@src/queries/keys'
import { Modal } from 'antd'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

type TDeleteFileModal = {
  fileId: string
  paramsQsFiles: TQueryFolder
}
export type THandleDeleteFileModal = {
  onOpen: (x: boolean) => void
}

const DeleteFileModal: React.ForwardRefRenderFunction<THandleDeleteFileModal, TDeleteFileModal> = (
  { fileId, paramsQsFiles },
  ref,
) => {
  const [onOpen, setOnOpen] = useState(false)

  const { mutate: mutateRemoveFileById, isLoading: isLoadingRemoveFileById } = useMutationRemoveFileById()
  const onDelete = () => {
    if (fileId) {
      mutateRemoveFileById(fileId, {
        onSuccess: () => {
          const old = queryClient.getQueryData<TResDataListApi<TFolder[]>>([LIST_FILE, JSON.stringify(paramsQsFiles)])
          queryClient.setQueryData([LIST_FILE, JSON.stringify(paramsQsFiles)], () => {
            const oldData = old?.data || []
            if (oldData?.length <= 0) return { ...old, data: [] }
            const index = oldData.findIndex((item) => item._id === fileId)
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
      open={onOpen}
      title="Are you sure to want to delete this folder?"
      okText="Remove"
      onOk={onDelete}
      onCancel={() => setOnOpen(false)}
      confirmLoading={!!isLoadingRemoveFileById}
      zIndex={10001}
    />
  )
}

export default forwardRef(DeleteFileModal)
