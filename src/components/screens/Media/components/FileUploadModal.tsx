/* eslint-disable react/function-component-definition */
import { InboxOutlined } from '@ant-design/icons'
import { Modal, Upload } from 'antd'
import { beforeUpload } from '@libs/upload'
import { uploadFileBySystem } from '@src/queries/apis'
import { EMediaSystem, TFile, TQueryFile } from '@src/modules'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { queryClient } from '@src/queries'
import { TResDataListApi } from '@src/configs/interface.config'
import { LIST_FILE } from '@src/queries/keys'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'

const { Dragger } = Upload

type TFileUploadModal = {
  folderId?: string
  paramsQsFiles?: TQueryFile
}

export type THandleFileUploadModal = {
  onOpen: (x: boolean) => void
}

const FileUploadModal: React.ForwardRefRenderFunction<THandleFileUploadModal, TFileUploadModal> = (
  { folderId, paramsQsFiles },
  ref,
) => {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultFileList, setDefaultFileList] = useState<UploadFile<any>[]>([])

  const onClose = () => {
    setIsOpen(false)
    setDefaultFileList([])
  }

  const onUploadImage = async (options: any) => {
    const { onSuccess, onError, file } = options
    const fmData = new FormData()
    fmData.append('file', file)
    fmData.append('isWebp', '1')
    if (folderId) fmData.append('folderId', folderId)

    try {
      const res = await uploadFileBySystem(EMediaSystem.S3, fmData)
      if (res.statusCode === 200) {
        const old = queryClient.getQueryData<TResDataListApi<TFile[]>>([LIST_FILE, JSON.stringify(paramsQsFiles)])
        const oldData = old?.data || []
        queryClient.setQueryData([LIST_FILE, JSON.stringify(paramsQsFiles)], () => ({
          ...old,
          data: [res.data, ...oldData],
        }))
        onSuccess('Ok')
      }
    } catch (err) {
      onError({ err })
    }
  }

  const handleOnChange: UploadProps['onChange'] = ({ fileList }) => {
    setDefaultFileList(fileList)
  }

  useImperativeHandle(ref, () => ({
    onOpen: (x) => setIsOpen(x),
  }))

  return (
    <Modal
      open={isOpen}
      title="Upload Files"
      okText={null}
      okButtonProps={{ style: { display: 'none' } }}
      width={900}
      onCancel={onClose}
      zIndex={10001}
      cancelText="Đóng"
    >
      <Dragger
        beforeUpload={beforeUpload}
        listType="picture"
        multiple
        onDrop={(e) => {
          console.log('Dropped files', e.dataTransfer.files)
        }}
        name="file"
        customRequest={onUploadImage}
        onChange={handleOnChange}
        defaultFileList={defaultFileList}
        fileList={defaultFileList}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
        </p>
      </Dragger>
    </Modal>
  )
}

export default forwardRef(FileUploadModal)
