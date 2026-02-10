/* eslint-disable react/function-component-definition */
import { CopyOutlined, FileExclamationOutlined, FileTextOutlined, PlaySquareOutlined } from '@ant-design/icons'
import { TFile, TPatchFile, TQueryFile } from '@src/modules'
import { useMutationPatchFileById } from '@src/queries/hooks'
import { Button, Col, Divider, Form, Image, Input, Modal, Row, Space, Tooltip, Typography, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import placeholderImage from '@assets/placeholder-image.jpeg'
import { regexAudio, regexDocument, regexImage, regexVideo } from '@src/utils/regex'
import { LIST_FILE } from '@src/queries/keys'
import { queryClient } from '@src/queries'
import { TResDataListApi } from '@src/configs/interface.config'
import { FORMAT_TIME_DEFAULT } from '@src/configs/const.config'

const { Text } = Typography

type TDetailFileModal = {
  file?: TFile
  handleAfterEditFile?: (f: TFile | undefined) => void
  paramsQsFiles?: TQueryFile
}

export type THandleDetailFileModal = {
  onOpen: (x: boolean) => void
}

const DetailFileModal: React.ForwardRefRenderFunction<THandleDetailFileModal, TDetailFileModal> = (
  { file, handleAfterEditFile, paramsQsFiles },
  ref,
) => {
  const [onOpen, setOnOpen] = useState(false)
  const [form] = Form.useForm<TPatchFile>()

  const fileType = useMemo(() => {
    if (file?.originalname?.match(regexImage)) {
      return 'image'
    }
    if (file?.originalname?.match(regexDocument)) {
      return 'docx'
    }
    if (file?.originalname?.match(regexVideo) || file?.originalname?.match(regexAudio)) {
      return 'audio'
    }
    return 'unknown'
  }, [file])

  const { mutate: mutatePatchFileById, isLoading: isLoadingPatchFileById } = useMutationPatchFileById()
  const onFinish = (values: TPatchFile) => {
    if (file) {
      mutatePatchFileById(
        { id: file?._id, data: values },
        {
          onSuccess: () => {
            const old = queryClient.getQueryData<TResDataListApi<TFile[]>>([LIST_FILE, JSON.stringify(paramsQsFiles)])
            const oldData = old?.data || []
            queryClient.setQueryData([LIST_FILE, JSON.stringify(paramsQsFiles)], () => {
              if (oldData?.length <= 0) return { ...old, data: [] }
              const index = oldData.findIndex((item) => item._id === file._id)
              if (index >= 0) {
                return {
                  ...old,
                  data: [...oldData.slice(0, index), { ...oldData[index], ...values }, ...oldData.slice(index + 1)],
                }
              }
              return { ...old }
            })
          },
        },
      )
    }
  }

  const onClose = () => {
    form.resetFields()
    setOnOpen(false)
    if (handleAfterEditFile) void handleAfterEditFile(undefined)
  }

  useEffect(() => {
    form.setFieldsValue({
      name: file?.name,
      alt: file?.alt || undefined,
      description: file?.description || undefined,
      caption: file?.caption || undefined,
    })
  }, [file])

  useImperativeHandle(ref, () => ({
    onOpen: (x) => setOnOpen(x),
  }))
  return (
    <Modal
      open={onOpen}
      width="96%"
      title="Attachment Details"
      style={{ maxHeight: '96%', overflow: 'hidden', top: 30 }}
      onOk={() => form.submit()}
      onCancel={onClose}
      okText="Save"
      className="media-model-detail-file"
      forceRender
      confirmLoading={!!isLoadingPatchFileById}
      zIndex={1201}
    >
      <Divider />
      <Row gutter={[24, 24]} className="attachment-detail-container">
        <Col span={16}>
          <Row justify="center" align="middle">
            <Col>
              {fileType === 'image' && (
                <Image style={{ maxHeight: 500 }} src={file?.location || placeholderImage} preview={false} />
              )}
              {fileType === 'docx' && <FileTextOutlined style={{ fontSize: 120 }} />}
              {fileType === 'audio' && <PlaySquareOutlined style={{ fontSize: 120 }} />}
              {fileType === 'unknown' && <FileExclamationOutlined style={{ fontSize: 120 }} />}
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row className="attachment-info" align="top" justify="start" gutter={[0, 0]}>
            <Col span={24}>
              <Space direction="vertical" size={3}>
                <Text>
                  <b>Upload on:</b> {dayjs(file?.createdAt).format(FORMAT_TIME_DEFAULT)}
                </Text>
                <Text>
                  <b>Uploaded by:</b> {file?.author?.username}
                </Text>
                <Text>
                  <b>File name:</b> {file?.name}
                </Text>
                <Text>
                  <b>File type:</b> {file?.mimetype}
                </Text>
                <Text>
                  <b>File size:</b> {file?.size} B
                </Text>
                {fileType === 'image' && (
                  <Text>
                    <b>Dimensions:</b> {file?.width} by {file?.height} pixels
                  </Text>
                )}
              </Space>
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <Form form={form} onFinish={onFinish}>
                <Form.Item label="Alternative Text" labelCol={{ span: 8 }} name="alt">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Title"
                  labelCol={{ span: 8 }}
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: 'Name is required!',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Caption" labelCol={{ span: 8 }} name="caption">
                  <TextArea />
                </Form.Item>
                <Form.Item label="Description" labelCol={{ span: 8 }} name="description">
                  <TextArea />
                </Form.Item>
                <Form.Item label="File URL" labelCol={{ span: 8 }}>
                  <Input.Group compact>
                    <Input disabled style={{ width: 'calc(100% - 32px)' }} value={file?.location} />
                    <Tooltip title="copy file url" zIndex={1202}>
                      <Button
                        icon={<CopyOutlined />}
                        onClick={() => {
                          navigator.clipboard.writeText(file?.location || '')
                          message.success('Copy')
                        }}
                      />
                    </Tooltip>
                  </Input.Group>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider />
    </Modal>
  )
}

export default forwardRef(DetailFileModal)
