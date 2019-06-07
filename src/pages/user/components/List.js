import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleUserClick = (record, e) => {
    const { onDeleteItem, onEditItem, i18n } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
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
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 120,
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
        width: 120,
      },
      {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
        width: 120,
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 120,
        render: text => <span>{text ? '男' : '女'}</span>,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 120,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 120,
      },
      {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        key: 'registerTime',
        width: 120,
      },
      {
        title: '用户类型',
        dataIndex: 'type',
        key: 'type',
        width: 120,
        render: text => <span>{text==99 ? '管理员' : '普通用户'}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
      },
      {
        title: '启用',
        dataIndex: 'valid',
        key: 'valid',
        width: 120,
        render: text => <span>{text ? '是' : '否'}</span>,
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleUserClick(record, e)}
              menuOptions={[
                { key: '1', name: '更新' },
                { key: '2', name: '删除' },
              ]}
            />
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
        scroll={{ x: 1400 }}
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
