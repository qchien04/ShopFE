/* eslint-disable react/function-component-definition */
import PageHeader from '@src/components/widgets/PageHeader'
import { Breadcrumb, Col, Divider, Empty, Row, Skeleton } from 'antd'
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useQueryFolderById, useQueryFolderMakeTree, useQueryListFile, useQueryListFolder } from '@src/queries/hooks'
import { checkAuth } from '@src/libs/localStorage'
import { EOrder, EOrderBy } from '@src/configs/interface.config'
import { TFile, TFolder, TQueryFile, TQueryFolder } from '@src/modules'
import { FolderAddOutlined, UploadOutlined } from '@ant-design/icons'

import FolderItem from './components/FolderItem'
import FileItem from './components/FileItem'
import SkeletonFile from './components/SkeletonFile'
import CreateEditFolderModal, { THandleCreateEditFolderModal } from './components/CreateEditFolderModal'
import TreeFolderModal, { THandleTreeFolderModal } from './components/TreeFolderModal'
import DeleteFolderModal, { THandleDeleteFolderModal } from './components/DeleteFolderModal'
import DeleteFileModal, { THandleDeleteFileModal } from './components/DeleteFileModal'
import DetailFileModal, { THandleDetailFileModal } from './components/DetailFileModal'
import FileUploadModal, { THandleFileUploadModal } from './components/FileUploadModal'

type TMediaScreen = {
  position?: 'modal' | 'page'
  filesSelected?: TFile[]
  handleSelectFile?: (file: TFile) => void
}

export type THandleMediaScreen = {
  openModalAddFolder: () => void
  openModalUpload: () => void
  resetStates: () => void
  onSearch: (v: string) => void
}

