import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar, Button } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'
import { isAllowed } from '../../../auth'
import router from 'umi/router'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props
    if (e === '1') {
      onEditItem(record)
    } else if (e === '2') {
      router.push('/folk/cemetery/' + record.id)
    } else if (e === '3') {
      confirm({
        title: '你确定要删除这条记录吗？',
        onOk() {
          onDeleteItem(record.id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props

    const columns = [
      {
        title: '祖名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: '落地点',
        dataIndex: 'address',
        key: 'address',
        width: '25%',
      },
      {
        title: '宝地形状',
        dataIndex: 'shape',
        key: 'shape',
        width: '25%',
      },
      {
        title: '启用',
        dataIndex: 'valid',
        key: 'valid',
        width: '20%',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <Button.Group>
              {isAllowed('cemetery.update') && (
                <Button
                  icon="edit"
                  onClick={e => this.handleClick(record, '1')}
                  size={'small'}
                >
                  修改
                </Button>
              )}
              {isAllowed('cemetery.view') && (
                <Button
                  icon="eye"
                  onClick={e => this.handleClick(record, '2')}
                  size={'small'}
                >
                  查看
                </Button>
              )}
              {isAllowed('cemetery.delete') && (
                <Button
                  icon="delete"
                  onClick={e => this.handleClick(record, '3')}
                  size={'small'}
                >
                  删除
                </Button>
              )}
            </Button.Group>
          )
        },
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: total => i18n.t`Total ${total} Items`,
        }}
        className={styles.table}
        bordered
        scroll={{ x: '100%' }}
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
