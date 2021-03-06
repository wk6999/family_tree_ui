import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Button } from 'antd'
import { Trans, withI18n } from '@lingui/react'
import Link from 'umi/link'
import styles from './List.less'
import router from 'umi/router'
import { isAllowed } from '../../../auth'

const { confirm } = Modal

@withI18n()
class List extends PureComponent {
  handleUserClick = (record, e) => {
    const { onDeleteItem, onEditItem, onLink } = this.props
    if (e === '1') {
      onEditItem(record)
    } else if (e === '2') {
      router.replace('/folk/categoryContent/' + record.id)
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
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: '20%',
        // render: (text, record) => (
        //   <Link to={`/folk/categorycontent/${record.id}`}>{text}</Link>
        // ),
      },
      {
        title: '子标题',
        dataIndex: 'subTitle',
        key: 'subTitle',
        width: '20%',
      },
      {
        title: '类别',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: '20%',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '10%',
      },
      {
        title: '启用',
        dataIndex: 'valid',
        key: 'valid',
        width: '10%',
      },
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      //   key: 'remark',
      //   width: '20%',
      // },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        render: (text, record) => {
          return (
            <Button.Group>
              {isAllowed('category_content.update') && (
                <Button
                  icon="edit"
                  onClick={e => this.handleUserClick(record, '1')}
                  size={'small'}
                >
                  修改
                </Button>
              )}
              {isAllowed('category_content.view') && (
                <Button
                  icon="eye"
                  onClick={e => this.handleUserClick(record, '2')}
                  size={'small'}
                >
                  查看
                </Button>
              )}
              {isAllowed('category_content.update') && (
                <Button
                  icon="delete"
                  onClick={e => this.handleUserClick(record, '3')}
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
