import { SearchOutlined } from '@ant-design/icons'
import { Button, Col, Input, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import { FilterConfirmProps } from 'antd/es/table/interface'

const handleSearch = (confirm: (param?: FilterConfirmProps) => void) => {
  confirm()
}

const handleReset = (clearFilters: () => void, confirm: (param?: FilterConfirmProps) => void) => {
  clearFilters()
  confirm()
}

function getColumnSearchProps<T>(dataIndex: string, title: string): ColumnType<T> {
  return {
    filterDropdown: ({ close, confirm, setSelectedKeys, selectedKeys, clearFilters }) => (
      <Col style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(confirm)}
          placeholder={`Search ${title}`}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(confirm)}
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters, confirm)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close()
            }}
          >
            Close
          </Button>
        </Space>
      </Col>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
  }
}
export default getColumnSearchProps
