import { LANGUAGE_COLUMN, PUBLISHED_COLUMN } from '@src/components/elements/ColumnTableItem'
import { TTaxonomyMakeTree } from '@src/modules'
import { queryClient } from '@src/queries'
import { useMutationRemoveTaxonomyById } from '@src/queries/hooks'
import { MAKE_TREE_TAXONOMY } from '@src/queries/keys'
import { Popconfirm, Button, Space, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate } from 'react-router-dom'

export const columnsTableTaxonomy = (prefixDetailUrl: string, postType: string): ColumnsType<TTaxonomyMakeTree> => {
  const navigate = useNavigate()
  const { mutate } = useMutationRemoveTaxonomyById()
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render(name, record) {
        return (
          <Link to={`/${prefixDetailUrl}/${record._id}`}>
            <Typography.Text>{name}</Typography.Text>
          </Link>
        )
      },
      fixed: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (v) => v || '__',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    LANGUAGE_COLUMN,
    PUBLISHED_COLUMN,
    {
      title: 'Action',
      width: 180,
      key: 'action',
      render: (_, record: TTaxonomyMakeTree) => (
        <Space size={5}>
          <Button type="link" onClick={() => navigate(`/${prefixDetailUrl}/${record._id}`)}>
            Detail
          </Button>
          <Popconfirm
            placement="topRight"
            title="Are you sure?"
            onConfirm={() =>
              mutate(record._id, {
                onSuccess: () => {
                  queryClient.refetchQueries([MAKE_TREE_TAXONOMY, postType])
                },
              })
            }
          >
            <Button type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
      fixed: 'right',
    },
  ]
}