const MediaScreen: React.ForwardRefRenderFunction<THandleMediaScreen, TMediaScreen> = (
  { position = 'page', filesSelected = [], handleSelectFile },
  ref,
) => {
  const token = checkAuth()
  const createEditFolderModalRef = useRef<null | THandleCreateEditFolderModal>(null)
  const treeFolderModalRef = useRef<null | THandleTreeFolderModal>(null)
  const deleteFolderModalRef = useRef<null | THandleDeleteFolderModal>(null)
  const deleteFileModalRef = useRef<null | THandleDeleteFileModal>(null)
  const detailFileModalRef = useRef<null | THandleDetailFileModal>(null)
  const fileUploadModalRef = useRef<null | THandleFileUploadModal>(null)

  const [s, setS] = useState<string>()
  const [folderIdCurrent, setFolderIdCurrent] = useState<string>()
  const [folderUpdate, setFolderUpdate] = useState<TFolder>()
  const [folderMove, setFolderMove] = useState<TFolder>()
  const [folderIdDelete, setFolderIdDelete] = useState<string>('')
  const [fileIdDelete, setFileIdDelete] = useState<string>('')
  const [fileMove, setFileMove] = useState<TFile>()
  const [fileUpdate, setFileUpdate] = useState<TFile>()
  // const [filesSelect, setFilesSelect] = useState<TFile[]>([])

  useImperativeHandle(ref, () => ({
    openModalAddFolder: () => createEditFolderModalRef.current?.onOpen(true),
    openModalUpload: () => fileUploadModalRef.current?.onOpen(true),
    resetStates: () => {
      setFileUpdate(undefined)
      setFileMove(undefined)
      setFolderIdDelete('')
      setFileIdDelete('')
      setFileMove(undefined)
      setFileUpdate(undefined)
    },
    onSearch: (v) => setS(v),
  }))

  // Init params query folders
  const paramsQueryFolders: TQueryFolder = useMemo(() => {
    if (s)
      return { page: 1, limit: 0, order: EOrder.DESC, orderBy: EOrderBy.CREATED_DATE, parentId: folderIdCurrent, s }
    return { page: 1, limit: 0, order: EOrder.DESC, orderBy: EOrderBy.CREATED_DATE, parentId: folderIdCurrent }
  }, [folderIdCurrent, s])

  // Query folders
  const {
    data: FoldersData,
    isLoading: isLoadingFolders,
    isFetching: isFetchingFolders,
  } = useQueryListFolder({ ...paramsQueryFolders }, token)

  // Query folder detail
  const {
    data: folderData,
    isLoading: isLoadingFolder,
    isFetching: isFetchingFolder,
  } = useQueryFolderById(folderIdCurrent || '', token)
  const folders = useMemo(() => FoldersData?.data || [], [FoldersData, isLoadingFolders, isFetchingFolders])
  const path = useMemo(() => folderData?.path || [], [folderData, isLoadingFolder, isFetchingFolder])

  // Init params query file
  const paramsQueryFiles: TQueryFile = useMemo(() => {
    if (s)
      return { page: 1, limit: 0, order: EOrder.DESC, orderBy: EOrderBy.CREATED_DATE, folderId: folderIdCurrent, s }
    return { page: 1, limit: 0, order: EOrder.DESC, orderBy: EOrderBy.CREATED_DATE, folderId: folderIdCurrent }
  }, [folderIdCurrent, s])
  // Query files
  const {
    data: fileData,
    isLoading: isLoadingFile,
    isFetching: isFetchingFile,
  } = useQueryListFile(paramsQueryFiles, token)
  const files = useMemo(() => fileData?.data || [], [fileData, isFetchingFile, isLoadingFile])

  // Query folder tree
  const { data: folderMakeTreeData } = useQueryFolderMakeTree(token)

  // Handle click folder
  const handleClickFolder = (folderId: string) => {
    setFolderIdCurrent(folderId)
  }

  // Handle edit folder
  const handleEditFolder = (folderU: TFolder | undefined) => {
    setFolderUpdate(folderU)
    createEditFolderModalRef.current?.onOpen(!!folderU)
  }

  // Handle delete folder
  const handleDeleteFolder = (folderId: string) => {
    setFolderIdDelete(folderId)
    deleteFolderModalRef.current?.onOpen(!!folderId)
  }

  // handle move folder
  const handleMoveFolder = (folderM: TFolder | undefined) => {
    setFolderMove(folderM)
    treeFolderModalRef.current?.onOpen(!!folderM)
  }

  // Handle delete file
  const handleDeleteFile = (fileId: string) => {
    setFileIdDelete(fileId)
    deleteFileModalRef.current?.onOpen(!!fileId)
  }

  // Handle delete file
  const handleMoveFile = (fileM: TFile | undefined) => {
    setFileMove(fileM)
    treeFolderModalRef.current?.onOpen(!!fileM)
  }

  // Handle edit file
  const handleEditFile = (fileM: TFile | undefined) => {
    setFileUpdate(fileM)
    detailFileModalRef.current?.onOpen(!!fileM)
  }

  return (
    <>
      <Col span={24} style={{ position: 'relative' }}>
        {position === 'page' && (
          <PageHeader
            title="Media Manager"
            isBack
            extra={[
              {
                text: 'Create Folder',
                action: () => createEditFolderModalRef.current?.onOpen(true),
                icon: <FolderAddOutlined />,
              },
              {
                text: 'Upload File',
                action: () => fileUploadModalRef.current?.onOpen(true),
                icon: <UploadOutlined />,
              },
            ]}
            onSearch={(v) => setS(v)}
          />
        )}
        {/* Breadcrumb */}
        <Row style={{ marginBottom: 24 }}>
          <Breadcrumb>
            {path?.length > 0 ? (
              path?.map((p, index) => {
                if (p?.name === 'root')
                  return (
                    <Breadcrumb.Item
                      key={index}
                      onClick={(e) => {
                        e.preventDefault()
                        setFolderIdCurrent(undefined)
                      }}
                      href={`/folder/${p?._id}`}
                    >
                      Media Library
                    </Breadcrumb.Item>
                  )
                if (p?._id === folderIdCurrent) return <Breadcrumb.Item key={index}>{p?.name}</Breadcrumb.Item>
                return (
                  <Breadcrumb.Item
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      setFolderIdCurrent(p?._id)
                    }}
                    href={`/folder/${p?._id}`}
                  >
                    {p?.name}
                  </Breadcrumb.Item>
                )
              })
            ) : (
              <Breadcrumb.Item>Media Library</Breadcrumb.Item>
            )}
          </Breadcrumb>
        </Row>
        {/* Folder / File */}
        <Row gutter={[20, 0]}>
          <Col span={24}>
            {/* Folder */}
            <Row gutter={[15, 15]}>
              {isLoadingFolder ? (
                <>
                  {Array.from(Array(8).keys()).map((_, index) => (
                    <Col xl={4} lg={6} md={8} sm={12} xs={24} xxl={3} key={index}>
                      <Skeleton.Input active size="default" block />
                    </Col>
                  ))}
                </>
              ) : (
                folders?.length > 0 &&
                folders?.map((folder, index) => (
                  <Col xl={4} lg={6} md={8} sm={12} xs={24} xxl={3} key={index}>
                    <FolderItem
                      folder={folder}
                      handleClick={(id) => handleClickFolder(id)}
                      handleEdit={(f) => handleEditFolder(f)}
                      handleDelete={(id) => handleDeleteFolder(id)}
                      handleMove={(f) => handleMoveFolder(f)}
                    />
                  </Col>
                ))
              )}
            </Row>
          </Col>
          {((folders && folders?.length > 0) || isLoadingFolder) && (
            <Col span={24}>
              <Divider />
            </Col>
          )}
          <Col span={24}>
            {/* File */}
            <Row gutter={[15, 15]}>
              {isLoadingFile ? (
                <>
                  {Array.from(Array(8).keys()).map((_, index) => (
                    <Col xxl={2} xl={3} lg={4} md={6} sm={8} xs={12} key={index}>
                      <SkeletonFile />
                    </Col>
                  ))}
                </>
              ) : files?.length > 0 ? (
                files?.map((file, index) => {
                  const classSelected =
                    filesSelected.findIndex((item) => item._id === file._id) >= 0
                      ? 'file-media-selected'
                      : 'file-media-not-selected'
                  return (
                    <Col xxl={2} xl={3} lg={4} md={6} sm={8} xs={12} key={index} className={`${classSelected}`}>
                      <FileItem
                        file={file}
                        handleDelete={(id) => handleDeleteFile(id)}
                        handleMove={(f) => handleMoveFile(f)}
                        handleEdit={(f) => handleEditFile(f)}
                        handleClick={(f) => {
                          if (position === 'page') {
                            handleEditFile(f)
                          } else if (handleSelectFile) void handleSelectFile(file)
                        }}
                      />
                    </Col>
                  )
                })
              ) : (
                <Col span={24}>
                  <Empty description="No media items found." />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Col>
      <CreateEditFolderModal
        ref={createEditFolderModalRef}
        folder={folderUpdate}
        paramQsFolders={paramsQueryFolders}
        folderIdCurrent={folderIdCurrent}
        handleAfterEditFolder={(f) => handleEditFolder(f)}
      />
      <TreeFolderModal
        folderMakeTree={folderMakeTreeData?.data}
        ref={treeFolderModalRef}
        handleAfterMoveFolder={(f) => handleMoveFolder(f)}
        folder={folderMove}
        paramsQsFolders={paramsQueryFolders}
        handleAfterMoveFile={(f) => handleMoveFile(f)}
        paramsQsFiles={paramsQueryFiles}
        file={fileMove}
      />
      <DeleteFolderModal ref={deleteFolderModalRef} folderId={folderIdDelete} paramsQsFolders={paramsQueryFolders} />
      <DeleteFileModal ref={deleteFileModalRef} fileId={fileIdDelete} paramsQsFiles={paramsQueryFiles} />
      <DetailFileModal
        ref={detailFileModalRef}
        file={fileUpdate}
        handleAfterEditFile={(f) => handleEditFile(f)}
        paramsQsFiles={paramsQueryFiles}
      />
      <FileUploadModal ref={fileUploadModalRef} paramsQsFiles={paramsQueryFiles} folderId={folderIdCurrent} />
    </>
  )
}

export default forwardRef(MediaScreen)
